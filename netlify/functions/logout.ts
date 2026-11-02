import { clearSessionCookie, jsonResponse } from "../lib/auth";

export default async (request: Request) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }
  return jsonResponse(
    200,
    { ok: true },
    { "Set-Cookie": clearSessionCookie() },
  );
};
