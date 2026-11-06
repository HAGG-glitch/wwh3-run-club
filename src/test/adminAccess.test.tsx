import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/adminApi", () => ({
  MAX_UPLOAD_BATCH: 15,
  getSession: vi.fn().mockResolvedValue(false),
  login: vi.fn(),
  logout: vi.fn(),
  fetchContent: vi.fn().mockResolvedValue(null),
  saveContent: vi.fn(),
  uploadImage: vi.fn(),
  uploadMedia: vi.fn(),
}));

import { AdminPage } from "@/pages/AdminPage";

describe("admin access", () => {
  it("asks for the password when there is no session", async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /admin sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
