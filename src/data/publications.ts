/**
 * Club publications.
 *
 * Prepared for a future Supabase `publications` table.
 *
 * `publicationPermissionConfirmed` is a hard publication gate. Legal and
 * constitutional documents must not become downloadable from a public website
 * until the club has confirmed it wants them published, so that flag is separate
 * from `published` and both must be true before a link is ever rendered.
 *
 * There are currently **no approved publications**. See CONTENT_NEEDED.md.
 */

export type PublicationType =
  | "Constitution"
  | "Hash Rules"
  | "Form"
  | "Report"
  | "Newsletter"
  | "Other";

export type Publication = {
  id: string;
  title: string;
  type: PublicationType;
  /** Human-readable publication date, e.g. "March 2026". Null until known. */
  publicationDate: string | null;
  description: string;
  /** Path to a cover image in `public/`. Null until supplied. */
  coverImage: string | null;
  /** Path to a bundled file in `public/`, or an absolute external URL. */
  fileUrl: string | null;
  /** Whether a visitor is permitted to download this document. */
  downloadAllowed: boolean;
  /**
   * Whether the club has approved making this document public at all. Legal
   * documents stay private until this is true.
   */
  publicationPermissionConfirmed: boolean;
  published: boolean;
  isDemo: boolean;
};

/**
 * Source records. Empty until the club approves documents for publication.
 * Typed explicitly so the selectors below keep their `Publication` types.
 */
export const allPublications: readonly Publication[] = [];

/** Records that may be shown publicly: both gates must be open. */
export const publicPublications: readonly Publication[] = allPublications.filter(
  (publication) =>
    publication.published &&
    publication.publicationPermissionConfirmed &&
    publication.downloadAllowed,
);

/**
 * Records that are published but must not be downloaded — shown as
 * "view only" with no link, so nothing is exposed by accident.
 */
export const viewOnlyPublications: readonly Publication[] =
  allPublications.filter(
    (publication) =>
      publication.published &&
      publication.publicationPermissionConfirmed &&
      !publication.downloadAllowed,
  );

/** Whether anything is available publicly right now. */
export const hasPublicPublications =
  publicPublications.length > 0 || viewOnlyPublications.length > 0;

/** Public-facing copy for the empty state. */
export const publicationsEmptyState = {
  heading: "No public documents are currently available.",
  body: "Approved club documents will be published here once permission has been confirmed.",
} as const;

/** Sorts publications newest-first by their stated date. */
export function sortPublicationsByDate(
  publications: readonly Publication[],
): readonly Publication[] {
  return [...publications].sort((a, b) =>
    (a.publicationDate ?? "").localeCompare(b.publicationDate ?? ""),
  );
}
