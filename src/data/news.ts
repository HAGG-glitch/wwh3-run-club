/**
 * Club news.
 *
 * Prepared for a future Supabase `news` table.
 *
 * There are currently **no real news stories**. Nothing is fabricated: the
 * source array is empty and the News page renders an honest empty state until
 * genuine articles are supplied. See CONTENT_NEEDED.md.
 */

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  /** Human-readable publication date, e.g. "14 March 2026". Null until known. */
  publicationDate: string | null;
  /** One or two sentences shown in listings and on overview cards. */
  summary: string;
  /** Body paragraphs. Empty when the record is a summary-only placeholder. */
  body: readonly string[];
  /** Path to a cover image in `public/`. Null until supplied. */
  coverImage: string | null;
  /**
   * Named author or contributor. Null when no author has been confirmed —
   * a name is never invented to fill this field.
   */
  author: string | null;
  published: boolean;
  isDemo: boolean;
};

/** Source records. Empty until genuine articles are supplied. */
export const allNews: readonly NewsArticle[] = [];

/** Articles safe to show on the public site. */
export const publishedNews: readonly NewsArticle[] = allNews.filter(
  (article) => article.published,
);

/** Whether any article is currently published. Drives the empty state. */
export const hasPublishedNews = publishedNews.length > 0;

/** Public-facing copy for the empty state. */
export const newsEmptyState = {
  heading: "No news has been published yet.",
  body: "WWH3 stories and announcements will appear here once they are written and approved.",
} as const;

/** Sorts articles newest-first by their stated date. */
export function sortNewsByDate(
  articles: readonly NewsArticle[],
): readonly NewsArticle[] {
  return [...articles].sort((a, b) =>
    (a.publicationDate ?? "").localeCompare(b.publicationDate ?? ""),
  );
}
