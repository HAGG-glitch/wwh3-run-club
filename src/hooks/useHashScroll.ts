import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to `#<hash>` after a navigation, once the destination page has
 * actually rendered.
 *
 * Why this exists: navigating to `/#about` from `/gallery` swaps the entire
 * route tree, so the target element does not exist at the moment the location
 * updates. Polling on `requestAnimationFrame` until the element appears avoids
 * a fixed timeout guess.
 *
 * Scroll-to-top on hash-less navigation is handled separately in `App.tsx`;
 * this hook deliberately ignores those cases so the two never fight.
 */

/** How long to wait for the destination page before giving up. */
const LOOKUP_TIMEOUT_MS = 1500;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useHashScroll(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // No hash -> the route-level scroll-to-top owns this navigation.
    if (!hash || hash === "#") return;

    const id = hash.replace(/^#/, "");
    if (!id) return;

    const startedAt = performance.now();
    let frame = 0;

    const findAndScroll = () => {
      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        // Move keyboard focus to the section for screen-reader users, without
        // scrolling a second time.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        return;
      }

      if (performance.now() - startedAt < LOOKUP_TIMEOUT_MS) {
        frame = requestAnimationFrame(findAndScroll);
      }
    };

    findAndScroll();

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}
