import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { BrandLockup } from "@/components/BrandMark";
import { siteConfig } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("brand lockup", () => {
  it("spells the club name out in full beside the logo", () => {
    const { container } = renderWithRouter(<BrandLockup />);

    /* The name is split across a real <br /> for layout, so the whole lockup
       reads as one string in the DOM rather than two matched text nodes. */
    const text = container.textContent!.replace(/\s+/g, " ").trim();
    expect(text).toBe(siteConfig.identity.name);

    /* The club explicitly asked for the full name rather than the WWH3
       abbreviation in the header. */
    expect(text).not.toContain(siteConfig.identity.abbreviation);
    expect(text).toContain("West West");
    expect(text).toContain("Hash House Harriers");
  });

  it("reads as one continuous name, not two fragments", () => {
    const { container } = renderWithRouter(<BrandLockup />);

    expect(container.textContent!.replace(/\s+/g, " ").trim()).toBe(
      siteConfig.identity.name,
    );
  });

  it("derives the lockup from siteConfig rather than hard-coded text", () => {
    expect(siteConfig.identity.nameParts.first).toBe("West West");
    expect(siteConfig.identity.nameParts.rest).toBe("Hash House Harriers");

    /* If the club ever renames itself, editing siteConfig must be enough —
       the lockup must not quietly disagree with `identity.name`. */
    expect(
      `${siteConfig.identity.nameParts.first} ${siteConfig.identity.nameParts.rest}`,
    ).toBe(siteConfig.identity.name);
  });

  it("marks the logo decorative because the name is always real text", () => {
    const { container } = renderWithRouter(<BrandLockup />);

    const logo = container.querySelector("img")!;
    expect(logo).toHaveAttribute("alt", "");
    expect(logo).toHaveAttribute("loading", "eager");
  });

  it("can show the logo alone, without the name", () => {
    const { container } = renderWithRouter(<BrandLockup markOnly />);

    expect(screen.queryByText("West West")).not.toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("renders the full name in the footer lockup too", () => {
    const { container } = renderWithRouter(<BrandLockup tone="light" />);

    expect(container.textContent!.replace(/\s+/g, " ").trim()).toBe(
      siteConfig.identity.name,
    );
  });
});