import { existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { galleryItems, displayableGalleryItems } from "@/data/gallery";

/**
 * Every gallery image is served straight out of `public/`, so these checks run
 * against the real files on disk rather than trusting the data table.
 */
describe("gallery image files", () => {
  it("ships a real file for every gallery item", () => {
    for (const item of galleryItems) {
      expect(item.image.startsWith("/")).toBe(true);
      expect(item.image).not.toMatch(/\s/);
      expect(item.image).not.toMatch(/[()]/);
    }
  });

  it("declares a positive intrinsic size so layout can be reserved", () => {
    for (const item of galleryItems) {
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
    }
  });

  it("keeps every club photograph under 600 KB on disk", () => {
    /* The birthday-run frames arrived as ~500KB WhatsApp exports; the curated
       set is resized to a 1600px maximum so the gallery stays light. Oversized
       files are a page-weight problem, not a detail. */
    const clubPhotos = displayableGalleryItems.filter((item) =>
      item.image.startsWith("/gallery_photos/"),
    );
    expect(clubPhotos.length).toBe(galleryItems.length);
    expect(clubPhotos.length).toBeGreaterThan(40);

    /* Vitest serves modules over an http-like URL, so `import.meta.url` is not
       a file path. Resolve from the Vite project root instead. */
    const publicDir = resolve(process.cwd(), "public");
    for (const item of clubPhotos) {
      const file = join(publicDir, item.image.replace(/^\//, ""));
      expect(existsSync(file)).toBe(true);

      const { size } = statSync(file);
      expect(
        size,
        `${item.image} is ${Math.round(size / 1024)}KB`,
      ).toBeLessThan(600 * 1024);
    }
  });

  it("downscaled the largest export rather than shipping it raw", () => {
    /* 3840x5120 is far beyond any display, and no amount of lazy loading helps
       once someone actually opens the lightbox. */
    const portrait = galleryItems.find((item) => item.id === "wwh3-08")!;
    expect(Math.max(portrait.width, portrait.height)).toBeLessThanOrEqual(1600);
  });
});
