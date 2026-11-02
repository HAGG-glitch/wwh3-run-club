import { headersToRecord, isAuthenticated, jsonResponse } from "../lib/auth";

export default async (request: Request) => {
  if (request.method !== "GET") {
    return jsonResponse(405, { error: "Method not allowed." });
  }
  return jsonResponse(200, {
    authenticated: isAuthenticated(headersToRecord(request.headers)),
  });
};
