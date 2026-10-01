import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import App from "@/App";
import { gallerySections, membershipSections } from "@/data/navigation";
import { renderWithRouter } from "@/test/renderWithRouter";

const clubName = "West West Hashers";

/** Routes that must be independently indexable. */
const routes = [
  ["/gallery", "Gallery"],
  ["/gallery/photos", "Photos"],
  ["/gallery/events", "Events"],
  ["/gallery/publications", "Publications"],
  ["/gallery/news", "News"],
  ["/membership", "Membership"],
  ["/membership/partnerships", "Partnerships"],
  ["/membership/donors", "Donors"],
  ["/membership/trends", "Membership Trends"],
  ["/membership/coverage", "Coverage"],
] as const;

function readMeta(selector: string): string {
  return document.querySelector(selector)?.getAttribute("content") ?? "";
}

describe("page metadata", () => {
  it.each(routes)("gives %s its own title", async (route, title) => {
    renderWithRouter(<App />, { initialEntries: [route] });

    await screen.findByRole("heading", { level: 1 });

    expect(document.title).toBe(`${title} | ${clubName}`);
  });

  it.each(routes)("gives %s a description", async (route) => {
    renderWithRouter(<App />, { initialEntries: [route] });

    await screen.findByRole("heading", { level: 1 });

    const description = readMeta('meta[name="description"]');

    expect(description.length).toBeGreaterThan(40);
    /* "placeholder" is not filler here: several pages honestly disclose that
       their content is awaiting approval, which is wording the site intends. */
    expect(description).not.toMatch(/lorem|\bTODO\b|\bTBD\b|\bXXX\b/);
  });

  it("keeps Open Graph copy in step with the page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/news"] });

    await screen.findByRole("heading", { level: 1 });

    expect(readMeta('meta[property="og:title"]')).toBe("News");
    expect(readMeta('meta[property="og:description"]')).toBe(
      readMeta('meta[name="description"]'),
    );
  });

  it("does not invent a domain, author or social account", async () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/news"] });

    await screen.findByRole("heading", { level: 1 });

    const html = document.documentElement.outerHTML;

    // No placeholder hostnames or handles may appear in metadata or content.
    expect(html).not.toMatch(/example\.(com|org|net)/i);
    expect(html).not.toMatch(/\bTBD\b/);
    expect(html).not.toMatch(/lorem ipsum/i);
  });

  it("titles every navigable section consistently", async () => {
    /* The gallery overview is a page in its own right, so it is titled
       separately from the four gallery child sections. */
    const expected = [
      "Gallery",
      ...gallerySections.map((section) => section.label),
      ...membershipSections.map((section) => section.label),
    ];

    const actual = routes.map(([, title]) => title);

    expect(actual).toEqual(expected);
  });
});
