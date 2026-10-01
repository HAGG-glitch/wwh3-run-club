import { useEffect } from "react";

/** Creates the tag if it is absent, then sets its content. */
function setMetaContent(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
): void {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  // Create rather than no-op: a missing tag means the page would ship with no
  // description at all, which is worse than an imperfect one.
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Sets the document title and meta description for a page.
 *
 * The site is a static SPA with no router-level head management, so each page
 * calls this once with its own strings. That keeps every route independently
 * indexable without pulling in a head library, and means a page's SEO copy
 * lives next to the page it describes.
 *
 * Open Graph tags are updated to match, so shared links preview correctly.
 */
export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = `${title} | West West Hashers`;

    setMetaContent('meta[name="description"]', "name", "description", description);
    setMetaContent('meta[property="og:title"]', "property", "og:title", title);
    setMetaContent(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
  }, [title, description]);
}
