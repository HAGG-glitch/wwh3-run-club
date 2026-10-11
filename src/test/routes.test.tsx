import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";

import App from "@/App";
import { gallerySections, membershipSections } from "@/data/navigation";
import { renderWithRouter } from "@/test/renderWithRouter";

/** Every route the site is expected to serve. */
const allRoutes = [
  "/",
  "/runs",
  "/gallery",
  "/gallery/photos",
  "/gallery/events",
  "/gallery/publications",
  "/gallery/news",
  "/membership",
  "/membership/partnerships",
  "/membership/donors",
  "/membership/trends",
  "/membership/coverage",
] as const;

describe("gallery routes", () => {
  it("keeps /gallery as a working overview page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery"] });

    expect(
      await screen.findByRole("heading", { level: 1 }),
    ).toHaveTextContent(/everything the/i);
  });

  it("introduces all four content categories as linked cards", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery"] });

    await screen.findByRole("heading", { level: 1 });

    for (const section of gallerySections) {
      // The card heading and its "Open <label>" link both point at the child
      // route, and the sub-nav repeats the destination for the same purpose.
      const links = screen.getAllByRole("link", {
        name: new RegExp(section.label, "i"),
      });

      expect(links.length).toBeGreaterThan(0);
      expect(
        links.some((link) => link.getAttribute("href") === section.to),
      ).toBe(true);
    }
  });

  it("links each category card to its own page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery"] });

    await screen.findByRole("heading", { level: 1 });

    for (const section of gallerySections) {
      const link = screen
        .getAllByRole("link", { name: new RegExp(`open ${section.label}`, "i") })
        .find((candidate) => candidate.getAttribute("href") === section.to);

      expect(link).toBeDefined();
    }
  });

  it.each(gallerySections.map((section) => [section.to, section.label]))(
    "serves %s with a page heading",
    async (route) => {
      const { getPath } = renderWithRouter(<App />, { initialEntries: [route] });

      expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(getPath()).toBe(route);
    },
  );
});

describe("membership routes", () => {
  it.each(membershipSections.map((section) => [section.to, section.label]))(
    "serves %s with a page heading",
    async (route) => {
      const { getPath } = renderWithRouter(<App />, { initialEntries: [route] });

      expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(getPath()).toBe(route);
    },
  );

  it("retains the public membership qualifications on /membership", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.getByText(/applicants must be men aged 18 or above/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/runners and walkers of different abilities are welcome/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /existing hashers may be exempted from the three-run requirement/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/submitting an application does not guarantee membership/i),
    ).toBeInTheDocument();
  });

  it("sets out the six-step application process", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    await screen.findByRole("heading", { level: 1 });

    const steps = [
      /attend a hash/i,
      /complete three runs/i,
      /receive endorsement/i,
      /application reviewed by wwh3/i,
      /pay applicable fees/i,
      /welcome to the fellowship/i,
    ];

    for (const step of steps) {
      expect(screen.getByRole("heading", { name: step })).toBeInTheDocument();
    }
  });
});

describe("routing behaviour", () => {
  it.each(allRoutes)("serves %s directly", async (route) => {
    const { getPath } = renderWithRouter(<App />, { initialEntries: [route] });

    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    // A direct load of a child route must not bounce to the homepage.
    expect(getPath()).toBe(route);
  });

  it.each([
    "/does-not-exist",
    "/gallery/unknown-section",
    "/membership/unknown-section",
    "/gallery/photos/extra",
  ])("redirects the unknown route %s home", async (route) => {
    const { getPath } = renderWithRouter(<App />, { initialEntries: [route] });

    await screen.findByRole("heading", { level: 1 });
    expect(getPath()).toBe("/");
  });

  it("shows no concept notice on any route", async () => {
    for (const route of allRoutes) {
      const { unmount } = renderWithRouter(<App />, {
        initialEntries: [route],
      });

      await screen.findByRole("heading", { level: 1 });
      expect(screen.queryByText(/concept preview/i)).not.toBeInTheDocument();
      unmount();
    }
  });
});

describe("section sub-navigation", () => {
  it("marks the current child page in the gallery sub-nav", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/news"] });

    const subnav = await screen.findByRole("navigation", {
      name: /gallery sections/i,
    });

    expect(
      within(subnav).getByRole("link", { name: /^news/i }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("marks the current child page in the membership sub-nav", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/donors"] });

    const subnav = await screen.findByRole("navigation", {
      name: /membership sections/i,
    });

    expect(
      within(subnav).getByRole("link", { name: /^donors/i }),
    ).toHaveAttribute("aria-current", "page");
  });
});
