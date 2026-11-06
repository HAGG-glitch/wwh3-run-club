import { beforeEach, describe, expect, it } from "vitest";

import {
  buildSeedContent,
  limitRunMedia,
  MAX_RUN_MEDIA,
  normaliseContent,
  selectDisplayableGallery,
  selectFeaturedGallery,
  selectPublishedEvents,
  selectPublishedRuns,
  selectRunBySlug,
  selectUpcomingRuns,
  slugify,
} from "@/data/contentModel";
import { clearDraft, readDraft, writeDraft } from "@/lib/offlineStore";

describe("content model", () => {
  const seed = buildSeedContent();

  it("builds seed content from the static club records", () => {
    expect(seed.runs.length).toBeGreaterThan(0);
    expect(seed.events.length).toBeGreaterThan(0);
    expect(seed.gallery.length).toBeGreaterThan(0);
    expect(seed.version).toBe(0);
    expect(seed.updatedAt).toBe("");
  });

  it("rejects documents missing a required list", () => {
    expect(normaliseContent(null)).toBeNull();
    expect(normaliseContent("nope")).toBeNull();
    expect(normaliseContent({ runs: [], events: [] })).toBeNull();
    expect(normaliseContent({ runs: [], events: [], gallery: null })).toBeNull();
  });

  it("fills defaults for a valid document", () => {
    expect(
      normaliseContent({ runs: [], events: [], gallery: [] }),
    ).toEqual({
      version: 0,
      updatedAt: "",
      runs: [],
      events: [],
      gallery: [],
    });
  });

  it("only exposes published runs, events and photos", () => {
    const hiddenRun = {
      ...seed.runs[0],
      id: "hidden-run",
      slug: "hidden-run",
      published: false,
    };
    const hiddenEvent = {
      ...seed.events[0],
      id: "hidden-event",
      published: false,
    };
    const hiddenPhoto = {
      ...seed.gallery[0],
      id: "hidden-photo",
      published: false,
    };
    const hiddenUpcoming = {
      ...seed.runs[0],
      id: "hidden-upcoming",
      status: "upcoming" as const,
      published: false,
    };
    const content = {
      ...seed,
      runs: [...seed.runs, hiddenRun, hiddenUpcoming],
      events: [...seed.events, hiddenEvent],
      gallery: [...seed.gallery, hiddenPhoto],
    };

    expect(selectPublishedRuns(content).some((run) => run.id === "hidden-run")).toBe(false);
    expect(
      selectUpcomingRuns(content).some((run) => run.id === "hidden-upcoming"),
    ).toBe(false);
    expect(
      selectPublishedEvents(content).some((event) => event.id === "hidden-event"),
    ).toBe(false);
    expect(
      selectDisplayableGallery(content).some((photo) => photo.id === "hidden-photo"),
    ).toBe(false);
  });

  it("does not resolve an unpublished run by slug", () => {
    const run = { ...seed.runs[0], slug: "secret-run", published: false };
    expect(selectRunBySlug({ ...seed, runs: [run] }, "secret-run")).toBeUndefined();
  });

  it("features at most five displayable photos", () => {
    const displayable = selectDisplayableGallery(seed);
    expect(selectFeaturedGallery(seed)).toEqual(displayable.slice(0, 5));
    expect(selectFeaturedGallery(seed).length).toBeLessThanOrEqual(5);
  });

  it("caps a run story at the first fifteen items", () => {
    const items = Array.from(
      { length: MAX_RUN_MEDIA + 5 },
      (_, index) => `/gallery_photos/photo-${index}.jpg`,
    );

    expect(limitRunMedia(items)).toHaveLength(MAX_RUN_MEDIA);
    expect(limitRunMedia(items)).toEqual(items.slice(0, MAX_RUN_MEDIA));
    expect(limitRunMedia(items.slice(0, 3))).toHaveLength(3);
  });

  it("slugifies titles and keeps a fallback", () => {
    expect(slugify("Run Away Boy's Birthday Hash")).toBe(
      "run-away-boys-birthday-hash",
    );
    expect(slugify("  ")).toMatch(/^item-/);
  });
});

describe("offline draft store", () => {
  beforeEach(() => {
    clearDraft();
  });

  it("round-trips content and the pending flag", () => {
    expect(readDraft()).toBeNull();

    const content = buildSeedContent();
    writeDraft(content, true);

    const draft = readDraft();
    expect(draft?.pending).toBe(true);
    expect(draft?.content.runs).toHaveLength(content.runs.length);
    expect(draft?.updatedAt).toBeTypeOf("number");
  });

  it("clears the draft", () => {
    writeDraft(buildSeedContent(), false);
    expect(readDraft()).not.toBeNull();
    clearDraft();
    expect(readDraft()).toBeNull();
  });
});
