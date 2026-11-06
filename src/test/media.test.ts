import { describe, expect, it } from "vitest";

import { isMediaFile, isVideoFile, isVideoUrl } from "@/lib/media";

describe("media helpers", () => {
  it("recognises Cloudinary and local video URLs", () => {
    expect(
      isVideoUrl(
        "https://res.cloudinary.com/demo/video/upload/q_auto/v1/wwh3/clip.mp4",
      ),
    ).toBe(true);
    expect(isVideoUrl("/gallery_photos/run/clip.webm")).toBe(true);
    expect(isVideoUrl("/gallery_photos/run/clip.MOV?x=1")).toBe(true);
  });

  it("keeps images and empty values out of the video path", () => {
    expect(isVideoUrl("/gallery_photos/run/photo.jpg")).toBe(false);
    expect(isVideoUrl("https://res.cloudinary.com/demo/image/upload/a.jpg")).toBe(
      false,
    );
    expect(isVideoUrl("")).toBe(false);
  });

  it("classifies selected files by MIME type or extension", () => {
    const photo = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    const video = new File(["x"], "clip.mp4", { type: "video/mp4" });
    const extensionOnly = new File(["x"], "clip.webm", { type: "" });

    expect(isVideoFile(photo)).toBe(false);
    expect(isVideoFile(video)).toBe(true);
    expect(isVideoFile(extensionOnly)).toBe(true);
    expect(isMediaFile(photo)).toBe(true);
    expect(isMediaFile(video)).toBe(true);
  });
});
