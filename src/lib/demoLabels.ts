/**
 * The three disclosure labels required for demonstration material.
 *
 * The club has not yet supplied confirmed run records or approved photography,
 * so nothing in `runs.ts` or `gallery.ts` may be presented as official
 * information. These strings live in one place so every surface that renders
 * demo material uses identical wording, and so the test suite can assert the
 * same guarantees the design brief asks for.
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
