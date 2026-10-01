export type GalleryCategory =
  | "Trail"
  | "Circle"
  | "Adventure"
  | "Brotherhood"
  | "Freetown";

export type GalleryItem = {
  id: string;
  image: string;
  alt: string;
  caption: string;
  /**
   * Intrinsic pixel size of the file. Declaring this on the `<img>` lets the
   * browser reserve the right box before the JPEG downloads, which stops the
   * gallery grid from jumping as images arrive.
   */
  width: number;
  height: number;
  hashNumber: string | null;
  date: string | null;
  location: string | null;
  category: GalleryCategory;
  /**
   * Publication gate. A real member photograph must not appear on the site
   * until consent is confirmed, so `published` is derived from this.
   */
  consentConfirmed: boolean;
  published: boolean;
  isDemo: boolean;
  /**
   * Set once a real, human-written description is supplied for the image.
   * Until then the item renders neutral alt text rather than an invented
   * description, and this flags it in `CONTENT_NEEDED.md`.
   */
  descriptionConfirmed: boolean;
};

/**
 * Bundled WebP files are generic placeholders, not club photographs. Every
 * placeholder is `consentConfirmed: false` and `isDemo: true`, which forces the
 * "Placeholder photograph" badge to render.
 */
const placeholder = (
  id: string,
  image: string,
  alt: string,
  caption: string,
  category: GalleryCategory,
  width: number,
  height: number,
): GalleryItem => ({
  id,
  image,
  alt,
  caption,
  width,
  height,
  hashNumber: null,
  date: null,
  location: null,
  category,
  consentConfirmed: false,
  published: true,
  isDemo: true,
  descriptionConfirmed: false,
});

/**
 * A real club photograph from `public/gallery_photos`.
 *
 * The club has confirmed the subjects of these images consented to their use on
 * the website, so they are `consentConfirmed: true` and are NOT labelled as
 * placeholders.
 *
 * Alt text and captions are deliberately neutral. The images were supplied as
 * WhatsApp exports with no description, and inventing a scene ("the Pack
 * sprinting down a hill") would misinform anyone using a screen reader. Replace
 * `alt` with a specific description and set `descriptionConfirmed: true` once a
 * real one exists; `galleryPhotosNeedingDescriptions` tracks the remainder.
 */
const clubPhoto = (
  id: string,
  image: string,
  alt: string,
  caption: string,
  category: GalleryCategory,
  width: number,
  height: number,
): GalleryItem => ({
  id,
  image,
  alt,
  caption,
  width,
  height,
  hashNumber: null,
  date: null,
  location: null,
  category,
  consentConfirmed: true,
  published: true,
  isDemo: false,
  descriptionConfirmed: false,
});

export const galleryItems: readonly GalleryItem[] = [
  // Real, consented club photographs.
  clubPhoto(
    "wwh3-01",
    "/gallery_photos/wwh3-01.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Brotherhood",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-02",
    "/gallery_photos/wwh3-02.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Brotherhood",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-03",
    "/gallery_photos/wwh3-03.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Brotherhood",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-04",
    "/gallery_photos/wwh3-04.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Trail",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-05",
    "/gallery_photos/wwh3-05.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Trail",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-06",
    "/gallery_photos/wwh3-06.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Trail",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-07",
    "/gallery_photos/wwh3-07.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Trail",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-08",
    "/gallery_photos/wwh3-08.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Adventure",
    1200,
    1600,
  ),
  clubPhoto(
    "wwh3-09",
    "/gallery_photos/wwh3-09.jpeg",
    "WWH3 club photograph.",
    "WWH3 club photograph",
    "Circle",
    1152,
    864,
  ),

  // Layout placeholders. There are now nine real club photographs above, so
  // these exist only to keep the Carousel/mosaic split and the "Freetown"
  // category represented until a second batch of real images arrives. Delete
  // them as soon as it does — every one is a picture of nothing.
  placeholder(
    "gallery-shoreline-regroup",
    "/hash-beach.webp",
    "Placeholder photograph of runners regrouping on a beach",
    "The shoreline regroup",
    "Trail",
    1672,
    941,
  ),
  placeholder(
    "gallery-circle",
    "/hash-circle.webp",
    "Placeholder photograph of an outdoor Hash Circle",
    "Together in the Circle",
    "Circle",
    1536,
    1024,
  ),
  placeholder(
    "gallery-following-marks",
    "/hash-hills.webp",
    "Placeholder photograph of a hillside trail",
    "Following the marks",
    "Adventure",
    1536,
    1024,
  ),
  placeholder(
    "gallery-atlantic",
    "/hash-beach.webp",
    "Placeholder photograph of a coastal run",
    "Friday by the Atlantic",
    "Freetown",
    1672,
    941,
  ),
];

/** Photographs safe to show, and the ones that still need consent. */
export const publishedGalleryItems: readonly GalleryItem[] = galleryItems.filter(
  (item) => item.published && item.consentConfirmed,
);

/** Items the site may display at all (placeholders included, clearly labelled). */
export const displayableGalleryItems: readonly GalleryItem[] = galleryItems.filter(
  (item) => item.published,
);

/** The Carousel only runs featured images. */
export const featuredGalleryItems: readonly GalleryItem[] = displayableGalleryItems.slice(
  0,
  5,
);

/** Masonry grid, skipping anything already promoted into the Carousel. */
export const mosaicGalleryItems: readonly GalleryItem[] =
  displayableGalleryItems.slice(featuredGalleryItems.length);

export const galleryCategories: readonly GalleryCategory[] = [
  "Trail",
  "Circle",
  "Adventure",
  "Brotherhood",
  "Freetown",
];

/**
 * True when at least one real, consent-confirmed club photograph exists.
 * Drives the "placeholder gallery" notice.
 */
export const hasApprovedPhotography = galleryItems.some(
  (item) => item.consentConfirmed && !item.isDemo,
);

/**
 * Real photographs still lacking a human-written description. Each needs a
 * specific `alt` (what is actually happening in the frame) before launch — the
 * current value is intentionally generic rather than invented.
 */
export const galleryPhotosNeedingDescriptions: readonly GalleryItem[] =
  galleryItems.filter((item) => !item.isDemo && !item.descriptionConfirmed);
