import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { JoinForm } from "@/components/JoinForm";
import { siteConfig } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

const toastInfo = vi.fn();

vi.mock("sonner", () => ({
  toast: { info: (...args: unknown[]) => toastInfo(...args) },
}));

/* `delay: null` types without yielding to the event loop between keystrokes.
   The default 0ms delay enqueues a timer per character, which made these
   form-filling tests intermittently exceed their query timeouts when the whole
   suite ran in parallel. */
function setupUser() {
  return userEvent.setup({ delay: null });
}

/** Replaces window.location so the mailto hand-off can be inspected. */
function mockMailtoHandoff() {
  const assign = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { ...window.location, href: "", assign },
  });
  return assign;
}

function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  return (async () => {
    await user.type(screen.getByLabelText(/full name/i), "Alpha Beta");
    await user.type(screen.getByLabelText(/^email/i), "alpha@example.com");
    await user.type(screen.getByLabelText(/telephone/i), "+232 31 251240");
    await user.type(
      screen.getByLabelText(/running or walking experience/i),
      "I walk and run, and I love a good long trail.",
    );
    await user.click(screen.getByLabelText(/yes, this would be my first hash/i));
  })();
}

describe("join form validation", () => {
  it("does not attempt to send an empty form", async () => {
    const user = setupUser();
    const assign = mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    expect(assign).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/please enter your full name/i),
    ).toBeInTheDocument();
  });

  it("rejects a malformed email address", async () => {
    const user = setupUser();
    const assign = mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await user.type(screen.getByLabelText(/full name/i), "Alpha Beta");
    await user.type(screen.getByLabelText(/^email/i), "not-an-email");
    await user.type(screen.getByLabelText(/telephone/i), "+232 31 251240");
    await user.type(
      screen.getByLabelText(/running or walking experience/i),
      "I walk and run.",
    );
    await user.click(screen.getByLabelText(/yes, this would be my first hash/i));
    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    expect(assign).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/valid email address/i),
    ).toBeInTheDocument();
  });

  it("requires an explicit answer to the first-time question", async () => {
    const user = setupUser();
    const assign = mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await user.type(screen.getByLabelText(/full name/i), "Alpha Beta");
    await user.type(screen.getByLabelText(/^email/i), "alpha@example.com");
    await user.type(screen.getByLabelText(/telephone/i), "+232 31 251240");
    await user.type(
      screen.getByLabelText(/running or walking experience/i),
      "I walk and run.",
    );
    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    expect(assign).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/please choose yes or no/i),
    ).toBeInTheDocument();
  });

  it("accepts a returning Hasher answering 'no'", async () => {
    const user = setupUser();
    const assign = mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await user.type(screen.getByLabelText(/full name/i), "Gamma Delta");
    await user.type(screen.getByLabelText(/^email/i), "gamma@example.com");
    await user.type(screen.getByLabelText(/telephone/i), "+232 31 251240");
    await user.type(
      screen.getByLabelText(/running or walking experience/i),
      "Returning Hasher from another kennel.",
    );
    await user.click(
      screen.getByLabelText(/no, i have run with a hash before/i),
    );
    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));
    expect(decodeURIComponent(assign.mock.calls[0]![0] as string)).toContain(
      "First-time Hasher: No",
    );
  });

  it("links validation messages to their fields for screen readers", async () => {    const user = setupUser();
    mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    const field = await screen.findByLabelText(/full name/i);
    const describedBy = field.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    /* `aria-describedby` is a space-separated list of ids, and on error it
       points at both the field description and the error message. */
    const ids = describedBy!.split(" ");
    const message = ids.map((id) => document.getElementById(id)).find(Boolean);
    expect(message).toHaveTextContent(/full name/i);
    expect(field).toHaveAttribute("aria-invalid", "true");
  });
});

describe("join form hand-off", () => {
  it("opens a pre-filled mail client addressed to the club", async () => {
    const user = setupUser();
    const assign = mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));

    const mailto = assign.mock.calls[0]![0] as string;
    expect(mailto.startsWith("mailto:")).toBe(true);
    expect(mailto).toContain(siteConfig.contact.email);
    expect(mailto).toContain("subject=");

    const decoded = decodeURIComponent(mailto);
    expect(decoded).toContain("Join the Next Hash");
    expect(decoded).toContain("Alpha Beta");
    expect(decoded).toContain("alpha@example.com");
    expect(decoded).toContain("+232 31 251240");
    expect(decoded).toContain("First-time Hasher: Yes");
  });

  it("tells the visitor they must still press send, rather than claiming receipt", async () => {
    const user = setupUser();
    mockMailtoHandoff();
    renderWithRouter(<JoinForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /prepare my email/i }),
    );

    await waitFor(() => expect(toastInfo).toHaveBeenCalled());

    const [title, options] = toastInfo.mock.calls[0]! as [
      string,
      { description?: string },
    ];
    expect(title.toLowerCase()).toContain("email app");
    expect(options.description ?? "").toMatch(
      /nothing is sent automatically/i,
    );
  });

  it("states up front that nothing is sent by the website", () => {
    renderWithRouter(<JoinForm />);

    expect(
      screen.getByText(/you will need to press send/i),
    ).toBeInTheDocument();
  });
});
