import type { ClubEvent } from "@/data/events";
import type { GalleryItem } from "@/data/gallery";
import type { HashRun } from "@/data/runs";
import { makeId } from "@/data/contentModel";

export function blankRun(): HashRun {
  return {
    id: makeId("run"),
    slug: "",
    hashNumber: null,
    title: "New run",
    date: null,
    startTime: null,
    meetingLocation: null,
    distance: null,
    difficulty: null,
    terrain: null,
    hares: [],
    summary: "",
    story: [],
    memorableMoments: [],
    coverImage: "",
    galleryImages: [],
    status: "completed",
    isDemo: false,
    published: false,
  };
}

export function blankEvent(): ClubEvent {
  return {
    id: makeId("event"),
    slug: "",
    title: "New event",
    date: null,
    time: null,
    location: null,
    description: "",
    coverImage: null,
    status: "scheduled",
    registrationLink: null,
    runSlug: null,
    published: false,
    isDemo: false,
  };
}

export function blankGalleryItem(): GalleryItem {
  return {
    id: makeId("photo"),
    image: "",
    alt: "",
    caption: "",
    width: 1600,
    height: 1066,
    hashNumber: null,
    date: null,
    location: null,
    category: "Brotherhood",
    consentConfirmed: true,
    published: false,
    isDemo: false,
    descriptionConfirmed: false,
  };
}
