import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";
import {
  gallerySections,
  membershipSections,
  primaryNav,
  type NavEntry,
} from "@/data/navigation";
import { renderWithRouter } from "@/test/renderWithRouter";

/** Opens a dropdown from the desktop bar by activating its trigger. */
async function openDropdown(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
) {
  const nav = screen.getByRole("navigation", { name: "Main" });
  await user.click(
    within(nav).getByRole("button", { name: new RegExp(label, "i") }),
  );
  return screen.findByRole("menu");
}

/**
 * Asserts a dropdown offers its overview plus one item per child page.
 *
 * Items are matched by destination rather than by label, because a child's
 * accessible name includes its description and "Membership" appears both as an
 * overview and as a child of the Membership dropdown.
 */
function expectChildren(
  menu: HTMLElement,
  sections: readonly { label: string; to: string }[],
) {
  const items = within(menu).getAllByRole("menuitem");

  expect(items).toHaveLength(sections.length + 1);

  for (const section of sections) {
    const item = items.find(
      (candidate) => candidate.getAttribute("href") === section.to,
    );

    expect(item, `no menu item linking to ${section.to}`).toBeDefined();
    expect(item?.textContent).toContain(section.label);
  }
}

describe.each([
  ["Gallery", gallerySections],
  ["Membership", membershipSections],
] as const)("%s dropdown", (label, sections) => {
  it("offers every child page as a real link", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const menu = await openDropdown(user, label);
    expectChildren(menu, sections);
  });

  it("opens from the keyboard with Enter", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    const trigger = within(nav).getByRole("button", {
      name: new RegExp(label, "i"),
    });

    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");

    expectChildren(await screen.findByRole("menu"), sections);
  });

  it("opens with the Down Arrow key", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    within(nav)
      .getByRole("button", { name: new RegExp(label, "i") })
      .focus();

    await user.keyboard("{ArrowDown}");

    expectChildren(await screen.findByRole("menu"), sections);
  });

  it("moves focus into the menu with the Down Arrow key", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    within(nav)
      .getByRole("button", { name: new RegExp(label, "i") })
      .focus();

    await user.keyboard("{ArrowDown}");

    const menu = await screen.findByRole("menu");
    /* The item itself is the focus target: `asChild` makes the router Link the
       menu item, rather than wrapping it. */
    const firstItem = within(menu).getAllByRole("menuitem")[0]!;
    await waitFor(() => expect(firstItem).toHaveFocus());
  });

  it("closes on Escape and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    const trigger = within(nav).getByRole("button", {
      name: new RegExp(label, "i"),
    });

    await openDropdown(user, label);
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes when a pointer is pressed outside it", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    await openDropdown(user, label);

    await user.click(screen.getByTestId("site-header"));

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("toggles shut when its trigger is pressed again", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    const trigger = within(nav).getByRole("button", {
      name: new RegExp(label, "i"),
    });

    await user.click(trigger);
    await screen.findByRole("menu");

    await user.click(trigger);

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("navigates in-app when a child page is chosen", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const menu = await openDropdown(user, label);
    const first = sections[0]!;
    const items = within(menu).getAllByRole("menuitem");
    const target = items.find(
      (item) => item.getAttribute("href") === first.to,
    );
    await user.click(target!);

    // The page heading appears and the address is the child route, proving the
    // router handled it without a full document load.
    expect(
      await screen.findByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("desktop-nav")).toBeInTheDocument();
  });

  it("is operable without hover", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { initialEntries: ["/"] });

    const nav = screen.getByRole("navigation", { name: "Main" });
    const trigger = within(nav).getByRole("button", {
      name: new RegExp(label, "i"),
    });

    await user.hover(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });
});

describe("navigation configuration", () => {
  it("exposes exactly the required dropdown sections", () => {
    const dropdowns = primaryNav.filter(
      (entry): entry is Extract<NavEntry, { kind: "dropdown" }> =>
        entry.kind === "dropdown",
    );

    expect(dropdowns.map((entry) => entry.label)).toEqual([
      "Gallery",
      "Membership",
    ]);
  });

  it("routes every gallery child to the gallery namespace", () => {
    for (const section of gallerySections) {
      expect(section.to).toMatch(/^\/gallery\/[a-z]+$/);
    }
  });

  it("routes every membership child to the membership namespace", () => {
    for (const section of membershipSections) {
      expect(section.to).toMatch(/^\/membership(\/[a-z]+)?$/);
    }
  });
});
