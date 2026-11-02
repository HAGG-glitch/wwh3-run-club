/**
 * Shared auth/HTTP helpers for the WWH3 admin Netlify Functions.
 *
 * Password hashing: scrypt with a per-install salt, stored in
 * `ADMIN_PASSWORD_HASH` as `scrypt:<saltHex>:<keyHex>`.
 * Sessions: a signed, stateless token in an httpOnly cookie. The signature is
 * an HMAC-SHA256 over the payload using `SESSION_SECRET`.
 */
import crypto from "node:crypto";

export const COOKIE_NAME = "wwh3_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function jsonResponse(
  statusCode: number,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export function headersToRecord(
  headers: Headers,
): Record<string, string | undefined> {
  const record: Record<string, string | undefined> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET is missing or too short (needs 16+ chars).");
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  );
}

export function createSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ sub: "admin", iat: now, exp: now + SESSION_TTL_SECONDS }),
  );
  const signature = base64url(
    crypto.createHmac("sha256", getSecret()).update(payload).digest(),
  );
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expected: string;
  try {
    expected = base64url(
      crypto.createHmac("sha256", getSecret()).update(payload).digest(),
    );
  } catch {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return false;
  }

  try {
    const data = JSON.parse(fromBase64url(payload).toString("utf8")) as {
      exp?: number;
    };
    return (
      typeof data.exp === "number" &&
      data.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return false;

  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const key = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || key.length === 0) return false;

  const derived = crypto.scryptSync(password, salt, key.length);
  return (
    derived.length === key.length && crypto.timingSafeEqual(derived, key)
  );
}

export function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function isAuthenticated(
  headers: Record<string, string | undefined>,
): boolean {
  const cookies = parseCookies(headers.cookie);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

/**
 * Best-effort CSRF defence: a browser request that carries an Origin/Referer
 * must match the host it is talking to. Non-browser clients (no Origin) still
 * need a valid session cookie.
 */
export function isSameOrigin(
  headers: Record<string, string | undefined>,
): boolean {
  const origin = headers.origin || headers.referer;
  if (!origin) return true;
  try {
    return new URL(origin).host === headers.host;
  } catch {
    return false;
  }
}

export function clientIp(
  headers: Record<string, string | undefined>,
): string {
  return (
    headers["x-nf-client-connection-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/* Simple per-instance rate limiting. Netlify functions scale horizontally, so
   this is a lightweight speed bump rather than a hard guarantee. */
const failures = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  failures.set(ip, recent);
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
