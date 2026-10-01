import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

/**
 * Renders a component tree inside a MemoryRouter.
 *
 * `initialEntries` lets a test start at an arbitrary route — including unknown
 * paths and `/#hash` targets — and `getPath()` then reports the *resolved*
 * location, which is how redirect behaviour is asserted.
 */
export function renderWithRouter(
  ui: ReactElement,
  {
    initialEntries = ["/"],
    ...options
  }: { initialEntries?: string[] } & Omit<RenderOptions, "wrapper"> = {},
) {
  let resolved = initialEntries[0] ?? "/";

  const LocationProbe = () => {
    const location = useLocation();
    resolved = `${location.pathname}${location.hash}`;
    return null;
  };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
      <LocationProbe />
    </MemoryRouter>
  );

  const utils = render(ui, { wrapper: Wrapper, ...options });

  return {
    ...utils,
    /** Current resolved path (including hash) of the router under test. */
    getPath: () => resolved,
  };
}
