import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { JoinForm } from "@/components/JoinForm";
import { renderWithRouter } from "@/test/renderWithRouter";

function setupUser() {
  return userEvent.setup({ delay: null });
}

describe("probe", () => {
  it("selects exactly one radio", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);

    await user.click(radios[0]!);
    const checked = screen
      .getAllByRole("radio")
      .filter((r) => r.getAttribute("data-state") === "checked");
    expect(checked).toHaveLength(1);
  });

  it("associates the error message with the radio group", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    await user.click(screen.getByRole("button", { name: /prepare my email/i }));

    const message = await screen.findByText(/please choose yes or no/i);
    const messageId = message.getAttribute("id");
    expect(messageId).toBeTruthy();

    /* The bug this pins: the group announced itself invalid but exposed no
       description, so a screen-reader user was told something was wrong and
       never what. */
    /* The group itself is the element a screen reader focuses, so that is where
       the invalid state and the error association must live — not on the
       individual items. */
    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.getAttribute("aria-describedby")).toContain(messageId!);
  });

  it("rejects a too-long name", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    const name = screen.getByLabelText(/full name/i);
    await user.type(name, "x".repeat(200));
    await user.click(screen.getByRole("button", { name: /prepare my email/i }));

    await waitFor(() =>
      expect(screen.getByText(/under 80 characters/i)).toBeInTheDocument(),
    );
  });

  it("whitespace-only name is rejected", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    const name = screen.getByLabelText(/full name/i);
    await user.click(name);
    await user.type(name, "   ");
    await user.click(screen.getByRole("button", { name: /prepare my email/i }));

    await waitFor(() =>
      expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument(),
    );
  });

  it("rejects a bad telephone", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    await user.type(screen.getByLabelText(/full name/i), "Alpha Beta");
    await user.type(screen.getByLabelText(/^email/i), "alpha@example.com");
    const tel = screen.getByLabelText(/telephone/i);
    await user.type(tel, "abc");
    await user.type(
      screen.getByLabelText(/running or walking experience/i),
      "I walk.",
    );
    await user.click(screen.getByLabelText(/yes, this would be my first hash/i));
    await user.click(screen.getByRole("button", { name: /prepare my email/i }));

    await waitFor(() =>
      expect(screen.getByText(/valid telephone number/i)).toBeInTheDocument(),
    );
  });

  it("rejects a first Hash with no experience and accepts 'No'", async () => {
    const user = setupUser();
    renderWithRouter(<JoinForm />);

    await user.type(screen.getByLabelText(/full name/i), "Alpha Beta");
    await user.type(screen.getByLabelText(/^email/i), "alpha@example.com");
    await user.type(screen.getByLabelText(/telephone/i), "+232 76 000 0000");
    await user.click(screen.getByLabelText(/no, i have run with a hash before/i));
    await user.click(screen.getByRole("button", { name: /prepare my email/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/tell us how you take part/i),
      ).toBeInTheDocument(),
    );

    /* Existing Hashers are explicitly allowed to answer No, so the schema must
       not smuggle in a "must attend three runs" requirement. */
    expect(
      screen.getByRole("radio", { name: /no, i have run with a hash before/i }),
    ).toHaveAttribute("data-state", "checked");
  });
});
