import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import App from "@/App";
import { completedRuns, upcomingRuns } from "@/data/runs";
import { nextHashPending } from "@/data/siteConfig";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("routing", () => {
  it("redirects an unknown path to the homepage and cleans the URL", async () => {
    const { getPath } = renderWithRouter(<App />, {
      initialEntries: ["/this-route-does-not-exist"],
    });

    await waitFor(() => expect(getPath()).toBe("/"));
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("sends a missing run slug back to the runs listing", async () => {
    const { getPath } = renderWithRouter(<App />, {
      initialEntries: ["/runs/a-run-that-does-not-exist"],
    });

    await waitFor(() => expect(getPath()).toBe("/runs"));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /every trail/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders a real run story for a published run", async () => {
    const run = completedRuns[0];
    expect(run).toBeDefined();

    renderWithRouter(<App />, { initialEntries: [`/runs/${run!.slug}`] });

    expect(
      await screen.findByRole("heading", { level: 1, name: run!.title }),
    ).toBeInTheDocument();
  });

  it("keeps a single h1 per page", async () => {
    renderWithRouter(<App />, { initialEntries: ["/"] });

    await screen.findByRole("heading", { level: 1 });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});

describe("schedule honesty", () => {
  it("has no fabricated upcoming runs in the data", () => {
    expect(upcomingRuns).toHaveLength(0);
  });

  it("shows the pending notice rather than an invented date", async () => {
    renderWithRouter(<App />, { initialEntries: ["/runs"] });

    expect(
      await screen.findByText(nextHashPending.heading),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Contact WWH3 for the latest meeting point/),
    ).toBeInTheDocument();
  });

  it("never renders a year that is later than the current one as an upcoming date", async () => {
    renderWithRouter(<App />, { initialEntries: ["/runs"] });

    await screen.findByText(nextHashPending.heading);
    expect(screen.queryByText(/next hash on/i)).not.toBeInTheDocument();
  });
});
