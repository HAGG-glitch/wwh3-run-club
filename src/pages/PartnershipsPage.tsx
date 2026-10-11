import { useLocation } from "react-router-dom";
import { Handshake, Plus } from "lucide-react";

import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { membershipSections } from "@/data/navigation";
import {
  hasPublishedPartners,
  partnersEmptyState,
  publishedPartners,
  type Partner,
} from "@/data/partners";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/** One partner card. Renders a website link only when one is approved. */
function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="flex h-full flex-col border border-ink/15 bg-pure-white p-7">
      <div className="flex items-start justify-between gap-4">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            loading="lazy"
            className="h-14 w-auto max-w-[10rem] object-contain"
          />
        ) : (
          <span className="grid h-14 w-24 place-items-center border border-ink/15 text-[0.6rem] font-black tracking-[0.1em] text-muted-gray uppercase">
            No logo
          </span>
        )}
        <Badge
          variant="outline"
          className="rounded-sm border-ink/25 text-[0.6rem] font-black tracking-[0.1em] uppercase"
        >
          {partner.type}
        </Badge>
      </div>

      {partner.isDemo && (
        <Badge className="mt-4 w-max rounded-sm border-0 bg-gold-bright text-[0.6rem] font-black tracking-[0.1em] text-ink uppercase">
          {demoLabels.partner}
        </Badge>
      )}

      <h2 className="mt-5 mb-0 text-[1.15rem] font-black tracking-[0.02em] uppercase">
        {partner.name}
      </h2>
      <p className="mt-1 mb-0 text-[0.7rem] font-bold tracking-[0.1em] text-muted-gray uppercase">
        {partner.partnershipStatus === "active"
          ? "Current partner"
          : "Past partner"}
      </p>

      <p className="mt-4 mb-0 flex-1 leading-relaxed text-muted-gray">
        {partner.description}
      </p>

      {partner.websiteUrl && (
        <Button
          asChild
          variant="outline"
          className="mt-6 h-auto w-full justify-center rounded-sm border-ink/30 py-3.5 text-[0.74rem] font-black tracking-[0.08em] uppercase hover:bg-ink hover:text-warm-white"
        >
          <a href={partner.websiteUrl} rel="noopener noreferrer">
            Visit website
          </a>
        </Button>
      )}
    </article>
  );
}

/**
 * Partnerships.
 *
 * No partner organisation is named, described or illustrated until the club
 * confirms the partnership and approves it for publication. Naming a partner
 * implies an endorsement that has not been granted, so the default is empty.
 */
export function PartnershipsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Partnerships",
    `Confirmed ${siteConfig.identity.name} partners and supporters. Organisations are listed only after the club has approved them for publication.`,
  );

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Membership · Partnerships"
        title="Partners who"
        accent="walk the trail."
        description="Venues, sponsors and community organisations that support the club. Only confirmed partnerships are listed."
        parent={{ label: "Membership overview", to: "/membership" }}
        watermark="ALLY"
      />

      <SectionSubnav
        sections={membershipSections}
        pathname={pathname}
        label="Membership sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        {hasPublishedPartners ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {publishedPartners.map((partner) => (
              <StaggerItem key={partner.id}>
                <PartnerCard partner={partner} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <EmptyState
              icon={Handshake}
              heading={partnersEmptyState.heading}
              body={partnersEmptyState.body}
              note={
                <ul className="mx-auto max-w-lg list-disc space-y-2 pl-5 text-left">
                  {[
                    "Partner name and type",
                    "An approved logo",
                    "A short approved description",
                    "A website URL, if the club approves linking to it",
                  ].map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              }
              action={{ label: "Contact WWH3", to: `/#${sectionIds.contact}` }}
            />
          </Reveal>
        )}
      </section>

      <section className="on-dark bg-ink px-5 py-16 text-warm-white sm:px-[7vw]">
        <Reveal>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="m-0 max-w-xl text-[1.3rem] font-black tracking-[0.02em] uppercase">
              Interested in supporting the club?
            </h2>
            <Button
              asChild
              className="h-auto shrink-0 rounded-sm bg-gold-bright px-6 py-4 text-[0.76rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-warm-white"
            >
              <a href={siteConfig.contact.emailHref}>
                <Plus aria-hidden="true" className="size-4" />
                Start a conversation
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
