import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { uploadMediaMock } = vi.hoisted(() => ({
  uploadMediaMock: vi.fn(),
}));

vi.mock("@/lib/adminApi", () => ({
  MAX_UPLOAD_BATCH: 15,
  uploadImage: vi.fn(),
  uploadMedia: uploadMediaMock,
}));

import { MultiImageField } from "@/components/admin/ImageField";

function mediaFile(name: string, type: string): File {
  return new File(["media"], name, { type });
}

describe("multi-media upload", () => {
  beforeEach(() => {
    uploadMediaMock.mockReset();
  });

  it("accepts photos and video in one selection", async () => {
    uploadMediaMock.mockResolvedValue({
      media: [{ url: "/one.jpg" }, { url: "/two.mp4" }],
      errors: [],
    });
    const onChange = vi.fn();
    const { container } = render(
      <MultiImageField label="Run photos & videos" values={[]} onChange={onChange} />,
    );
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    expect(input.multiple).toBe(true);
    expect(input.accept).toBe("image/*,video/*");
    fireEvent.change(input, {
      target: {
        files: [
          mediaFile("one.jpg", "image/jpeg"),
          mediaFile("two.mp4", "video/mp4"),
        ],
      },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(["/one.jpg", "/two.mp4"]),
    );
  });

  it("fills only the free slots when a run is near its cap", async () => {
    uploadMediaMock.mockResolvedValue({
      media: [{ url: "/new.jpg" }],
      errors: [],
    });
    const values = Array.from({ length: 14 }, (_, index) => `/old-${index}.jpg`);
    const onChange = vi.fn();
    const { container } = render(
      <MultiImageField
        label="Run photos & videos"
        values={values}
        max={15}
        onChange={onChange}
      />,
    );
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [
          mediaFile("new.jpg", "image/jpeg"),
          mediaFile("extra-1.jpg", "image/jpeg"),
          mediaFile("extra-2.jpg", "image/jpeg"),
        ],
      },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith([...values, "/new.jpg"]),
    );
    expect(uploadMediaMock.mock.calls[0][0]).toHaveLength(1);
  });

  it("disables upload once the cap is reached", () => {
    const values = Array.from({ length: 15 }, (_, index) => `/old-${index}.jpg`);
    render(
      <MultiImageField
        label="Run photos & videos"
        values={values}
        max={15}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /media limit reached/i }),
    ).toBeDisabled();
    expect(screen.getByText("15/15")).toBeInTheDocument();
  });
});
