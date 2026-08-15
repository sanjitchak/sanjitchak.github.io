export type PhonePeEnv = {
  PHONEPE_CLIENT_ID?: string;
  PHONEPE_CLIENT_SECRET?: string;
  PHONEPE_CLIENT_VERSION?: string;
  PHONEPE_WEBHOOK_USERNAME?: string;
  PHONEPE_WEBHOOK_PASSWORD?: string;
};

type PhonePeOrderRow = {
  id: string;
  optin_id: string;
  amount_paise: number;
  currency: string;
  status: string;
  phonepe_order_id: string | null;
  transaction_id: string | null;
  paid_at: string | null;
};

type PhonePeStatus = {
  orderId?: string;
  state?: string;
  amount?: number;
  paymentDetails?: Array<{ transactionId?: string; state?: string }>;
};

const PHONEPE_API = "https://api.phonepe.com";
const MIN_AMOUNT_PAISE = 100;
const MAX_AMOUNT_PAISE = 1_000_000_000;
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const encoder = new TextEncoder();

export const phonePeCheckoutSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS checkout_contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS checkout_contact_phones (
    contact_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_key TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (contact_id, phone_key),
    FOREIGN KEY (contact_id) REFERENCES checkout_contacts(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS checkout_activities (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    metadata_json TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES checkout_contacts(id) ON DELETE RESTRICT
  )`,
  `CREATE TABLE IF NOT EXISTS phonepe_payment_orders (
    id TEXT PRIMARY KEY,
    optin_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    amount_paise INTEGER NOT NULL CHECK(amount_paise >= 100),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL,
    phonepe_order_id TEXT UNIQUE,
    transaction_id TEXT UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    paid_at TEXT,
    FOREIGN KEY (optin_id) REFERENCES checkout_contacts(id) ON DELETE RESTRICT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_checkout_contacts_email ON checkout_contacts(email)`,
  `CREATE INDEX IF NOT EXISTS idx_checkout_phones_key ON checkout_contact_phones(phone_key)`,
  `CREATE INDEX IF NOT EXISTS idx_phonepe_orders_email ON phonepe_payment_orders(email, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_phonepe_orders_status ON phonepe_payment_orders(status, updated_at DESC)`,
];

let schemaReady: Promise<void> | null = null;
export async function ensurePhonePeCheckoutSchema(db: D1Database) {
  if (!schemaReady) schemaReady = db.batch(phonePeCheckoutSchemaStatements.map((statement) => db.prepare(statement))).then(() => undefined);
  try {
    await schemaReady;
  } catch (error) {
    schemaReady = null;
    throw error;
  }
}

function parseAmountPaise(value: unknown) {
  const amount = typeof value === "number" ? String(value) : text(value, 32).replaceAll(",", "");
  const match = /^(\d{1,8})(?:\.(\d{1,2}))?$/.exec(amount);
  if (!match) return null;
  const paise = Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0"));
  return Number.isSafeInteger(paise) && paise >= MIN_AMOUNT_PAISE && paise <= MAX_AMOUNT_PAISE ? paise : null;
}

function checkoutContact(payload: Record<string, unknown>) {
  const name = text(payload.name, 100).replace(/\s+/g, " ");
  const email = text(payload.email, 254).toLowerCase();
  const phone = text(payload.phone, 40).replace(/[\s().-]/g, "");
  const phoneKey = phone.replace(/\D/g, "");
  const amountPaise = parseAmountPaise(payload.amount);
  if (name.length < 2) return { ok: false as const, status: 400, error: "Enter your full name." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { ok: false as const, status: 400, error: "Enter a valid email address." };
  if (!/^\+[1-9]\d{7,14}$/.test(phone) || !phoneKey) return { ok: false as const, status: 400, error: "Enter a valid phone number with country code, such as +91 98765 43210." };
  if (!amountPaise) return { ok: false as const, status: 400, error: "Enter an amount of at least ₹1." };
  return { ok: true as const, name, email, phone, phoneKey, amountPaise };
}

function credentials(env: PhonePeEnv) {
  const clientId = text(env.PHONEPE_CLIENT_ID, 160);
  const clientSecret = text(env.PHONEPE_CLIENT_SECRET, 300);
  const clientVersion = text(env.PHONEPE_CLIENT_VERSION, 20);
  if (!clientId || !clientSecret || !/^\d+$/.test(clientVersion)) return null;
  return { clientId, clientSecret, clientVersion };
}

let tokenCache: { token: string; expiresAt: number } | null = null;
async function authorizationToken(env: PhonePeEnv) {
  const configured = credentials(env);
  if (!configured) throw new Error("PhonePe is not configured.");
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expiresAt > now + 60) return tokenCache.token;
  const body = new URLSearchParams({
    client_id: configured.clientId,
    client_version: configured.clientVersion,
    client_secret: configured.clientSecret,
    grant_type: "client_credentials",
  });
  const response = await fetch(`${PHONEPE_API}/apis/identity-manager/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(8_000),
  });
  const result = await response.json().catch(() => ({})) as { access_token?: string; expires_at?: number; token_type?: string; message?: string };
  if (!response.ok || !result.access_token || result.token_type !== "O-Bearer") throw new Error(`PhonePe authorization failed with HTTP ${response.status}.`);
  tokenCache = { token: `${result.token_type} ${result.access_token}`, expiresAt: Number(result.expires_at) || now + 300 };
  return tokenCache.token;
}

async function phonePeRequest<T>(env: PhonePeEnv, path: string, init?: RequestInit) {
  const response = await fetch(`${PHONEPE_API}${path}`, {
    ...init,
    headers: { Authorization: await authorizationToken(env), "Content-Type": "application/json", ...(init?.headers || {}) },
    signal: AbortSignal.timeout(8_000),
  });
  const result = await response.json().catch(() => ({})) as T & { message?: string };
  if (!response.ok) throw new Error(`PhonePe request failed with HTTP ${response.status}.`);
  return result;
}

async function saveContact(db: D1Database, contact: Extract<ReturnType<typeof checkoutContact>, { ok: true }>) {
  const now = new Date().toISOString();
  const existing = await db.prepare("SELECT id FROM checkout_contacts WHERE email = ? COLLATE NOCASE LIMIT 1").bind(contact.email).first<{ id: string }>();
  const optinId = existing?.id || crypto.randomUUID();
  await db.batch([
    db.prepare(`INSERT INTO checkout_contacts (id, name, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET name=excluded.name, updated_at=excluded.updated_at`)
      .bind(optinId, contact.name, contact.email, now, now),
    db.prepare(`INSERT OR IGNORE INTO checkout_contact_phones (contact_id, phone, phone_key, created_at) VALUES (?, ?, ?, ?)`)
      .bind(optinId, contact.phone, contact.phoneKey, now),
  ]);
  return optinId;
}

export async function createPhonePePayment(db: D1Database, env: PhonePeEnv, siteOrigin: string, payload: Record<string, unknown>) {
  if (!credentials(env)) return { ok: false as const, status: 503, error: "PhonePe checkout is temporarily unavailable." };
  const contact = checkoutContact(payload);
  if (!contact.ok) return contact;
  await ensurePhonePeCheckoutSchema(db);
  const optinId = await saveContact(db, contact);
  const id = `SC_${crypto.randomUUID().replaceAll("-", "")}`;
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO phonepe_payment_orders (
    id, optin_id, name, email, phone, amount_paise, currency, status, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'CREATED', ?, ?)`)
    .bind(id, optinId, contact.name, contact.email, contact.phone, contact.amountPaise, now, now).run();

  let remote: { orderId?: string; state?: string; redirectUrl?: string };
  try {
    remote = await phonePeRequest(env, "/apis/pg/checkout/v2/pay", {
      method: "POST",
      body: JSON.stringify({
        merchantOrderId: id,
        amount: contact.amountPaise,
        customerDetails: { name: contact.name, email: contact.email, phoneNumber: contact.phone },
        expireAfter: 1200,
        paymentFlow: { type: "PG_CHECKOUT", merchantUrls: { redirectUrl: `${siteOrigin}/checkout/status?order=${encodeURIComponent(id)}` } },
        prefillUserLoginDetails: { phoneNumber: contact.phone },
        disablePaymentRetry: false,
        metaInfo: { udf1: "Sanjit Chakrabarti payment" },
      }),
    });
  } catch (error) {
    await db.prepare(`UPDATE phonepe_payment_orders SET status='CREATE_FAILED', updated_at=? WHERE id=?`).bind(new Date().toISOString(), id).run();
    throw error;
  }
  if (!/^OMO[A-Za-z0-9]+$/.test(remote.orderId || "") || remote.state !== "PENDING" || !/^https:\/\//.test(remote.redirectUrl || "")) {
    await db.prepare(`UPDATE phonepe_payment_orders SET status='CREATE_FAILED', updated_at=? WHERE id=?`).bind(new Date().toISOString(), id).run();
    throw new Error("PhonePe returned an invalid checkout response.");
  }
  await db.batch([
    db.prepare(`UPDATE phonepe_payment_orders SET status='PENDING', phonepe_order_id=?, updated_at=? WHERE id=?`)
      .bind(remote.orderId, new Date().toISOString(), id),
    db.prepare(`INSERT OR IGNORE INTO checkout_activities (id, contact_id, event_type, metadata_json, occurred_at)
      VALUES (?, ?, 'phonepe_payment_started', ?, ?)`)
      .bind(`phonepe_started_${id}`, optinId, JSON.stringify({ order_id: id, amount_paise: contact.amountPaise }), now),
  ]);
  return { ok: true as const, redirectUrl: remote.redirectUrl, orderId: id };
}

async function applyStatus(db: D1Database, order: PhonePeOrderRow, provider: PhonePeStatus) {
  if (provider.amount !== order.amount_paise) throw new Error("PhonePe amount does not match the local order.");
  const state = provider.state === "COMPLETED" ? "COMPLETED" : provider.state === "FAILED" ? "FAILED" : "PENDING";
  const completedAttempt = provider.paymentDetails?.find((attempt) => attempt.state === "COMPLETED");
  const transactionId = text(completedAttempt?.transactionId, 120) || null;
  const now = new Date().toISOString();
  const statements = [
    db.prepare(`UPDATE phonepe_payment_orders SET status=?, phonepe_order_id=COALESCE(phonepe_order_id, ?),
      transaction_id=COALESCE(transaction_id, ?), paid_at=CASE WHEN ?='COMPLETED' THEN COALESCE(paid_at, ?) ELSE paid_at END,
      updated_at=? WHERE id=?`).bind(state, text(provider.orderId, 120) || null, transactionId, state, now, now, order.id),
  ];
  if (state === "COMPLETED") {
    statements.push(db.prepare(`INSERT OR IGNORE INTO checkout_activities (id, contact_id, event_type, metadata_json, occurred_at)
      VALUES (?, ?, 'phonepe_payment_completed', ?, ?)`)
      .bind(`phonepe_paid_${order.id}`, order.optin_id, JSON.stringify({ order_id: order.id, transaction_id: transactionId, amount_paise: order.amount_paise }), now));
  }
  await db.batch(statements);
  return state;
}

export async function getPhonePePaymentStatus(db: D1Database, env: PhonePeEnv, orderIdValue: unknown) {
  const orderId = text(orderIdValue, 63);
  if (!/^SC_[0-9a-f]{32}$/.test(orderId)) return { ok: false as const, status: 400, error: "Payment reference is invalid." };
  if (!credentials(env)) return { ok: false as const, status: 503, error: "PhonePe checkout is temporarily unavailable." };
  await ensurePhonePeCheckoutSchema(db);
  const order = await db.prepare(`SELECT id, optin_id, amount_paise, currency, status, phonepe_order_id, transaction_id, paid_at
    FROM phonepe_payment_orders WHERE id=?`).bind(orderId).first<PhonePeOrderRow>();
  if (!order) return { ok: false as const, status: 404, error: "Payment reference was not found." };
  const provider = await phonePeRequest<PhonePeStatus>(env, `/apis/pg/checkout/v2/order/${encodeURIComponent(order.id)}/status?details=false&errorContext=false`);
  const state = await applyStatus(db, order, provider);
  return { ok: true as const, state, amountPaise: order.amount_paise, currency: order.currency };
}

async function sha256(value: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function handlePhonePeWebhook(db: D1Database, env: PhonePeEnv, authorization: string | null, rawBody: string) {
  const username = text(env.PHONEPE_WEBHOOK_USERNAME, 120);
  const password = text(env.PHONEPE_WEBHOOK_PASSWORD, 240);
  if (!username || !password) return { ok: false as const, status: 503, error: "Webhook is not configured." };
  const supplied = (authorization || "").replace(/^SHA256\s+/i, "").trim().toLowerCase();
  const expected = await sha256(`${username}:${password}`);
  if (!/^[0-9a-f]{64}$/.test(supplied) || !constantTimeEqual(expected, supplied)) return { ok: false as const, status: 401, error: "Invalid webhook authorization." };
  let body: { event?: unknown; payload?: Record<string, unknown> };
  try { body = JSON.parse(rawBody) as typeof body; } catch { return { ok: false as const, status: 400, error: "Invalid webhook payload." }; }
  if (!body.payload || !["checkout.order.completed", "checkout.order.failed"].includes(text(body.event, 80))) return { ok: true as const, ignored: true };
  const merchantOrderId = text(body.payload.merchantOrderId, 63);
  if (!/^SC_[0-9a-f]{32}$/.test(merchantOrderId)) return { ok: true as const, ignored: true };
  await ensurePhonePeCheckoutSchema(db);
  const order = await db.prepare(`SELECT id, optin_id, amount_paise, currency, status, phonepe_order_id, transaction_id, paid_at
    FROM phonepe_payment_orders WHERE id=?`).bind(merchantOrderId).first<PhonePeOrderRow>();
  if (!order) return { ok: true as const, ignored: true };
  await applyStatus(db, order, body.payload as PhonePeStatus);
  return { ok: true as const };
}
