import { Info } from "lucide-react";

import { siteConfig } from "@/data/siteConfig";

/**
 * Persistent disclosure that demonstration material is still on the site.
 *
 * Rendered above the header on every page so no visitor can mistake a sample
 * run record or placeholder photograph for a confirmed club record.
 */
export function ConceptNotice() {
  return (
    <div
      role="note"
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-[#e4c365] bg-[#fff3d2] px-4 py-2.5 text-center text-[0.78rem] leading-snug text-[#694a09] sm:px-[4vw]"
    >
      <Info aria-hidden="true" className="size-4 shrink-0" />
      <strong className="font-black tracking-[0.08em] uppercase">Concept preview</strong>
      <span>
        Some run records and photographs are placeholders until approved{" "}
        {siteConfig.identity.abbreviation} material is supplied.
      </span>
    </div>
  );
}
