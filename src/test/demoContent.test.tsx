import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";
import { HomePage } from "@/pages/HomePage";
import { completedRuns, upcomingRuns } from "@/data/runs";
import {
  galleryItems,
  galleryPhotosNeedingDescriptions,
  publishedGalleryItems,
} from "@/data/gallery";
import { demoLabels } from "@/lib/demoLabels";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("demo data invariants", () => {
  it("schedules no upcoming runs, so no date can be mistaken for real", () => {
    expect(upcomingRuns).toHaveLength(0);
  });

  it("flags every completed run as demonstration material", () => {
    expect(completedRuns.length).toBeGreaterThan(0);
    for (const run of completedRuns) {
      expect(run.isDemo).toBe(true);
    }
  });

  it("keeps placeholder and consented club photographs distinguishable", () => {
    expect(galleryItems.length).toBeGreaterThan(0);
    /* The gallery now mixes two clearly different populations: the consented
       club photographs from `public/gallery_photos`, and the generic
       placeholders that remain purely to exercise the layout. Neither may be
       presented as the other, so every record must declare which it is. */
    for (const item of galleryItems) {
      if (item.isDemo) {
        expect(item.consentConfirmed).toBe(false);
      } else {
        expect(item.consentConfirmed).toBe(true);
        expect(item.image.startsWith("/gallery_photos/")).toBe(true);
      }
    }
  });

  it("never labels a real photograph as a placeholder", () => {
    for (const item of publishedGalleryItems) {
      if (item.consentConfirmed) {
        expect(item.isDemo).toBe(false);
      }
    }
  });

  it("does not invent descriptions for club photographs", () => {
    /* `alt` and `caption` must stay generic until a real description exists, so
       a screen-reader user is not told something untrue about the image. */
    for (const item of galleryPhotosNeedingDescriptions) {
      expect(item.isDemo).toBe(false);
      expect(item.descriptionConfirmed).toBe(false);
      expect(item.alt.trim().length).toBeLessThan(40);
      expect(item.date).toBeNull();
      expect(item.location).toBeNull();
      expect(item.hashNumber).toBeNull();
    }
  });

  it("never treats a real photograph as published without consent", () => {
    /* Placeholders are deliberately published so the gallery layout can be
       reviewed, but they are flagged `isDemo` and always labelled. The invariant
       that matters is that nothing presented as a genuine club photograph can be
       published without confirmed consent. */
    for (const item of galleryItems) {
      if (item.isDemo) continue;
      expect(item.consentConfirmed).toBe(true);
      expect(item.published).toBe(true);
    }
  });

  it("keeps unconsented photography out of the published set", () => {
    for (const item of publishedGalleryItems) {
      expect(item.consentConfirmed || item.isDemo).toBe(true);
    }
  });
});

describe("disclosure badges", () => {
  it("labels each demo run on the homepage", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getAllByText(demoLabels.record).length,
    ).toBeGreaterThanOrEqual(completedRuns.length);
  });

  it("labels both the record and its photograph on a run story", async () => {
    const run = completedRuns[0]!;
    renderWithRouter(<App />, { initialEntries: [`/runs/${run.slug}`] });

    await screen.findByRole("heading", { level: 1, name: run.title });

    expect(screen.getByText(demoLabels.record)).toBeInTheDocument();
    expect(screen.getByText(demoLabels.story)).toBeInTheDocument();
    expect(screen.getByText(demoLabels.photo)).toBeInTheDocument();
  });

  it("labels demo runs in the Hash Log listing", async () => {
    renderWithRouter(<App />, { initialEntries: ["/runs"] });

    await screen.findByRole("heading", {
      level: 1,
      name: /every trail/i,
    });

    expect(screen.getAllByText(demoLabels.record).length).toBeGreaterThan(0);
    expect(screen.getAllByText(demoLabels.photo).length).toBeGreaterThan(0);
  });

  it("labels every placeholder photograph on the Photos page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/photos"] });

    await screen.findByRole("heading", {
      level: 1,
      name: /different trails/i,
    });

    /* Every placeholder must be badged, and no consented club photograph may
       carry the label. Comparing counts in both directions is what actually
       pins the distinction — a single `toBeGreaterThanOrEqual` on the total
       would pass even if the badges were on the wrong images. */
    const placeholderCount = galleryItems.filter((item) => item.isDemo).length;
    const clubPhotoCount = galleryItems.filter((item) => !item.isDemo).length;
    const badgeCount = screen.getAllByText(demoLabels.photo).length;

    expect(placeholderCount).toBeGreaterThan(0);
    expect(clubPhotoCount).toBeGreaterThan(0);
    expect(badgeCount).toBe(placeholderCount);
  });

  it("keeps the site-wide concept disclosure on every page", async () => {
    for (const route of [
      "/",
      "/runs",
      "/gallery",
      "/gallery/photos",
      `/runs/${completedRuns[0]!.slug}`,
    ]) {
      const { unmount } = renderWithRouter(<App />, {
        initialEntries: [route],
      });

      // `role="note"` takes no accessible name, so assert on the visible text.
      expect(
        await screen.findByText(/concept preview/i),
      ).toBeInTheDocument();

      unmount();
    }
  });
});

describe("gallery dialog", () => {
  it("opens a labelled dialog describing the photograph", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/gallery/photos"] });

    await screen.findByRole("heading", {
      level: 1,
      name: /different trails/i,
    });

    const trigger = screen.getAllByRole("button", {
      name: /enlarge photograph/i,
    })[0]!;
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("img")).toBeInTheDocument();
  });
});
