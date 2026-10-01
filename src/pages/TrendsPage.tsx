import { useLocation } from "react-router-dom";
import { ChartNoAxesColumn, ShieldCheck, TrendingUp } from "lucide-react";

import { ConceptNotice } from "@/components/ConceptNotice";
import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { membershipSections } from "@/data/navigation";
import {
  hasVerifiedMembershipTrends,
  membershipTrendMetrics,
  trendsEmptyState,
} from "@/data/membership";
import { siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";

/**
 * Membership trends.
 *
 * This page is prepared for aggregated statistics but publishes no figures,
 * because none have been verified by the club.
 *
 * The data model is deliberately restricted to counts. Names, telephone
 * numbers, email addresses and individual attendance histories are not stored
 * in `membership.ts` at all, so there is no code path that could render them
 * even if such data were later added elsewhere.
 */
export function TrendsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Membership Trends",
    `Aggregated ${siteConfig.identity.name} membership statistics. Figures are published only once they have been verified, and never include personal details.`,
  );

  return (
    <main>
      <SiteHeader />
      <ConceptNotice />

      <PageHero
        eyebrow="Membership · Trends"
        title="Membership"
        accent="over time."
        description="Aggregated figures only, published once verified against the club's membership records. No names, contact details or attendance histories are ever published."
        parent={{ label: "Membership overview", to: "/membership" }}
        watermark="TREND"
      />

      <SectionSubnav
        sections={membershipSections}
        pathname={pathname}
        label="Membership sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <Reveal>
          <EmptyState
            icon={TrendingUp}
            heading={trendsEmptyState.heading}
            body={trendsEmptyState.body}
          />
        </Reveal>
      </section>

      <section className="bg-warm-paper px-5 py-20 sm:px-[7vw] sm:py-24">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[0.7rem] font-black tracking-[0.14em] uppercase">
                What will be published
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-gray">
                The club intends to publish these metrics once verified data
                exists. Each is defined now so the scope is unambiguous.
              </p>
            </div>
            <ChartNoAxesColumn
              aria-hidden="true"
              className="size-10 shrink-0 text-gold-deep"
            />
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-px bg-ink/12 sm:grid-cols-2 xl:grid-cols-3">
          {membershipTrendMetrics.map((metric) => (
            <li key={metric.key} className="bg-warm-paper p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="m-0 text-[0.95rem] font-black tracking-[0.03em] uppercase">
                  {metric.label}
                </h3>
                <span className="border border-ink/20 px-2 py-0.5 text-[0.55rem] font-black tracking-[0.1em] text-muted-gray uppercase">
                  {hasVerifiedMembershipTrends ? "Published" : "Pending"}
                </span>
              </div>
              <p className="mt-3 mb-0 leading-relaxed text-muted-gray">
                {metric.description}
              </p>
              {metric.value && (
                <p className="mt-4 mb-0 text-2xl font-black">{metric.value}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="on-dark bg-ink px-5 py-16 text-warm-white sm:px-[7vw]">
        <Reveal>
          <div className="flex gap-5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-8 shrink-0 text-gold-bright" />
            <div>
              <h2 className="m-0 text-[1.2rem] font-black tracking-[0.02em] uppercase">
                Privacy guarantee
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-warm-white/65">
                Membership statistics on this page are always totals and
                percentages. The club will never publish member names, telephone
                numbers, email addresses or any individual attendance history.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
