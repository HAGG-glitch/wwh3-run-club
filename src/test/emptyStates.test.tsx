import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import App from "@/App";
import {
  allPublications,
  hasPublicPublications,
  publicPublications,
  viewOnlyPublications,
} from "@/data/publications";
import { allDonors, publishedDonors } from "@/data/donors";
import { allEvents, publishedEvents } from "@/data/events";
import { allNews, publishedNews } from "@/data/news";
import { allPartners, publishedPartners } from "@/data/partners";
import { renderWithRouter } from "@/test/renderWithRouter";

/**
 * Publication gates.
 *
 * These hold for every record, now and after content is added. They are the
 * durable guarantee; the empty-state assertions below only describe today's
 * data and are expected to be revisited when the club supplies real records.
 */
describe("publication gates", () => {
  it("only lists an event once it is published", () => {
    for (const event of publishedEvents) {
      expect(event.published).toBe(true);
    }

    for (const event of allEvents) {
      if (!event.published) {
        expect(publishedEvents).not.toContain(event);
      }
    }
  });

  it("never exposes a document without confirmed publication permission", () => {
    for (const publication of publicPublications) {
      expect(publication.published).toBe(true);
      expect(publication.publicationPermissionConfirmed).toBe(true);
      expect(publication.downloadAllowed).toBe(true);
      // A downloadable document needs a real target, never a placeholder.
      expect(publication.fileUrl).toBeTruthy();
    }

    for (const publication of allPublications) {
      if (!publication.publicationPermissionConfirmed) {
        expect(publicPublications).not.toContain(publication);
        expect(viewOnlyPublications).not.toContain(publication);
      }
    }
  });

  it("never offers a download for a document marked view-only", () => {
    for (const publication of viewOnlyPublications) {
      expect(publication.downloadAllowed).toBe(false);
    }
  });

  it("only lists news that is published and attributable", () => {
    for (const article of publishedNews) {
      expect(article.published).toBe(true);
    }

    for (const article of allNews) {
      if (!article.published) {
        expect(publishedNews).not.toContain(article);
      }
    }
  });

  it("only lists partners that are published", () => {
    for (const partner of publishedPartners) {
      expect(partner.published).toBe(true);
    }
  });

  it("never lists a donor without recognition consent", () => {
    for (const donor of publishedDonors) {
      expect(donor.recognitionConsent).toBe(true);
      expect(donor.published).toBe(true);
    }

    for (const donor of allDonors) {
      if (!donor.recognitionConsent) {
        expect(publishedDonors).not.toContain(donor);
      }
    }
  });
});

describe("current data is unapproved", () => {
  it("has no publications, so no document can be exposed", () => {
    expect(hasPublicPublications).toBe(false);
  });

  it("has no news articles, so nothing is fabricated", () => {
    expect(allNews).toHaveLength(0);
  });

  it("has no partners", () => {
    expect(allPartners).toHaveLength(0);
  });

  it("has no donors", () => {
    expect(allDonors).toHaveLength(0);
  });
});

describe("empty states", () => {
  it("lists the club's first recorded run under Events", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/events"] });

    expect(
      await screen.findByRole("heading", {
        name: /run away boy's birthday hash/i,
      }),
    ).toBeInTheDocument();
  });

  it("links the event through to its photographs", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/events"] });

    await screen.findByRole("heading", {
      name: /run away boy's birthday hash/i,
    });

    expect(
      screen.getByRole("link", { name: /view the photographs/i }),
    ).toHaveAttribute("href", "/runs/run-away-boy-birthday");
  });

  it("states that no public documents are available", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/publications"] });

    expect(
      await screen.findByText(
        /no public documents are currently available\./i,
      ),
    ).toBeInTheDocument();
  });

  it("offers no download control while nothing is approved", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/publications"] });

    await screen.findByText(/no public documents/i);

    expect(screen.queryByRole("link", { name: /download/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /download/i })).not.toBeInTheDocument();
  });

  it("says plainly that no news has been published", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/news"] });

    expect(
      await screen.findByText(/no news has been published yet\./i),
    ).toBeInTheDocument();
  });

  it("does not invent partners", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/partnerships"] });

    expect(
      await screen.findByText(/no partners have been published yet\./i),
    ).toBeInTheDocument();
  });

  it("does not invent donors", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/donors"] });

    expect(
      await screen.findByText(
        /no donors or supporters are listed yet\./i,
      ),
    ).toBeInTheDocument();
  });

  it("withholds membership statistics until they are verified", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/trends"] });

    expect(
      await screen.findByText(
        /membership trend information will be published when verified data becomes available\./i,
      ),
    ).toBeInTheDocument();
  });

  it("publishes no membership figures", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/trends"] });

    await screen.findByText(/verified data becomes available/i);

    // Every metric is still Pending, so no figure can be mistaken for real.
    expect(screen.getAllByText(/pending/i).length).toBeGreaterThan(0);
  });
});

describe("coverage page honesty", () => {
  it("lists only confirmed locations", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/coverage"] });

    await screen.findByRole("heading", { level: 1 });

    const confirmed = screen.getByRole("heading", {
      name: /confirmed locations/i,
    });
    expect(confirmed).toBeInTheDocument();

    for (const place of ["Western Area", "Freetown", "Sierra Leone"]) {
      expect(screen.getAllByText(new RegExp(place, "i")).length).toBeGreaterThan(0);
    }
  });

  it("separates the confirmed base from future areas of activity", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership/coverage"] });

    expect(
      await screen.findByRole("heading", {
        name: /areas of activity beyond the base/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/no additional areas of activity have been confirmed/i),
    ).toBeInTheDocument();
  });
});
