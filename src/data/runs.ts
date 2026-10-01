/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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
 * WWH3 has not yet supplied a confirmed schedule. Fabricated dates must never be
 * presented as real events, so the interface shows an honest empty state and
 * directs visitors to make contact instead. See CONTENT_NEEDED.md.
 */
export const upcomingRuns: readonly HashRun[] = [];

/* -------------------------------------------------------------------------- */
/* Completed runs                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Example run stories retained to demonstrate the Hash Log layout.
 *
 * Every entry is flagged `isDemo: true` so the interface labels it as
 * demonstration material. The dates, locations, distances and Hares below are
 * illustrative placeholders and are NOT club records.
 */
export const completedRuns: readonly HashRun[] = [
  {
    id: "run-lumley-sunrise-trail",
    slug: "lumley-sunrise-trail",
    hashNumber: "07",
    title: "Lumley Sunrise Trail",
    date: "28 August 2026",
    startTime: null,
    meetingLocation: "Lumley Beach",
    distance: "7.5 km",
    difficulty: "Mixed pace",
    terrain: "Shoreline and coastal road",
    hares: ["Sample Hare A"],
    summary:
      "A breezy shoreline trail with playful checks, a long beach regroup and an easy finish beside the Atlantic.",
    story: [
      "The sample Pack gathered early near Lumley Beach before following a winding trail across firm sand and quieter coastal roads.",
      "Two false trails kept the front runners guessing and brought walkers and runners back together before the final stretch.",
      "The demonstration story ends with the Pack returning as one group and gathering for a relaxed Circle near the beach.",
    ],
    memorableMoments: [
      "The shoreline regroup",
      "A surprise false trail",
      "The final On-On call",
    ],
    coverImage: "/hash-beach.webp",
    galleryImages: ["/hash-beach.webp", "/hash-circle.webp", "/wwh3-hero.webp"],
    status: "completed",
    isDemo: true,
    published: true,
  },
  {
    id: "run-hill-station-switchbacks",
    slug: "hill-station-switchbacks",
    hashNumber: "06",
    title: "Hill Station Switchbacks",
    date: "14 August 2026",
    startTime: null,
    meetingLocation: "Hill Station",
    distance: "8.2 km",
    difficulty: "Hill Hash",
    terrain: "Green hillside trail",
    hares: ["Sample Hare B"],
    summary:
      "A green hillside route designed around steady climbs, close regroups and broad views over Freetown.",
    story: [
      "This sample route climbed gradually through Hill Station, using short checks to prevent the Pack from spreading too far.",
      "After a light shower, the trail slowed and the group used the buddy system on the wetter sections.",
      "A final regroup at the viewpoint gave everyone time to recover before completing the last descent together.",
    ],
    memorableMoments: ["The hilltop view", "Rain on the trail", "A careful Pack descent"],
    coverImage: "/hash-hills.webp",
    galleryImages: ["/hash-hills.webp", "/wwh3-hero.webp", "/hash-circle.webp"],
    status: "completed",
    isDemo: true,
    published: true,
  },
  {
    id: "run-aberdeen-coast-loop",
    slug: "aberdeen-coast-loop",
    hashNumber: "05",
    title: "Aberdeen Coast Loop",
    date: "31 July 2026",
    startTime: null,
    meetingLocation: "Aberdeen",
    distance: "6.4 km",
    difficulty: "Mixed pace",
    terrain: "Paved streets and coastal path",
    hares: ["Sample Hare C"],
    summary:
      "A compact city-and-coast loop with an accessible walkers' option and a lively finish for the whole Pack.",
    story: [
      "The sample Aberdeen trail mixed paved streets with a quieter coastal section and included a shorter route for walkers.",
      "Frequent regroups kept both routes connected, while the Hare used biodegradable markings throughout the course.",
      "Everyone returned close together for a demonstration Circle focused on fellowship rather than finishing order.",
    ],
    memorableMoments: [
      "The walkers' route",
      "Coastal views",
      "Everyone finishing together",
    ],
    coverImage: "/wwh3-hero.webp",
    galleryImages: ["/wwh3-hero.webp", "/hash-beach.webp", "/hash-circle.webp"],
    status: "completed",
    isDemo: true,
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
