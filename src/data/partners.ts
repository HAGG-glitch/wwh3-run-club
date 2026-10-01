/**
 * Partner organisations.
 *
 * Prepared for a future Supabase `partners` table.
 *
 * No partner organisation is named here. Inventing partner logos or
 * descriptions would imply endorsement that has not been granted, so the source
 * array is empty and the Partnerships page shows an empty state until the club
 * confirms partners. See CONTENT_NEEDED.md.
 */

export type PartnerType = "Venue" | "Sponsor" | "Supplier" | "Community" | "Other";

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  /** Path to a logo in `public/`. Null when no logo has been supplied. */
  logo: string | null;
  description: string;
  /** Absolute external URL. Null when the club has not approved linking. */
  websiteUrl: string | null;
  /** "active" while a partnership is running, "past" once it has ended. */
  partnershipStatus: "active" | "past";
  published: boolean;
  isDemo: boolean;
};

/** Source records. Empty until partners are confirmed by the club. */
export const allPartners: readonly Partner[] = [];

/** Partners safe to show on the public site. */
export const publishedPartners: readonly Partner[] = allPartners.filter(
  (partner) => partner.published,
);

/** Whether any partner is currently published. Drives the empty state. */
export const hasPublishedPartners = publishedPartners.length > 0;

/** Public-facing copy for the empty state. */
export const partnersEmptyState = {
  heading: "No partners have been published yet.",
  body: "Confirmed partnerships and supporters will be listed here once the club has approved them for publication.",
} as const;
