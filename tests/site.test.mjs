import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the existing personal site and exact policy wording remain preserved", async () => {
  const [root, deployed, terms, privacy, refund] = await Promise.all([
    source("index.html"), source("public/index.html"), source("public/terms.html"), source("public/privacy.html"), source("public/refund.html"),
  ]);
  assert.match(root, /Great work deserves/);
  assert.match(root, /Services start at <strong>₹400 INR<\/strong>/);
  assert.match(root, /href="\/checkout">Pay securely/);
  assert.equal(deployed, root);
  assert.match(terms, /9433569217/);
  assert.match(privacy, /Privacy Policy/);
  assert.match(refund, /180 days of placing the order, if refund policy sepecified in contract/);
});

test("checkout accepts name, email, phone, and a customer-entered INR amount", async () => {
  const [form, page, status] = await Promise.all([
    source("app/checkout/CheckoutClient.tsx"), source("app/checkout/page.tsx"), source("app/checkout/status/PaymentStatusClient.tsx"),
  ]);
  for (const field of ["name", "email", "phone", "amount"]) assert.match(form, new RegExp(`name="${field}"`));
  assert.match(form, /Continue with PhonePe/);
  assert.match(form, /paying to Sanjit Chakrabarti/);
  assert.doesNotMatch(form, /Finest Clients|CLIENT_SECRET|WEBHOOK_PASSWORD/);
  assert.match(page, /Paying to Sanjit Chakrabarti/);
  assert.match(status, /payment to Sanjit Chakrabarti has been confirmed/);
});

test("PhonePe credentials stay server-side and completion is provider-verified", async () => {
  const [implementation, worker, env] = await Promise.all([
    source("lib/phonepe-checkout.ts"), source("worker/index.ts"), source(".env.example"),
  ]);
  assert.match(implementation, /\/apis\/identity-manager\/v1\/oauth\/token/);
  assert.match(implementation, /\/apis\/pg\/checkout\/v2\/pay/);
  assert.match(implementation, /PhonePe amount does not match the local order/);
  assert.match(implementation, /constantTimeEqual/);
  assert.match(worker, /request\.headers\.get\("origin"\) === url\.origin/);
  assert.match(worker, /url\.pathname === "\/api\/phonepe\/webhook"/);
  assert.match(env, /PHONEPE_CLIENT_SECRET=replace-with/);
});

test("email is the contact identity and multiple phones are retained under it", async () => {
  const [implementation, migration] = await Promise.all([
    source("lib/phonepe-checkout.ts"), source("drizzle/0000_cooing_thena.sql"),
  ]);
  assert.match(implementation, /email = \? COLLATE NOCASE/);
  assert.match(implementation, /INSERT OR IGNORE INTO checkout_contact_phones/);
  assert.match(migration, /CREATE UNIQUE INDEX `idx_checkout_contacts_email`/);
  assert.match(migration, /PRIMARY KEY\(`contact_id`, `phone_key`\)/);
  assert.match(migration, /CHECK\(amount_paise >= 100\)/);
});

test("Sites configuration uses only a dedicated D1 binding", async () => {
  const hosting = JSON.parse(await source(".openai/hosting.json"));
  assert.match(hosting.project_id, /^appgprj_[a-z0-9]+$/);
  assert.equal(hosting.d1, "DB");
  assert.equal(hosting.r2, null);
});
