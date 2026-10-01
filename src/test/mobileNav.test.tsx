import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteHeader } from "@/components/SiteHeader";
import App from "@/App";
import { primaryNav } from "@/data/navigation";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("mobile navigation sheet", () => {
  it("is closed until the menu button is used", () => {
    renderWithRouter(<SiteHeader />);

    expect(
      screen.queryByRole("dialog", { name: /site navigation/i }),
    ).not.toBeInTheDocument();
  });

  it("opens a labelled dialog listing every primary destination", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const dialog = await screen.findByRole("dialog", {
      name: /site navigation/i,
    });

    const mobileNav = within(dialog).getByRole("navigation", {
      name: "Mobile",
    });

    for (const item of primaryNav) {
      // Dropdowns appear in the sheet as buttons that open their own menu, so
      // every top-level destination is reachable on a phone.
      expect(
        within(mobileNav).getByRole(
          item.kind === "dropdown" ? "button" : "link",
          { name: new RegExp(item.label, "i") },
        ),
      ).toBeInTheDocument();
    }
  });

  it("operates a section dropdown inside the sheet by keyboard", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const dialog = await screen.findByRole("dialog");
    const mobileNav = within(dialog).getByRole("navigation", { name: "Mobile" });

    const trigger = within(mobileNav).getByRole("button", { name: /gallery/i });
    trigger.focus();
    await user.keyboard("{Enter}");

    const menu = await screen.findByRole("menu");
    for (const label of ["photos", "events", "publications", "news"]) {
      expect(
        within(menu).getByRole("menuitem", { name: new RegExp(label, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("closes when a destination is chosen", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const dialog = await screen.findByRole("dialog");
    const mobileNav = within(dialog).getByRole("navigation", { name: "Mobile" });

    await user.click(within(mobileNav).getByRole("link", { name: "Runs" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("closes the sheet when a dropdown item is chosen", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const dialog = await screen.findByRole("dialog");
    const mobileNav = within(dialog).getByRole("navigation", { name: "Mobile" });

    await user.click(within(mobileNav).getByRole("button", { name: /membership/i }));

    const menu = await screen.findByRole("menu");
    await user.click(
      within(menu).getByRole("menuitem", { name: /coverage/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: /where the club/i }),
    ).toBeInTheDocument();
  });

  it("closes on Escape, so the dialog is never a trap for keyboard users", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("restores focus to the trigger after closing", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    const trigger = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("carries the contact details in the sheet for small screens", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/westwesth3@gmail\.com/)).toBeInTheDocument();
  });
});
