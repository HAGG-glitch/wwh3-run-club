/**
 * Club events.
 *
 * Prepared for a future Supabase `events` table. Every field is nullable or
 * optional except the identity fields, so a partially filled record can never
 * become a page-breaking error.
 *
 * There are currently **no confirmed events**. `publishedEvents` is therefore
 * empty and the Events page shows an honest empty state. Nothing is invented
 * here — see CONTENT_NEEDED.md.
 */

export type EventStatus = "draft" | "scheduled" | "completed" | "cancelled";

export type ClubEvent = {
  id: string;
  slug: string;
  title: string;
  /** Human-readable date, e.g. "14 March 2026". Null until confirmed. */
  date: string | null;
  /** Human-readable start time, e.g. "6:30 pm". Null until confirmed. */
  time: string | null;
  location: string | null;
  /** One paragraph describing the event. */
  description: string;
  /** Path to a cover image in `public/`. Null until supplied. */
  coverImage: string | null;
  status: EventStatus;
  /** External registration URL. Null means no registration is offered. */
  registrationLink: string | null;
  /**
   * Publication gate. An event is only listed publicly when this is true, which
   * keeps draft or cancelled records off the public site.
   */
  published: boolean;
  /** True for example records shown to demonstrate the layout. */
  isDemo: boolean;
};

/** Source records. Empty until the club confirms real events. */
export const allEvents: readonly ClubEvent[] = [];

/** Records safe to show on the public site. */
export const publishedEvents: readonly ClubEvent[] = allEvents.filter(
  (event) => event.published,
);

/** Whether any event is currently published. Drives the empty state. */
export const hasPublishedEvents = publishedEvents.length > 0;

/** Public-facing copy for the empty state. */
export const eventsEmptyState = {
  heading: "No published events are currently available.",
  body: "Contact WWH3 for information about upcoming activities.",
} as const;

/** Sorts published events newest-first, treating undated records as last. */
export function sortEventsByDate(
  events: readonly ClubEvent[],
): readonly ClubEvent[] {
  return [...events].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
}
