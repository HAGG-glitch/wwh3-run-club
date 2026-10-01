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

/** Logo plus the full club name. Used in the header, Sheet and footer. */
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
            "text-[0.7rem] leading-[1.1] font-black tracking-[0.05em] uppercase",
            isDarkSurface ? "text-warm-white" : "text-ink",
          )}
        >
          {siteConfig.identity.abbreviation}
          <br />
          Hash House Harriers
        </span>
      )}
    </span>
  );
}
