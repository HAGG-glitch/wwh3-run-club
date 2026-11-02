import {
  clearFailures,
  clientIp,
  createSessionToken,
  headersToRecord,
  isSameOrigin,
  jsonResponse,
  recordFailure,
  sessionCookie,
  tooManyAttempts,
  verifyPassword,
} from "../lib/auth";

export default async (request: Request) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const headers = headersToRecord(request.headers);
  if (!isSameOrigin(headers)) {
    return jsonResponse(403, { error: "Bad origin." });
  }
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET) {
    return jsonResponse(500, {
      error:
        "Admin is not configured. Set ADMIN_PASSWORD_HASH and SESSION_SECRET.",
    });
  }

  const ip = clientIp(headers);
  if (tooManyAttempts(ip)) {
    return jsonResponse(429, {
      error: "Too many attempts. Try again in a few minutes.",
    });
  }

  let password = "";
  try {
    const parsed = JSON.parse((await request.text()) || "{}") as {
      password?: unknown;
    };
    if (typeof parsed.password === "string") password = parsed.password;
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  if (!password) {
    return jsonResponse(400, { error: "Password is required." });
  }

  if (!verifyPassword(password)) {
    recordFailure(ip);
    return jsonResponse(401, { ok: false, error: "Invalid password." });
  }

  clearFailures(ip);

  try {
    const token = createSessionToken();
    return jsonResponse(
      200,
      { ok: true },
      { "Set-Cookie": sessionCookie(token) },
    );
  } catch {
    return jsonResponse(500, { error: "Could not create a session." });
  }
};
