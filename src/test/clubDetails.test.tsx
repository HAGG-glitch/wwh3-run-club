import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import App from "@/App";
import { siteConfig } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("club details", () => {
  it("publishes only social channels with a real https URL", () => {
    expect(siteConfig.social.length).toBeGreaterThan(0);
    for (const channel of siteConfig.social) {
      expect(channel.href).toMatch(/^https:\/\//);
      /* A bare hostname or a guessed handle is worse than no link at all. */
      expect(channel.href).not.toBe("https://");
      expect(channel.label).not.toBe("");
    }
  });

  it("keeps each label as a real name, not a lowercase slug", () => {
    /* The label is the link's accessible name, so "facebook" would be announced
       as a bare word. */
    for (const channel of siteConfig.social) {
      expect(channel.label).toMatch(/^[A-Z]/);
    }
  });

  it("pairs a tel: link with the number displayed to the visitor", () => {
    /* The display form carries spacing for legibility; the href must be the
       same number in E.164, which keeps the leading "+" that the spaces hide. */
    const e164 =
      siteConfig.contact.telephoneDisplay.startsWith("+")
        ? `+${siteConfig.contact.telephoneDisplay.replace(/\D/g, "")}`
        : siteConfig.contact.telephoneDisplay.replace(/\D/g, "");

    expect(siteConfig.contact.telephoneHref).toBe(`tel:${e164}`);
  });

  it("opens every social link safely in a new context", async () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    for (const channel of siteConfig.social) {
      const link = await screen.findByRole("link", {
        name: channel.label,
      });
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    }
  });

  it("shows the registered address and telephone on the page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    /* The address appears in both the footer and the contact section, so assert
       it is rendered at least once rather than exactly once. */
    expect(
      await screen.findAllByText(siteConfig.contact.address),
    ).not.toHaveLength(0);
    /* The number is repeated across the footer and contact section, which is
       intentional. What matters is that every occurrence dials correctly. */
    const telLinks = screen.getAllByRole("link", {
      name: siteConfig.contact.telephoneDisplay,
    });
    expect(telLinks.length).toBeGreaterThan(0);
    for (const link of telLinks) {
      expect(link).toHaveAttribute("href", siteConfig.contact.telephoneHref);
    }
  });
});