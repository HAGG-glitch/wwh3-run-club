import { allEvents, type ClubEvent } from "@/data/events";
import { galleryItems, type GalleryItem } from "@/data/gallery";
import { completedRuns, upcomingRuns, type HashRun } from "@/data/runs";

/**
 * The single content document the admin edits and the public site reads.
 *
 * It is deliberately shaped like the existing static data modules so every page
 * can switch between the seed (the TypeScript records) and the live document
 * without changing how it renders.
 */
export type SiteContent = {
  version: number;
  updatedAt: string;
  runs: HashRun[];
  events: ClubEvent[];
  gallery: GalleryItem[];
};

export const CONTENT_SCHEMA_VERSION = 1;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** The current club records, used until the admin saves something. */
export function buildSeedContent(): SiteContent {
  return {
    version: 0,
    updatedAt: "",
    runs: clone([...upcomingRuns, ...completedRuns]),
    events: clone([...allEvents]),
    gallery: clone([...galleryItems]),
  };
}

/** Accepts unknown JSON from the API and returns a usable document or null. */
export function normaliseContent(value: unknown): SiteContent | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    !Array.isArray(candidate.runs) ||
    !Array.isArray(candidate.events) ||
    !Array.isArray(candidate.gallery)
  ) {
    return null;
  }
  return {
    version: typeof candidate.version === "number" ? candidate.version : 0,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : "",
    runs: candidate.runs as HashRun[],
    events: candidate.events as ClubEvent[],
    gallery: candidate.gallery as GalleryItem[],
  };
}

/* -------------------------------------------------------------------------- */
/* Selectors — the runtime equivalents of the static data exports.            */
/* -------------------------------------------------------------------------- */

export function selectPublishedRuns(content: SiteContent): HashRun[] {
  return content.runs.filter((run) => run.published);
}

export function selectCompletedRuns(content: SiteContent): HashRun[] {
  return content.runs.filter(
    (run) => run.published && run.status === "completed",
  );
}

export function selectUpcomingRuns(content: SiteContent): HashRun[] {
  return content.runs.filter(
    (run) => run.published && run.status === "upcoming",
  );
}

export function selectRunBySlug(
  content: SiteContent,
  slug: string | undefined,
): HashRun | undefined {
  if (!slug) return undefined;
  return content.runs.find((run) => run.published && run.slug === slug);
}

/** Each run story is a curated set, so uploads and display share one cap. */
export const MAX_RUN_MEDIA = 15;

export function limitRunMedia(items: readonly string[]): string[] {
  return items.slice(0, MAX_RUN_MEDIA);
}

export function selectPublishedEvents(content: SiteContent): ClubEvent[] {
  return content.events.filter((event) => event.published);
}

export function sortEventsByDate(events: readonly ClubEvent[]): ClubEvent[] {
  return [...events].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
}

export function selectDisplayableGallery(content: SiteContent): GalleryItem[] {
  return content.gallery.filter((item) => item.published);
}

export function selectFeaturedGallery(content: SiteContent): GalleryItem[] {
  return selectDisplayableGallery(content).slice(0, 5);
}

/** Turns a title into a URL-safe slug, falling back to a random suffix. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Math.random().toString(36).slice(2, 8)}`;
}

/** A stable, human-readable id. */
export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
