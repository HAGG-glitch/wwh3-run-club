import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

/**
 * jsdom does not implement these, and Radix primitives rely on them.
 */

/* Waiting queries (`findBy*`, `waitFor`) default to a 1000ms budget, which is
   starved when a dozen page-level suites render in parallel. The assertions
   themselves are unchanged; only the patience before giving up is raised. */
configure({ asyncUtilTimeout: 5000 });

beforeEach(() => {
  /* Motion's `whileInView` and the ScrollProgress bar both observe elements.
     jsdom has no IntersectionObserver at all, so every test that rendered a
     page would otherwise crash on import. Report everything as visible so
     viewport-dependent content renders rather than staying hidden. */
  if (!("IntersectionObserver" in window)) {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [0];

      constructor(private readonly callback: IntersectionObserverCallback) {
        void this.callback;
      }

      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
  }

  /* Radix Dialog/Sheet and the Carousel measure their content. */
  if (!("ResizeObserver" in window)) {
    class MockResizeObserver implements ResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {
        void this.callback;
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      configurable: true,
      value: MockResizeObserver,
    });
  }

  /* Radix checks scroll locking and measures the page. */
  if (!window.scrollTo) {
    Object.defineProperty(window, "scrollTo", { writable: true, value: () => {} });
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }

  /* `matchMedia` is consulted by useReducedMotion and the reduced-motion CSS. */
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

afterEach(() => {
  cleanup();
});
