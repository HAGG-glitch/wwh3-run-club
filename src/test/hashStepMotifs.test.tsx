import { describe, expect, it } from "vitest";
import { within } from "@testing-library/react";

import { HomePage } from "@/pages/HomePage";
import { hashSteps } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("HashingSection step motifs", () => {
  it("renders no arrow or bullet glyph characters in the step markers", () => {
    renderWithRouter(<HomePage />);

    const markers = document.querySelectorAll(".step-motif");
    expect(markers).toHaveLength(hashSteps.length);

    /* The old design layered the marching dashes *on top of* arrow glyphs, so
       the arrows were still in the DOM and only appeared gone at a glance.
       Assert the glyphs are genuinely absent rather than merely covered. */
    for (const marker of markers) {
      expect(marker.textContent).toBe("");
      for (const glyph of ["→", "↑", "↓", "←", "◎", "•", "»", "➜", "➔"]) {
        expect(marker.textContent).not.toContain(glyph);
      }
    }
  });

  it("gives every step its own motif index so the animations can differ", () => {
    renderWithRouter(<HomePage />);

    const indices = Array.from(
      document.querySelectorAll(".step-motif"),
    ).map((el) => el.getAttribute("data-step-motif"));

    expect(indices).toEqual(hashSteps.map((_, i) => String(i)));
    expect(new Set(indices).size).toBe(hashSteps.length);
  });

  it("closes the last step with a circle and trails the rest", () => {
    renderWithRouter(<HomePage />);

    const markers = Array.from(document.querySelectorAll(".step-motif"));
    const last = markers[markers.length - 1]!;

    expect(last.querySelector(".step-motif-circle")).not.toBeNull();
    expect(last.querySelector(".step-motif-trail")).toBeNull();

    for (const marker of markers.slice(0, -1)) {
      expect(marker.querySelector(".step-motif-trail")).not.toBeNull();
      expect(marker.querySelector(".step-motif-circle")).toBeNull();
    }
  });

  it("keeps the motifs decorative so the list carries the meaning", () => {
    renderWithRouter(<HomePage />);

    const list = document.querySelector("#hashing ol")!;
    /* The ordered list is what conveys sequence; the markers are decoration
       and must not add noise for assistive technology. */
    for (const marker of document.querySelectorAll(".step-motif")) {
      expect(marker.getAttribute("aria-hidden")).toBe("true");
      expect(within(list as HTMLElement).getAllByRole("listitem")).toHaveLength(
        hashSteps.length,
      );
    }
  });
});
