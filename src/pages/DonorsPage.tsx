import { useLocation } from "react-router-dom";
import { HeartHandshake, ShieldCheck } from "lucide-react";

import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  donorsEmptyState,
  hasPublishedDonors,
  publishedDonors,
  type Donor,
} from "@/data/donors";
import { membershipSections } from "@/data/navigation";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/** One donor card. */
function DonorCard({ donor }: { donor: Donor }) {
  return (
    <article className="flex h-full flex-col border border-ink/15 bg-pure-white p-7">
      <div className="flex items-start justify-between gap-4">
        {donor.logo ? (
          <img
            src={donor.logo}
            alt={`${donor.name} logo`}
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
          {donor.supportCategory}
        </Badge>
      </div>

      {donor.isDemo && (
        <Badge className="mt-4 w-max rounded-sm border-0 bg-gold-bright text-[0.6rem] font-black tracking-[0.1em] text-ink uppercase">
          {demoLabels.donor}
        </Badge>
      )}

      <h2 className="mt-5 mb-0 text-[1.15rem] font-black tracking-[0.02em] uppercase">
        {donor.name}
      </h2>

      <p className="mt-4 mb-0 flex-1 leading-relaxed text-muted-gray">
        {donor.description}
      </p>
    </article>
  );
}

/**
 * Donor and supporter recognition.
 *
 * Two guarantees are enforced in the data layer rather than in this component:
 * a record is listed only when `published` **and** `recognitionConsent` are
 * both true, and contribution amounts are not modelled at all, so no sum can be
 * displayed or leaked.
 */
export function DonorsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Donors",
    `Approved donors and supporters of ${siteConfig.identity.name}. Names are published only with the supporter's explicit recognition consent.`,
  );

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Membership · Donors"
        title="Support that"
        accent="keeps the trails open."
        description="Donors and supporters are recognised here only with their explicit permission. No names or contributions are published without consent."
        parent={{ label: "Membership overview", to: "/membership" }}
        watermark="THANKS"
      />

      <SectionSubnav
        sections={membershipSections}
        pathname={pathname}
        label="Membership sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        {hasPublishedDonors ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {publishedDonors.map((donor) => (
              <StaggerItem key={donor.id}>
                <DonorCard donor={donor} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <EmptyState
              icon={HeartHandshake}
              heading={donorsEmptyState.heading}
              body={donorsEmptyState.body}
              action={{ label: "Contact WWH3", to: `/#${sectionIds.contact}` }}
            />
          </Reveal>
        )}
      </section>

      <section className="on-dark bg-ink px-5 py-16 text-warm-white sm:px-[7vw] sm:py-20">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[.9fr_1fr] lg:gap-[8vw]">
            <div>
              <ShieldCheck aria-hidden="true" className="size-9 text-gold-bright" />
              <h2 className="mt-5 mb-0 text-[1.4rem] font-black tracking-[0.02em] uppercase">
                How recognition works
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-warm-white/65">
                Supporter recognition is a private arrangement between the club
                and the supporter. Nothing is published until that supporter has
                agreed to it in writing.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                {
                  title: "Permission first",
                  text: "A supporter is listed only after explicit recognition consent has been confirmed.",
                },
                {
                  title: "Categories, not amounts",
                  text: "This site recognises support categories. It does not publish donation amounts.",
                },
                {
                  title: "Withdraw any time",
                  text: "A supporter can ask to be removed, and the listing is removed without argument.",
                },
              ].map((item) => (
                <li key={item.title} className="border-l-2 border-gold-bright pl-5">
                  <strong className="block text-[0.95rem] tracking-[0.04em] uppercase">
                    {item.title}
                  </strong>
                  <span className="mt-1.5 block leading-relaxed text-warm-white/65">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Button
            asChild
            className="h-auto rounded-sm bg-gold-bright px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-warm-white"
          >
            <a href={siteConfig.contact.emailHref}>Support the club</a>
          </Button>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
