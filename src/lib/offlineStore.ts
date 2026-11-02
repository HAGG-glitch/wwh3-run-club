import type { SiteContent } from "@/data/contentModel";

const STORAGE_KEY = "wwh3.admin.draft.v1";

export type Draft = {
  content: SiteContent;
  /** Milliseconds since epoch of the last local edit. */
  updatedAt: number;
  /** True when the admin pressed Save but it has not reached the server yet. */
  pending: boolean;
};

export function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (
      !parsed ||
      !parsed.content ||
      !Array.isArray(parsed.content.runs) ||
      !Array.isArray(parsed.content.events) ||
      !Array.isArray(parsed.content.gallery)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeDraft(content: SiteContent, pending: boolean): Draft {
  const draft: Draft = { content, updatedAt: Date.now(), pending };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* Storage full or unavailable — the in-memory copy still works. */
  }
  return draft;
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
