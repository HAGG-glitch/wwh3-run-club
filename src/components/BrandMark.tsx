import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/siteConfig";

/**
 * Temporary official logo.
 *
 * `public/wwh3-logo.png` was supplied by the club (772 × 516, opaque black
 * background). Because the background is opaque rather than transparent, the
 * mark is always presented on a dark rounded plate. That keeps the black edges
 * looking deliberate on the light header as well as in the dark footer, and
 * means swapping in a transparent-vector version later is a drop-in change.
 *
 * See CONTENT_NEEDED.md — replace with the approved vector asset when supplied.
 */
const LOGO_SRC = "/wwh3-logo.png";

type BrandMarkProps = {
  size?: "sm" | "md";
  className?: string;
};

/**
 * The club logo.
 *
 * The image is decorative: the accessible name always comes from the
 * surrounding text, so the logo never has to be re-cut if it turns out to
 * already contain the club name.
 */
export function BrandMark({ size = "md", className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-ink",
        size === "sm" ? "h-9 px-2" : "h-11 px-2.5",
        className,
      )}
    >
      <img
        src={LOGO_SRC}
        /* Decorative — the club name is always present as real text. */
        alt=""
        width={772}
        height={516}
        loading="eager"
        decoding="async"
        className={cn(
          "h-full w-auto object-contain",
          size === "sm" ? "max-w-24" : "max-w-32",
        )}
      />
    </span>
  );
}

type BrandLockupProps = {
  tone?: "light" | "dark";
  /** Hides the club name, leaving the logo only. */
  markOnly?: boolean;
  className?: string;
};

/**
 * Logo plus the club name. Used in the header, Sheet and footer.
 *
 * The club asked for the name spelled out in full next to the logo rather than
 * the WWH3 abbreviation, so the lockup reads "West West / Hash House Harriers".
 * It is split across two lines by the `<br />` for legibility and to keep the
 * header from growing — the full name on a single line is wide enough to crowd
 * the nav on a 1024px screen.
 *
 * The two lines sit inside sibling spans with an explicit space between them.
 * A bare `<br />` would render correctly but leave no space in `textContent`,
 * so anything reading the element as a string — an accessible name, a test, a
 * search index — would see "West WestHash House Harriers" run together.
 */
export function BrandLockup({
  tone = "dark",
  markOnly,
  className,
}: BrandLockupProps) {
  const isDarkSurface = tone === "light";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark size={markOnly ? "sm" : "md"} />
      {!markOnly && (
        <span
          className={cn(
            /* Slightly smaller below `sm`. Spelled out in full, the name plus
               the logo and a 44px menu button would not fit a 360px viewport at
               the desktop size. `sm` is where the desktop breakpoint lands, so
               this never changes the desktop or tablet appearance. */
            "text-[0.62rem] leading-[1.1] font-black tracking-[0.04em] uppercase sm:text-[0.7rem] sm:tracking-[0.05em]",
            isDarkSurface ? "text-warm-white" : "text-ink",
          )}
        >
          <span>{siteConfig.identity.nameParts.first}</span>{" "}
          <span>
            <br />
            {siteConfig.identity.nameParts.rest}
          </span>
        </span>
      )}
    </span>
  );
}
