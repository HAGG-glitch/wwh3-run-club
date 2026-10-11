/**
 * Club events.
 *
 * Prepared for a future Supabase `events` table. Every field is nullable or
 * optional except the identity fields, so a partially filled record can never
 * become a page-breaking error.
 *
 * One real event exists: the club's first recorded run. When an event points at
 * a run via `runSlug`, the Events page links through to that run's photographs.
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
   * Slug of the run this event documents, when one exists. Lets the event link
   * through to the run's photographs instead of duplicating them here.
   */
  runSlug: string | null;
  /**
   * Publication gate. An event is only listed publicly when this is true, which
   * keeps draft or cancelled records off the public site.
   */
  published: boolean;
  /** True for example records shown to demonstrate the layout. */
  isDemo: boolean;
};

/** Source records. Only confirmed club events belong here. */
export const allEvents: readonly ClubEvent[] = [
  {
    id: "run-away-boy-birthday",
    slug: "run-away-boy-birthday",
    title: "Run Away Boy's Birthday Hash",
    date: "2 October 2026",
    time: null,
    location: "Oba Funkia, Funkia Market",
    description:
      "The club's first recorded run, a loop from Oba Funkia around Funkia Market and back, held on 2 October 2026 to mark Run Away Boy's birthday.",
    coverImage: "/gallery_photos/run-away-boy-birthday/wwh3-bday-03.jpg",
    status: "completed",
    registrationLink: null,
    runSlug: "run-away-boy-birthday",
    published: true,
    isDemo: false,
  },
];

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
