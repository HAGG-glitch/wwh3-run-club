/**
 * Donor and supporter recognition.
 *
 * Prepared for a future Supabase `donors` table.
 *
 * `recognitionConsent` is a hard publication gate. Donor names, logos and
 * descriptions must never appear publicly without the donor's explicit
 * permission, so a record is only listed when consent is confirmed.
 *
 * Contribution amounts are deliberately **not** modelled. Amounts are
 * sensitive, are not required by the site, and are far too easy to leak once
 * aggregated carelessly — the recognition page only ever describes categories.
 *
 * No donors are fabricated. See CONTENT_NEEDED.md.
 */

export type SupportCategory =
  | "Financial Donor"
  | "In-Kind Supporter"
  | "Equipment Sponsor"
  | "Community Supporter"
  | "Other";

export type Donor = {
  id: string;
  name: string;
  /** Path to a logo in `public/`. Null when no logo has been supplied. */
  logo: string | null;
  supportCategory: SupportCategory;
  description: string;
  /**
   * Whether the donor has agreed to be recognised publicly. Nothing is listed
   * until this is true.
   */
  recognitionConsent: boolean;
  published: boolean;
  isDemo: boolean;
};

/** Source records. Empty until donors are confirmed with consent. */
export const allDonors: readonly Donor[] = [];

/** Donors safe to show on the public site. */
export const publishedDonors: readonly Donor[] = allDonors.filter(
  (donor) => donor.published && donor.recognitionConsent,
);

/** Whether any donor is currently published. Drives the empty state. */
export const hasPublishedDonors = publishedDonors.length > 0;

/** Public-facing copy for the empty state. */
export const donorsEmptyState = {
  heading: "No donors or supporters are listed yet.",
  body: "Recognition is published only with the supporter's permission. Approved supporters will appear here once consent is confirmed.",
} as const;
