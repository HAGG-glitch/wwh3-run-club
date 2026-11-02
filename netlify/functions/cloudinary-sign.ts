import crypto from "node:crypto";

import { headersToRecord, isAuthenticated, jsonResponse } from "../lib/auth";

/**
 * Returns a short-lived signature so the browser can upload a photo straight to
 * Cloudinary without ever seeing the API secret. The secret stays server-side.
 */
export default async (request: Request) => {
  if (request.method !== "GET") {
    return jsonResponse(405, { error: "Method not allowed." });
  }
  if (!isAuthenticated(headersToRecord(request.headers))) {
    return jsonResponse(401, { error: "Unauthorized." });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return jsonResponse(500, {
      error: "Cloudinary is not configured.",
    });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || "wwh3";

  /* Cloudinary signs the alphabetically sorted params concatenated with the
     API secret. "folder" sorts before "timestamp". */
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return jsonResponse(200, { cloudName, apiKey, timestamp, folder, signature });
};
