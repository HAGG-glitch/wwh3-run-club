import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";
import { HomePage } from "@/pages/HomePage";
import { completedRuns, upcomingRuns } from "@/data/runs";
import { galleryItems } from "@/data/gallery";
import { governance } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

/* The site no longer ships demo run records or placeholder artwork, so the old
   "demo content" suite is replaced by the invariants that now hold. */

describe("real content invariants", () => {
  it("schedules no upcoming runs, so no date can be mistaken for real", () => {
    expect(upcomingRuns).toHaveLength(0);
  });

  it("publishes only real, completed runs", () => {
    expect(completedRuns.length).toBeGreaterThan(0);
    for (const run of completedRuns) {
      expect(run.isDemo).toBe(false);
      expect(run.published).toBe(true);
      expect(run.status).toBe("completed");
    }
  });

  it("keeps every run's photography real and on disk", () => {
    for (const run of completedRuns) {
      expect(run.coverImage.startsWith("/gallery_photos/")).toBe(true);
      for (const image of run.galleryImages) {
        expect(image.startsWith("/gallery_photos/")).toBe(true);
      }
    }
  });

  it("ships only real, consented club photographs", () => {
    expect(galleryItems.length).toBeGreaterThan(0);
    /* Every item is a consented club photograph served from `public/`; nothing
       is a bundled placeholder, and nothing is unconsented. */
    for (const item of galleryItems) {
      expect(item.isDemo).toBe(false);
      expect(item.consentConfirmed).toBe(true);
      expect(item.published).toBe(true);
      expect(item.image.startsWith("/gallery_photos/")).toBe(true);
    }
  });

  it("references none of the removed AI placeholder artwork", () => {
    const removed = [
      /hash-beach/,
      /hash-circle/,
      /hash-hills/,
      /wwh3-hero\.webp/,
    ];
    for (const item of galleryItems) {
      for (const pattern of removed) expect(item.image).not.toMatch(pattern);
    }
    for (const run of completedRuns) {
      for (const pattern of removed) {
        expect(run.coverImage).not.toMatch(pattern);
        for (const image of run.galleryImages) {
          expect(image).not.toMatch(pattern);
        }
      }
    }
  });
});

describe("the placeholder caution is gone", () => {
  it.each([
    "/",
    "/runs",
    "/gallery",
    "/gallery/photos",
    `/runs/${completedRuns[0]!.slug}`,
  ])("shows no concept notice on %s", async (route) => {
    const { unmount } = renderWithRouter(<App />, { initialEntries: [route] });

    await screen.findByRole("heading", { level: 1 });

    expect(screen.queryByText(/concept preview/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/placeholders until approved/i),
    ).not.toBeInTheDocument();

    unmount();
  });

  it("shows no placeholder badge on the Photos page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/photos"] });

    await screen.findByRole("heading", {
      level: 1,
      name: /different trails/i,
    });

    expect(
      screen.queryByTestId("placeholder-gallery-badge"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder photograph/i)).not.toBeInTheDocument();
  });

  it("shows no demo badge on a run story", async () => {
    const run = completedRuns[0]!;
    renderWithRouter(<App />, { initialEntries: [`/runs/${run.slug}`] });

    await screen.findByRole("heading", { level: 1, name: run.title });

    expect(screen.queryByText(/demo record/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder story/i)).not.toBeInTheDocument();
  });
});

describe("the constitution is published", () => {
  it("lists the four governance sections in order", () => {
    expect(governance.map((section) => section.id)).toEqual([
      "mandate",
      "objectives",
      "powers",
      "values",
    ]);
    for (const section of governance) {
      expect(section.clauses.length).toBeGreaterThan(0);
    }
  });

  it("renders the mandate and values on the homepage", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Mandate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Objectives" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Values and the Spirit of the Hash" }),
    ).toBeInTheDocument();
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
