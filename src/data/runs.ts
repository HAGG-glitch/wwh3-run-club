/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

import { birthdayRunImages } from "@/data/gallery";

export type RunStatus = "draft" | "upcoming" | "completed";

export type HashRun = {
  id: string;
  slug: string;
  hashNumber: string | null;
  title: string;
  date: string | null;
  startTime: string | null;
  meetingLocation: string | null;
  distance: string | null;
  difficulty: string | null;
  terrain: string | null;
  hares: string[];
  summary: string;
  story: string[];
  memorableMoments: string[];
  coverImage: string;
  galleryImages: string[];
  status: RunStatus;
  isDemo: boolean;
  published: boolean;
};

/* -------------------------------------------------------------------------- */
/* Upcoming runs                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately empty.
 *
 * WWH3 has not yet supplied a confirmed schedule of future dates. Fabricated
 * dates must never be presented as real events, so the interface shows an
 * honest empty state and directs visitors to make contact instead. See
 * CONTENT_NEEDED.md.
 */
export const upcomingRuns: readonly HashRun[] = [];

/* -------------------------------------------------------------------------- */
/* Completed runs                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Real club records only.
 *
 * Only fields the club has actually supplied are filled in; everything else is
 * `null` or empty so the page omits it rather than inventing a distance, a Hare
 * or a location. The one entry below is the club's first recorded run.
 */
export const completedRuns: readonly HashRun[] = [
  {
    id: "run-away-boy-birthday",
    slug: "run-away-boy-birthday",
    hashNumber: "01",
    title: "Run Away Boy's Birthday Hash",
    date: "2 October 2026",
    startTime: null,
    meetingLocation: "Oba Funkia, Funkia Market",
    distance: null,
    difficulty: null,
    terrain: null,
    hares: [],
    summary:
      "The club's first recorded run, a loop from Oba Funkia around Funkia Market and back, held on 2 October 2026 to mark Run Away Boy's birthday.",
    story: [
      "The West West Hash House Harriers gathered on 2 October 2026 for its first recorded run, a birthday Hash for Run Away Boy.",
      "The trail set off from Oba Funkia, went around Funkia Market and returned to where it began.",
    ],
    memorableMoments: [],
    coverImage: "/gallery_photos/run-away-boy-birthday/wwh3-bday-03.jpg",
    galleryImages: birthdayRunImages.slice(),
    status: "completed",
    isDemo: false,
    published: true,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Selectors                                                                  */
/* -------------------------------------------------------------------------- */

export const publishedRuns: readonly HashRun[] = completedRuns.filter(
  (run) => run.published,
);

export function getRunBySlug(slug: string | undefined): HashRun | undefined {
  if (!slug) return undefined;
  return publishedRuns.find((run) => run.slug === slug);
}

/** True when at least one upcoming run has been confirmed. */
export const hasConfirmedUpcomingRuns = upcomingRuns.length > 0;
