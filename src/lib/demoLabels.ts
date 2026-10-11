/**
 * The three disclosure labels required for demonstration material.
 *
 * The club has now supplied a confirmed run record and approved photography, so
 * nothing in `runs.ts` or `gallery.ts` is demo material any more. These strings
 * remain because the surrounding pages still guard their `isDemo` branches with
 * them, keeping those branches self-documenting if sample content is ever added.
 */
export const demoLabels = {
  /** A run entry that is an example rather than a club record. */
  record: "Demo record",
  /** Narrative copy written to demonstrate the layout. */
  story: "Placeholder story",
  /** An image that is not an approved club photograph. */
  photo: "Placeholder photograph",
  /** An event entry that is an example rather than a club record. */
  event: "Placeholder event",
  /** A document that is an example rather than an approved publication. */
  publication: "Placeholder publication",
  /** A story that is an example rather than an approved article. */
  news: "Placeholder article",
  /** A partner entry that is an example rather than a confirmed partner. */
  partner: "Placeholder partner",
  /** A supporter entry that is an example rather than a confirmed donor. */
  donor: "Placeholder donor",
} as const;

export type DemoLabel = (typeof demoLabels)[keyof typeof demoLabels];
