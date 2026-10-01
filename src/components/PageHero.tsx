import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { Eyebrow } from "@/components/SectionPrimitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  /** Uppercase kicker above the title. */
  eyebrow: string;
  /** Main heading line. */
  title: string;
  /** Optional gold second line. */
  accent?: string;
  /** Supporting paragraph. */
  description?: string;
  /** Optional controls rendered under the description. */
  actions?: ReactNode;
  /** Breadcrumb-style links rendered above the eyebrow. */
  parent?: { label: string; to: string };
  /** Decorative watermark shown at the right edge. */
  watermark?: ReactNode;
  className?: string;
};

/**
 * Shared dark hero for every interior page.
 *
 * Previously each page inlined its own hero, which meant ten new pages would
 * have meant ten more copies to keep in sync. One component guarantees identical
 * padding, type scale and vertical rhythm across the whole site.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  actions,
  parent,
  watermark,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "on-dark relative flex min-h-[26rem] items-center overflow-hidden bg-ink px-5 py-16 text-warm-white sm:px-[7vw]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(110deg,transparent_45%,var(--color-gold)_45%_47%,transparent_47%),repeating-linear-gradient(0deg,transparent_0_34px,rgba(255,255,255,0.08)_34px_35px)]"
      />
      <div className="relative z-2 max-w-3xl">
        {parent && (
          <Link
            to={parent.to}
            className="mb-6 inline-flex items-center gap-2 text-[0.7rem] font-black tracking-[0.12em] text-warm-white/60 uppercase transition-colors hover:text-gold-bright focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
          >
            ← {parent.label}
          </Link>
        )}
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
        <h1 className="editorial-display m-0 text-[clamp(2.6rem,7.2vw,7rem)]">
          {title}
          {accent ? (
            <>
              <br />
              <em className="text-gold-bright not-italic">{accent}</em>
            </>
          ) : null}
        </h1>
        {description && (
          <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-warm-white/70">
            {description}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
      </div>
      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[7vw] bottom-16 hidden text-right text-[clamp(3.5rem,9vw,9rem)] leading-[0.72] text-warm-white/12 select-none [font-family:var(--font-display)] lg:block"
        >
          {watermark}
        </span>
      )}
    </section>
  );
}

type EmptyStateProps = {
  /** Optional Lucide icon shown above the heading. */
  icon?: LucideIcon;
  heading: string;
  body?: string;
  /** Optional supporting note, e.g. what will appear here in future. */
  note?: ReactNode;
  /** Optional primary link. */
  action?: { label: string; to: string };
  className?: string;
};

/**
 * Polished empty state for sections with no approved content yet.
 *
 * Every data-driven section in this site is empty by design, so this component
 * carries the site's honesty: it always states what is missing rather than
 * substituting placeholder records.
 */
export function EmptyState({
  icon: Icon,
  heading,
  body,
  note,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-ink/15 bg-pure-white px-6 py-14 text-center sm:px-10",
        className,
      )}
    >
      {Icon && (
        <Icon aria-hidden="true" className="mx-auto mb-5 size-8 text-gold-deep" />
      )}
      <h2 className="m-0 text-[1.15rem] font-black tracking-[0.04em] uppercase sm:text-[1.3rem]">
        {heading}
      </h2>
      {body && (
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-gray">
          {body}
        </p>
      )}
      {note && <div className="mt-6 text-sm text-muted-gray">{note}</div>}
      {action && (
        <Button
          asChild
          className="mt-8 h-auto rounded-sm bg-ink px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
        >
          <Link to={action.to}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
