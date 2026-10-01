import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomePage } from "@/pages/HomePage";
import { faqItems } from "@/data/faq";
import { renderWithRouter } from "@/test/renderWithRouter";

/** The FAQ accordion is one of several accordions on the homepage. */
function getFaqAccordion() {
  return screen.getByTestId("faq-accordion");
}

function getFaqTriggers() {
  return within(getFaqAccordion()).getAllByRole("button");
}

describe("FAQ accordion", () => {
  it("renders every question in data order, all collapsed", () => {
    renderWithRouter(<HomePage />);

    const triggers = getFaqTriggers();

    expect(triggers).toHaveLength(faqItems.length);
    expect(triggers.map((t) => t.textContent?.trim())).toEqual(
      faqItems.map((item) => item.question),
    );
    for (const trigger of triggers) {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("reveals the answer when its question is activated", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    const first = faqItems[0];
    const trigger = within(getFaqAccordion()).getByRole("button", {
      name: first.question,
    });

    // Radix unmounts collapsed content, so the answer is absent, not hidden.
    expect(
      screen.queryByText(first.answer, { exact: false }),
    ).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    /* Radix exposes each panel as a labelled `region`. Asserting on that
       relationship is the real accessibility guarantee and avoids depending on
       jsdom's visibility heuristics for an animated element. */
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();

    const panel = document.getElementById(controls!);
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveTextContent(first.answer);
  });

  it("removes the answer again once collapsed", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    const first = faqItems[0];
    const trigger = within(getFaqAccordion()).getByRole("button", {
      name: first.question,
    });

    await user.click(trigger);
    expect(trigger.getAttribute("aria-controls")).toBeTruthy();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(first.answer, { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("collapses again on a second activation", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    const trigger = within(getFaqAccordion()).getByRole("button", {
      name: faqItems[0].question,
    });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("is operable from the keyboard alone", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    const trigger = within(getFaqAccordion()).getByRole("button", {
      name: faqItems[0].question,
    });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("associates an open trigger with its answer region", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    const trigger = within(getFaqAccordion()).getByRole("button", {
      name: faqItems[0].question,
    });

    await user.click(trigger);

    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();

    const panel = document.getElementById(controls!);
    expect(panel).toHaveAttribute("role", "region");
    // The panel points back at the trigger that controls it.
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });
});
