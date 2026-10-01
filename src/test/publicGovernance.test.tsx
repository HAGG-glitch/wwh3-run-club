import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import App from "@/App";
import { completedRuns } from "@/data/runs";
import { renderWithRouter } from "@/test/renderWithRouter";

/**
 * The club's internal governance structure is private and must never appear on
 * the public website, in any casing or phrasing. WWH3 intends to establish a
 * general group later, so nothing on the public site may name or hint at a
 * leadership body, officers, or approval procedures.
 */
const FORBIDDEN = [/inner\s*core/i];

/** Every public route, including one unknown path for the redirect target. */
const routes = [
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
  `/runs/${completedRuns[0]!.slug}`,
] as const;

/**
 * Text of the rendered document.
 *
 * `textContent` rather than `innerText` because jsdom does not implement
 * `innerText`. This is deliberately the stricter check: it also covers
 * visually-hidden text such as `sr-only` labels and `alt` text, all of which are
 * read aloud or indexed.
 */
function renderedText(): string {
  return document.body.textContent ?? "";
}

describe("private governance stays private", () => {
  it.each(routes)("renders %s without naming an internal body", async (route) => {
    renderWithRouter(<App />, { initialEntries: [route] });

    await screen.findByRole("heading", { level: 1 });

    for (const pattern of FORBIDDEN) {
      expect(renderedText()).not.toMatch(pattern);
    }
  });

  it("redirects an unknown route without leaking the term either", async () => {
    renderWithRouter(<App />, { initialEntries: ["/does-not-exist"] });

    await screen.findByRole("heading", { level: 1 });

    for (const pattern of FORBIDDEN) {
      expect(renderedText()).not.toMatch(pattern);
    }
  });

  it("does not put the term in any attribute, title or metadata", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    await screen.findByRole("heading", { level: 1 });

    // Attributes matter as well as text: alt text, aria-labels and the document
    // title are all read out or indexed.
    expect(document.documentElement.outerHTML).not.toMatch(/inner\s*core/i);
    expect(document.title).not.toMatch(/inner\s*core/i);
  });

  it("describes the application review without naming a decision-maker", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    expect(
      await screen.findByText("The application is reviewed by WWH3."),
    ).toBeInTheDocument();
  });

  it("reveals no officers, committees or internal titles", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    await screen.findByRole("heading", { level: 1 });

    const text = renderedText();
    for (const term of [
      /committee/i,
      /officer/i,
      /council/i,
      /general group/i,
      /voting body/i,
      /* Deliberately does not flag "Board": the club's registration authority is
         legitimately the "National Investment Board of Sierra Leone", which is a
         public registry fact and not a governance structure. */
    ]) {
      expect(text).not.toMatch(term);
    }
  });
});

describe("membership process is stated publicly", () => {
  it("keeps all six steps on the membership page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/membership"] });

    await screen.findByRole("heading", { level: 1 });

    const text = renderedText();
    for (const step of [
      "Attend a Hash",
      "Complete three runs",
      "Receive endorsement",
      "Application reviewed by WWH3",
      "Pay applicable fees",
      "Welcome to the fellowship",
    ]) {
      expect(text).toContain(step);
    }
  });

  it("keeps the qualifications on the homepage too", async () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    await screen.findByRole("heading", { level: 1 });

    const text = renderedText();
    expect(text).toMatch(/men aged 18 and above/i);
    expect(text).toMatch(/does not guarantee membership/i);
    expect(text).not.toMatch(/inner\s*core/i);
  });
});
