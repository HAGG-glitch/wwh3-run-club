import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

function header() {
  return screen.getByTestId("site-header");
}

function menuButton() {
  return screen.getByRole("button", { name: /open navigation menu/i });
}

describe("mobile header layout", () => {
  it("puts the logo and the menu button on the same row", () => {
    renderWithRouter(<SiteHeader />);

    const classes = header().className;

    /* The bug: the header grid had no mobile `grid-cols`, so it auto-placed the
       lockup and the burger into separate rows. The burger landed in a second
       row that overflowed the fixed header height and overlapped page content.
       A two-column template is what keeps them on one line. */
    expect(classes).toContain("grid-cols-[1fr_auto]");
    expect(classes).toContain("lg:grid-cols-[1fr_auto_1fr]");
  });

  it("gives the menu button its own column, not a stacked row", () => {
    renderWithRouter(<SiteHeader />);

    /* `justify-self-end` is only meaningful once the button is in its own
       column of the same row as the lockup. */
    expect(menuButton().className).toContain("justify-self-end");
    expect(menuButton().className).toContain("shrink-0");
  });

  it("keeps a 44px touch target on the menu button", () => {
    renderWithRouter(<SiteHeader />);

    /* Apple and Android both put the floor at 44px; the shadcn `icon` size is
       32px, so the size has to be stated explicitly. */
    expect(menuButton().className).toContain("size-11");
  });

  it("hides the menu button on desktop where the full nav is shown", () => {
    renderWithRouter(<SiteHeader />);

    expect(menuButton().className).toContain("lg:hidden");
    expect(screen.getByTestId("desktop-nav").className).toContain("hidden");
    expect(screen.getByTestId("desktop-nav").className).toContain("lg:flex");
  });

  it("does not change the header height when the page scrolls on mobile", () => {
    const { unmount } = renderWithRouter(<SiteHeader />);

    const before = header().className;
    expect(before).toContain("h-[72px]");

    window.scrollY = 400;
    window.dispatchEvent(new Event("scroll"));

    /* Both states declare the same mobile height, so the lockup and the button
       cannot shift as the page moves. The shrink only appears under `lg:`. */
    const after = header().className;
    expect(after).toContain("h-[72px]");

    const mobileHeight = (c: string) => c.match(/(?:^|\s)h-\[(\d+)px\]/)?.[1];
    expect(mobileHeight(after)).toBe(mobileHeight(before));

    unmount();
  });

  it("keeps the desktop height shrink after scrolling", () => {
    renderWithRouter(<SiteHeader />);

    window.scrollY = 400;
    window.dispatchEvent(new Event("scroll"));

    expect(header()).toHaveAttribute("data-scrolled", "true");
    expect(header().className).toContain("lg:h-[72px]");
  });

  it("uses a custom mark rather than the stock icon", () => {
    const { container } = renderWithRouter(<SiteHeader />);

    /* Lucide's `Menu` rendered three identical bars, which read as a stock
       control. The replacement marks the middle bar in the club's gold. */
    const mark = container.querySelector("[aria-hidden='true'].flex.flex-col");
    expect(mark).not.toBeNull();
    expect(container.querySelector("svg.lucide-menu")).toBeNull();
  });

  it("labels the button and hides the decorative mark", () => {
    renderWithRouter(<SiteHeader />);

    /* The accessible name lives on the button, so the glyph must not be
       announced alongside it. */
    expect(menuButton()).toHaveAccessibleName("Open navigation menu");
    const mark = menuButton().querySelector("span[aria-hidden='true']");
    expect(mark).not.toBeNull();
    /* Nothing inside the button should reach the accessibility tree. */
    expect(
      menuButton().querySelectorAll("[aria-hidden='true']"),
    ).toHaveLength(1);
    expect(menuButton().textContent).toBe("");
  });
});

describe("mobile navigation panel", () => {
  it("gives the close button a 44px target", async () => {
    const user = (await import("@testing-library/user-event")).default.setup({
      delay: null,
    });
    renderWithRouter(<SiteHeader />);

    await user.click(menuButton());

    const close = await screen.findByRole("button", { name: "Close navigation menu" });
    /* shadcn's `icon-sm` default is 28px — too small to hit reliably with a
       thumb on the one surface where there is no keyboard or Escape key. */
    expect(close.className).toContain("size-11");
  });

  it("still offers a programmatic close for assistive technology", async () => {
    const user = (await import("@testing-library/user-event")).default.setup({
      delay: null,
    });
    renderWithRouter(<SiteHeader />);

    await user.click(menuButton());

    /* A visually hidden but real control, so screen-reader users are not
       dependent on the overlay. */
    const hiddenClose = screen.getByRole("button", {
      name: "Close navigation",
    });
    expect(hiddenClose.className).toContain("sr-only");
  });

  it("exposes the panel as a labelled dialog with a mobile nav landmark", async () => {
    const user = (await import("@testing-library/user-event")).default.setup({
      delay: null,
    });
    renderWithRouter(<SiteHeader />);

    await user.click(menuButton());

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName(/site navigation/i);
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
  });

  it("trims horizontal padding so the panel uses the screen well", async () => {
    const user = (await import("@testing-library/user-event")).default.setup({
      delay: null,
    });
    renderWithRouter(<SiteHeader />);

    await user.click(menuButton());

    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("w-[86vw]");
    expect(dialog.className).toContain("max-w-sm");
  });
});

describe("brand lockup at mobile widths", () => {
  it("steps the name down below sm so it fits beside the menu button", () => {
    renderWithRouter(<SiteHeader />);

    /* Spelled out in full, the name plus the logo and a 44px button overflowed
       a 360px viewport at the desktop size. The name is the flexible part. */
    const lockup = Array.from(
      header().querySelectorAll("span"),
    ).find((el) => /text-\[0\.62rem\]|sm:text-\[0\.7rem\]/.test(el.className));

    expect(lockup).toBeDefined();
    const classes = lockup!.className;

    expect(classes).toMatch(/text-\[0\.62rem\]/);
    expect(classes).toMatch(/sm:text-\[0\.7rem\]/);
  });

  it("still spells the full name out on mobile", () => {
    const { container } = renderWithRouter(<SiteHeader />);

    const text = container
      .querySelector("header")
      ?.textContent!.replace(/\s+/g, " ")
      .trim();

    expect(text).toContain(siteConfig.identity.name);
    expect(text).not.toContain(siteConfig.identity.abbreviation);
  });
});