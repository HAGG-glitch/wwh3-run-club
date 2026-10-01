import { Link } from "react-router-dom";

import type { SectionDescriptor } from "@/data/navigation";
import { cn } from "@/lib/utils";

type SectionSubnavProps = {
  /** Section descriptors from the central navigation config. */
  sections: readonly SectionDescriptor[];
  pathname: string;
  /** Accessible name for the landmark. */
  label: string;
  className?: string;
};

/**
 * Horizontal list of a section's child pages.
 *
 * Rendered on every child page of a dropdown section. The dropdown is
 * click-to-open, so a persistent sub-nav is what lets a visitor move between
 * sibling pages without reopening the header menu — and it keeps the current
 * page identifiable.
 *
 * Scrolls horizontally on narrow screens instead of wrapping, so the row can
 * never push the page wider than the viewport.
 */
export function SectionSubnav({
  sections,
  pathname,
  label,
  className,
}: SectionSubnavProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "border-b border-ink/12 bg-pure-white",
        className,
      )}
    >
      <ul className="flex snap-x gap-1 overflow-x-auto px-5 py-3 sm:px-[7vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const active = pathname === section.to;

          return (
            <li key={section.to} className="snap-start">
              <Link
                to={section.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-max items-center gap-2 rounded-sm border px-3.5 py-2 text-[0.72rem] font-black tracking-[0.09em] whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none",
                  active
                    ? "border-ink bg-ink text-warm-white"
                    : "border-ink/15 text-ink hover:border-gold-deep hover:text-gold-deep",
                )}
              >
                {section.label}
                {!section.hasRecords && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      active ? "bg-gold-bright" : "bg-ink/25",
                    )}
                  >
                    <span className="sr-only">No published content yet</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
