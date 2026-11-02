import { getStore } from "@netlify/blobs";

import {
  headersToRecord,
  isAuthenticated,
  isSameOrigin,
  jsonResponse,
} from "../lib/auth";

const STORE_NAME = "wwh3";
const CONTENT_KEY = "content.json";
const MAX_BODY_BYTES = 2 * 1024 * 1024;

type ContentPayload = {
  version?: number;
  runs?: unknown;
  events?: unknown;
  gallery?: unknown;
};

export default async (request: Request) => {
  let store;
  try {
    store = getStore({ name: STORE_NAME, consistency: "strong" });
  } catch {
    return jsonResponse(500, {
      error: "Content storage is not available in this environment.",
    });
  }

  if (request.method === "GET") {
    try {
      const data = (await store.get(CONTENT_KEY, { type: "json" })) as
        | ContentPayload
        | null;
      return jsonResponse(200, { content: data ?? null });
    } catch {
      return jsonResponse(200, { content: null });
    }
  }

  if (request.method === "PUT") {
    const headers = headersToRecord(request.headers);
    if (!isAuthenticated(headers)) {
      return jsonResponse(401, { error: "Unauthorized." });
    }
    if (!isSameOrigin(headers)) {
      return jsonResponse(403, { error: "Bad origin." });
    }

    const body = await request.text();
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      return jsonResponse(413, { error: "Content payload is too large." });
    }

    let parsed: { content?: ContentPayload } | null = null;
    try {
      parsed = JSON.parse(body || "null");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body." });
    }

    const content = parsed?.content;
    if (
      !content ||
      !Array.isArray(content.runs) ||
      !Array.isArray(content.events) ||
      !Array.isArray(content.gallery)
    ) {
      return jsonResponse(400, { error: "Invalid content payload." });
    }

    const next = {
      version: (Number(content.version) || 0) + 1,
      updatedAt: new Date().toISOString(),
      runs: content.runs,
      events: content.events,
      gallery: content.gallery,
    };

    try {
      await store.setJSON(CONTENT_KEY, next);
      return jsonResponse(200, {
        version: next.version,
        updatedAt: next.updatedAt,
      });
    } catch {
      return jsonResponse(500, { error: "Could not save content." });
    }
  }

  return jsonResponse(405, { error: "Method not allowed." });
};
