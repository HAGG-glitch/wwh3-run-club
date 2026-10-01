import { useLocation } from "react-router-dom";
import { CircleCheck, MapPin, MapPinned, TriangleAlert } from "lucide-react";

import { ConceptNotice } from "@/components/ConceptNotice";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { membershipSections } from "@/data/navigation";
import {
  confirmedCoverage,
  coverageBase,
  futureCoverage,
  type CoverageArea,
} from "@/data/membership";
import { siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";

/** One coverage entry, marked as confirmed or not yet confirmed. */
function CoverageItem({ area }: { area: CoverageArea }) {
  const Icon = area.confirmed ? CircleCheck : TriangleAlert;

  return (
    <li className="flex gap-4 border border-ink/15 bg-pure-white p-6">
      <Icon
        aria-hidden="true"
        className={
          area.confirmed
            ? "mt-0.5 size-5 shrink-0 text-gold-deep"
            : "mt-0.5 size-5 shrink-0 text-muted-gray"
        }
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-[0.98rem] tracking-[0.03em] uppercase">
            {area.name}
          </strong>
          <span className="border border-ink/20 px-2 py-0.5 text-[0.55rem] font-black tracking-[0.1em] text-muted-gray uppercase">
            {area.confirmed ? "Confirmed" : "Not confirmed"}
          </span>
        </div>
        <span className="mt-2 block leading-relaxed text-muted-gray">
          {area.note}
        </span>
      </div>
    </li>
  );
}

/**
 * Coverage.
 *
 * Lists only locations the club has actually confirmed: Western Area, Freetown
 * and Sierra Leone, derived from the central site config. Future areas of
 * activity are held in a separate, currently empty collection so that
 * "confirmed base" and "planned expansion" are never blurred together.
 */
export function CoveragePage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Coverage",
    `${siteConfig.identity.name} is based in ${coverageBase.name}, Sierra Leone. Confirmed areas of activity are listed here; unconfirmed locations are never published.`,
  );

  return (
    <main>
      <SiteHeader />
      <ConceptNotice />

      <PageHero
        eyebrow="Membership · Coverage"
        title="Where the club"
        accent="runs today."
        description="The club's confirmed base, and how that base relates to the wider area. Locations are published only when they have been confirmed."
        parent={{ label: "Membership overview", to: "/membership" }}
        watermark="HERE"
      />

      <SectionSubnav
        sections={membershipSections}
        pathname={pathname}
        label="Membership sections"
      />

      <section className="on-dark bg-ink px-5 py-20 text-warm-white sm:px-[7vw] sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-[8vw]">
          <Reveal>
            <MapPinned aria-hidden="true" className="size-9 text-gold-bright" />
            <h2 className="mt-6 mb-0 text-[0.7rem] font-black tracking-[0.14em] text-warm-white/80 uppercase">
              Confirmed base
            </h2>
            <p className="editorial-display mt-3 mb-0 text-[clamp(2.4rem,6vw,5.6rem)]">
              {coverageBase.name}
            </p>
            <p className="mt-6 max-w-lg leading-relaxed text-warm-white/65">
              {coverageBase.note} Runs are organised from{" "}
              {siteConfig.identity.location}, and new members are welcomed at
              those runs.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <address className="border border-warm-white/20 p-6 not-italic">
              <span className="text-[0.7rem] font-black tracking-[0.14em] text-gold-bright uppercase">
                Club address
              </span>
              <p className="mt-3 mb-0 text-lg">{siteConfig.contact.address}</p>
              <p className="mt-4 mb-0 text-sm text-warm-white/65">
                {siteConfig.identity.type} · Est. {siteConfig.identity.established}
              </p>
            </address>
          </Reveal>
        </div>
      </section>

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <Reveal>
          <div className="flex items-center gap-3">
            <MapPin aria-hidden="true" className="size-6 text-gold-deep" />
            <h2 className="text-[0.7rem] font-black tracking-[0.14em] uppercase">
              Confirmed locations
            </h2>
          </div>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-gray">
            These are the only locations the club has confirmed. Any location not
            listed here has not been confirmed and is deliberately not shown.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {confirmedCoverage.map((area) => (
            <CoverageItem key={area.name} area={area} />
          ))}
        </ul>
      </section>

      <section className="bg-warm-paper px-5 py-20 sm:px-[7vw] sm:py-24">
        <Reveal>
          <h2 className="text-[0.7rem] font-black tracking-[0.14em] uppercase">
            Areas of activity beyond the base
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-gray">
            Areas of activity beyond the confirmed base are kept separate from it,
            so the club's current base is never confused with future plans.
          </p>
        </Reveal>

        {futureCoverage.length > 0 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {futureCoverage.map((area) => (
              <CoverageItem key={area.name} area={area} />
            ))}
          </ul>
        ) : (
          <Reveal className="mt-10">
            <p className="border border-ink/15 bg-pure-white p-8 text-center leading-relaxed text-muted-gray">
              No additional areas of activity have been confirmed. If the club
              operates beyond its base in future, they will be listed here once
              confirmed.
            </p>
          </Reveal>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
