import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";
import {
  flattenNav,
  gallerySections,
  membershipSections,
  primaryNav,
} from "@/data/navigation";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("main navigation", () => {
  it("renders the club brand as a link home", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    expect(
      screen.getByRole("link", { name: `${siteConfig.identity.name} home` }),
    ).toHaveAttribute("href", "/");
  });

  it("exposes every top-level destination in the desktop bar", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });

    for (const item of primaryNav) {
      if (item.kind === "dropdown") {
        /* A dropdown's trigger is a button: its single job is to open the
           section's pages, so it must not also masquerade as a link. */
        expect(
          within(nav).getByRole("button", { name: new RegExp(item.label, "i") }),
        ).toBeInTheDocument();
        expect(
          within(nav).queryByRole("link", { name: new RegExp(`^${item.label}$`, "i") }),
        ).not.toBeInTheDocument();
      } else {
        expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute(
          "href",
          item.to,
        );
      }
    }
  });

  it("does not wrap the navigation and spaces it with a gap", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });

    // Guards the "items bundled together" regression: the bar must carry a
    // real gap utility, and must not be allowed to wrap onto a second line.
    expect(nav.className).toMatch(/flex-nowrap/);
    expect(nav.className).toMatch(/gap-x-/);

    for (const child of Array.from(nav.children)) {
      expect(child.className).toMatch(/whitespace-nowrap/);
    }
  });

  it("separates the action button from the link group", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const header = screen.getByTestId("site-header");
    const action = within(header).getByRole("link", { name: /join the hash/i });

    expect(action).toHaveAttribute("href", `/#${sectionIds.membership}`);

    // A visible rule, rather than spacing alone, distinguishes the call to
    // action from ordinary navigation.
    expect(header.querySelector('[aria-hidden="true"].bg-ink\\/15')).not.toBeNull();
  });

  it("points in-page destinations at homepage hash routes", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      `/#${sectionIds.about}`,
    );
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      `/#${sectionIds.contact}`,
    );
  });

  it("marks the current page as active for assistive technology", () => {
    renderWithRouter(<App />, { initialEntries: ["/runs"] });

    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "Runs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps a section marked active across its whole subtree", () => {
    renderWithRouter(<App />, { initialEntries: ["/gallery/news"] });

    const nav = screen.getByRole("navigation", { name: "Main" });

    // Gallery is a dropdown, so it is marked with a text alternative plus the
    // active colour rather than aria-current on a link.
    expect(
      within(nav).getByRole("button", { name: /gallery \(current section\)/i }),
    ).toBeInTheDocument();
  });

  it("routes to the Hash Log without a document navigation", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    await user.click(within(nav).getByRole("link", { name: "Runs" }));

    // The runs route renders, proving the router handled it in-app.
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /every trail/i,
      }),
    ).toBeInTheDocument();
  });

  it("routes to a gallery child page through the dropdown", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    await user.click(within(nav).getByRole("button", { name: /gallery/i }));

    const menu = await screen.findByRole("menu");
    await user.click(within(menu).getByRole("menuitem", { name: /news/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /stories from/i }),
    ).toBeInTheDocument();
  });

  it("shows the contact address and motto in the footer", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByText(siteConfig.contact.address),
    ).toBeInTheDocument();
    expect(footer).toHaveTextContent(siteConfig.identity.motto);
  });

  it("exposes contact channels as real tel and mailto links", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByRole("link", { name: siteConfig.contact.email }),
    ).toHaveAttribute("href", siteConfig.contact.emailHref);
    expect(
      within(footer).getByRole("link", {
        name: siteConfig.contact.telephoneDisplay,
      }),
    ).toHaveAttribute("href", siteConfig.contact.telephoneHref);
  });

  it("keeps every dropdown page reachable from the footer", () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const footer = within(screen.getByRole("contentinfo"));
    const hrefs = new Set(
      footer
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    );

    for (const section of [...gallerySections, ...membershipSections]) {
      expect(hrefs).toContain(section.to);
    }
  });

  it("does not repeat a destination in the flattened nav list", () => {
    /* Asserted against the config rather than the whole footer, because the
       footer also contains the brand link and the closing motto link, which
       legitimately share a destination with the Home and Contact nav items. */
    const hrefs = flattenNav().map((item) => item.to);

    expect(hrefs).toHaveLength(new Set(hrefs).size);
    expect(hrefs.filter((href) => href === "/membership")).toHaveLength(1);
  });
});
