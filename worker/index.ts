import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { createPhonePePayment, getPhonePePaymentStatus, handlePhonePeWebhook } from "../lib/phonepe-checkout";

interface Env {
  ASSETS?: Fetcher;
  DB: D1Database;
  PHONEPE_CLIENT_ID?: string;
  PHONEPE_CLIENT_SECRET?: string;
  PHONEPE_CLIENT_VERSION?: string;
  PHONEPE_WEBHOOK_USERNAME?: string;
  PHONEPE_WEBHOOK_PASSWORD?: string;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const appPrefixes = ["/checkout", "/api/", "/_vinext/", "/_next/"];
type RateLimitEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitEntry>();
const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || "unknown";
}

function rateLimit(request: Request, bucket: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const key = `${bucket}:${clientIp(request)}`;
  if (!rateLimits.has(key) && rateLimits.size >= 5_000) {
    for (const [storedKey, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(storedKey);
    if (rateLimits.size >= 5_000) {
      const oldestKey = rateLimits.keys().next().value;
      if (oldestKey) rateLimits.delete(oldestKey);
    }
  }
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count <= limit) return null;
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1_000));
  return Response.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429, headers: { ...jsonHeaders, "Retry-After": String(retryAfter) } });
}

async function readBody(request: Request, maxBytes: number) {
  const contentType = (request.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json" && !contentType.endsWith("+json")) return { ok: false as const, response: Response.json({ ok: false, error: "Content-Type must be application/json." }, { status: 415, headers: jsonHeaders }) };
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false as const, response: Response.json({ ok: false, error: "Request body is too large." }, { status: 413, headers: jsonHeaders }) };
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return { ok: false as const, response: Response.json({ ok: false, error: "Request body is too large." }, { status: 413, headers: jsonHeaders }) };
  return { ok: true as const, raw };
}

function parseJsonObject(raw: string) {
  const parsed = JSON.parse(raw || "{}");
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Request body must be a JSON object.");
  return parsed as Record<string, unknown>;
}

function isAllowedBrowserWrite(request: Request, url: URL) {
  return request.headers.get("origin") === url.origin;
}

function requestErrorResponse(error: unknown, fallback: string) {
  console.error(fallback, error instanceof Error ? error.message : "Unknown error");
  return Response.json({ ok: false, status: 500, error: fallback }, { status: 500, headers: jsonHeaders });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image" && env.ASSETS && env.IMAGES) {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/phonepe/order" && request.method === "POST") {
      if (!isAllowedBrowserWrite(request, url)) return Response.json({ ok: false, error: "Cross-site requests are not allowed." }, { status: 403, headers: jsonHeaders });
      const limited = rateLimit(request, "phonepe-order", 8, 15 * 60_000);
      if (limited) return limited;
      try {
        const body = await readBody(request, 8_192);
        if (!body.ok) return body.response;
        const result = await createPhonePePayment(env.DB, env, url.origin, parseJsonObject(body.raw));
        return Response.json(result, { status: result.ok ? 201 : result.status, headers: jsonHeaders });
      } catch (error) {
        return requestErrorResponse(error, "Your PhonePe payment could not be prepared. Please try again.");
      }
    }

    if (url.pathname === "/api/phonepe/status" && request.method === "GET") {
      const limited = rateLimit(request, "phonepe-status", 30, 5 * 60_000);
      if (limited) return limited;
      try {
        const result = await getPhonePePaymentStatus(env.DB, env, url.searchParams.get("order"));
        return Response.json(result, { status: result.ok ? 200 : result.status, headers: jsonHeaders });
      } catch (error) {
        return requestErrorResponse(error, "Payment could not be confirmed yet. Please try again shortly.");
      }
    }

    if (url.pathname === "/api/phonepe/webhook" && request.method === "POST") {
      const limited = rateLimit(request, "phonepe-webhook", 180);
      if (limited) return limited;
      try {
        const body = await readBody(request, 262_144);
        if (!body.ok) return body.response;
        const result = await handlePhonePeWebhook(env.DB, env, request.headers.get("authorization"), body.raw);
        return Response.json(result, { status: result.ok ? 200 : result.status, headers: jsonHeaders });
      } catch (error) {
        return requestErrorResponse(error, "PhonePe webhook could not be processed.");
      }
    }

    if (url.pathname.startsWith("/api/")) return Response.json({ ok: false, error: "Not found." }, { status: 404, headers: jsonHeaders });

    if (env.ASSETS && !appPrefixes.some((prefix) => url.pathname.startsWith(prefix))) {
      const staticResponse = await env.ASSETS.fetch(request);
      if (staticResponse.status !== 404) return staticResponse;
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
