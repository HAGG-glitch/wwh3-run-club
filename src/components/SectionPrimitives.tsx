import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  children: ReactNode;
  /** Gold-toned label, for use on dark surfaces. */
  tone?: "default" | "gold";
  className?: string;
};

/** Small numbered kicker that opens most homepage sections. */
export function SectionLabel({ index, children, tone, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "mb-10 flex items-center gap-3 text-[0.7rem] font-black tracking-[0.14em] uppercase sm:mb-12",
        tone === "gold" ? "text-gold-bright" : "text-ink",
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-full border border-current text-[0.65rem]">
        {index}
      </span>
      {children}
    </div>
  );
}

type SectionHeadingProps = {
  children: ReactNode;
  /** The gold second line, e.g. `A fellowship.` */
  accent?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
};

/**
 * Oversized editorial heading.
 *
 * `clamp()` sizing plus a fluid `vw` unit means the type tracks the viewport
 * without ever exceeding its container, so no breakpoint can clip a word.
 */
export function SectionHeading({
  children,
  accent,
  tone = "dark",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "editorial-display m-0 text-[clamp(2.6rem,6.4vw,6.6rem)]",
        tone === "light" ? "text-warm-white" : "text-ink",
        className,
      )}
    >
      {children}
      {accent ? (
        <>
          <br />
          <span className={tone === "light" ? "text-gold-bright" : "text-gold-deep"}>
            {accent}
          </span>
        </>
      ) : null}
    </Tag>
  );
}

type EyebrowProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/** Rule + uppercase kicker used on dark bands. */
export function Eyebrow({ children, tone = "dark", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-6 flex items-center gap-2.5 text-[0.72rem] font-black tracking-[0.15em] uppercase",
        tone === "light" ? "text-warm-white/80" : "text-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("inline-block h-0.5 w-9", tone === "light" ? "bg-gold" : "bg-gold")}
      />
      {children}
    </p>
  );
}

/** Uppercase underlined text link with an arrow that nudges on hover. */
export function TextLink({
  href,
  to,
  children,
  tone = "dark",
  className,
}: {
  href?: string;
  to?: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const shared = cn(
    "inline-flex items-center gap-2 rounded-sm pb-1.5 text-[0.75rem] font-black tracking-[0.08em] uppercase transition-colors",
    tone === "light"
      ? "border-b border-warm-white/55 text-warm-white hover:text-gold-bright"
      : "border-b border-ink text-ink hover:text-gold-deep",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={shared}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={shared}>
      {children}
    </a>
  );
}
