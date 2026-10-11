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

/** Optional per-photograph facts; omitted fields render as `null`. */
type PhotoMeta = {
  hashNumber?: string;
  date?: string;
  location?: string;
};

/**
 * A real club photograph served from `public/gallery_photos`.
 *
 * The club has confirmed the subjects consented to their use on the website,
 * so these are `consentConfirmed: true` and are never labelled as placeholders.
 *
 * Alt text and captions are deliberately neutral. The images were supplied with
 * no description, and inventing a scene ("the Pack sprinting down a hill")
 * would misinform anyone using a screen reader. Replace `alt` with a specific
 * description and set `descriptionConfirmed: true` once a real one exists;
 * `galleryPhotosNeedingDescriptions` tracks the remainder.
 */
const clubPhoto = (
  id: string,
  image: string,
  alt: string,
  caption: string,
  category: GalleryCategory,
  width: number,
  height: number,
  meta: PhotoMeta = {},
): GalleryItem => ({
  id,
  image,
  alt,
  caption,
  width,
  height,
  hashNumber: meta.hashNumber ?? null,
  date: meta.date ?? null,
  location: meta.location ?? null,
  category,
  consentConfirmed: true,
  published: true,
  isDemo: false,
  descriptionConfirmed: false,
});

/* -------------------------------------------------------------------------- */
/* Run Away Boy's Birthday Hash — 7 October 2026                              */
/* -------------------------------------------------------------------------- */

/**
 * The club's first recorded run. The 42 frames below are a curated spread of
 * the event, resized to a maximum of 1600px so the gallery stays light.
 *
 * `[id-suffix, width, height]` matched to `public/gallery_photos/
 * run-away-boy-birthday/wwh3-bday-<suffix>.jpg`.
 */const birthdayShots: ReadonlyArray<readonly [string, number, number]> = [
  ["01", 1600, 1072],
  ["02", 1600, 1072],
  ["03", 1600, 1208],
  ["04", 1600, 1286],
  ["05", 1468, 1600],
  ["06", 1540, 1600],
  ["07", 1600, 1327],
  ["08", 1600, 1427],
  ["09", 1600, 1454],
  ["10", 1600, 1459],
  ["11", 1379, 1600],
  ["12", 1600, 1000],
  ["13", 1600, 1489],
  ["14", 1600, 1066],
  ["15", 1363, 1600],
  ["16", 1600, 1454],
  ["17", 1600, 1348],
  ["18", 1600, 1348],
  ["19", 1066, 1600],
  ["20", 1600, 1066],
  ["21", 1600, 1254],
  ["22", 1505, 1600],
  ["23", 1600, 1000],
  ["24", 1505, 1600],
  ["25", 1600, 1066],
  ["26", 1600, 1066],
  ["27", 1600, 1066],
  ["28", 1600, 1066],
  ["29", 1134, 1600],
  ["30", 1600, 1066],
  ["31", 1600, 1204],
  ["32", 1600, 1066],
  ["33", 1600, 1066],
  ["34", 1600, 1066],
  ["35", 1147, 1600],
  ["36", 1066, 1600],
  ["37", 1277, 1600],
  ["38", 1600, 1066],
  ["39", 1600, 1173],
  ["40", 1600, 1066],
  ["41", 1600, 1000],
  ["42", 1600, 1066],
];

const BIRTHDAY_HASH = "01";
const BIRTHDAY_DATE = "2 October 2026";
const BIRTHDAY_CAPTION = "Run Away Boy's Birthday Hash";

const birthdayPhotos: readonly GalleryItem[] = birthdayShots.map(
  ([suffix, width, height]) =>
    clubPhoto(
      `bday-${suffix}`,
      `/gallery_photos/run-away-boy-birthday/wwh3-bday-${suffix}.jpg`,
      `${BIRTHDAY_CAPTION} — WWH3 photograph.`,
      BIRTHDAY_CAPTION,
      "Brotherhood",
      width,
      height,
      { hashNumber: BIRTHDAY_HASH, date: BIRTHDAY_DATE },
    ),
);

/**
 * Every frame from the birthday run, in order. The run story reads this so the
 * photographs shown under a run cannot drift from the ones in the gallery.
 */
export const birthdayRunImages: readonly string[] = birthdayPhotos.map(
  (photo) => photo.image,
);

export const galleryItems: readonly GalleryItem[] = [
  // Early club photographs.
  clubPhoto(
    "wwh3-01",
    "/gallery_photos/wwh3-01.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Brotherhood",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-02",
    "/gallery_photos/wwh3-02.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Brotherhood",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-03",
    "/gallery_photos/wwh3-03.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Brotherhood",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-04",
    "/gallery_photos/wwh3-04.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Trail",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-05",
    "/gallery_photos/wwh3-05.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Trail",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-06",
    "/gallery_photos/wwh3-06.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Trail",
    1448,
    1086,
  ),
  clubPhoto(
    "wwh3-07",
    "/gallery_photos/wwh3-07.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Trail",
    1600,
    1200,
  ),
  clubPhoto(
    "wwh3-08",
    "/gallery_photos/wwh3-08.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Adventure",
    1200,
    1600,
  ),
  clubPhoto(
    "wwh3-09",
    "/gallery_photos/wwh3-09.jpeg",
    "WWH3 photograph.",
    "WWH3 photograph",
    "Circle",
    1152,
    864,
  ),

  // The first recorded run.
  ...birthdayPhotos,
];

/** Photographs safe to show. Every item is consent-confirmed and published. */
export const publishedGalleryItems: readonly GalleryItem[] = galleryItems.filter(
  (item) => item.published && item.consentConfirmed,
);

/** Items the site may display at all. */
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
