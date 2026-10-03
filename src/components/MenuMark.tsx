import { cn } from "@/lib/utils";

/**
 * The mobile menu mark.
 *
 * Lucide's `Menu` was three identical grey bars, which read as a stock control
 * rather than part of this club's identity. This is the same silhouette rebuilt
 * on the site's own black/white/gold palette: ink bars with the middle one in
 * gold, echoing the rule and the trail marks used elsewhere in the header.
 *
 * Deliberately *not* animated into an X. The Sheet is modal, so its overlay
 * covers the header the moment it opens — the closed state is the only one ever
 * visible, and an open-state animation would never be seen.
 *
 * `aria-hidden` because the trigger button carries the real label; the glyph
 * must not be announced.
 */
export function MenuMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex flex-col items-start gap-[3px] transition-colors group-hover:text-gold-deep",
        className,
      )}
    >
      <span className="h-0.5 w-5 bg-current" />
      <span className="h-0.5 w-5 bg-gold-deep" />
      <span className="h-0.5 w-5 bg-current" />
    </span>
  );
}