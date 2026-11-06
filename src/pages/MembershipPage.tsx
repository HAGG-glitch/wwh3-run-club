import { useLocation } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { TextLink } from "@/components/SectionPrimitives";
import { Button } from "@/components/ui/button";
import {
  confirmedCoverage,
  coverageBase,
  futureCoverage,
  membershipNotes,
  membershipSteps,
  registrationFee,
} from "@/data/membership";
import { membershipSections } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";

/**
 * Membership.
 *
 * Carries the public requirements and the six-step application process. The
 * club's internal governance is deliberately absent: the process says only
 * that an application is reviewed by WWH3, with no officers, committees,
 * approval procedures or decision-making structures described.
 */
export function MembershipPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Membership",
    `How to join ${siteConfig.identity.name}: attend a Hash, complete three runs, receive an endorsement and have your application reviewed by WWH3. Applicants must be men aged 18 or above.`,
  );

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Membership"
        title="Earn your"
        accent="place in the Pack."
        description="Membership is earned on the trail. Here is the full process, what is expected of applicants, and what the club asks in return."
        watermark="JOIN"
      />

      <SectionSubnav
        sections={membershipSections}
        pathname={pathname}
        label="Membership sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <Reveal>
          <h2 className="text-[0.7rem] font-black tracking-[0.14em] uppercase">
            Qualifications
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {membershipNotes.map((note) => (
            <li
              key={note.title}
              className="flex gap-4 border border-ink/15 bg-pure-white p-6"
            >
              <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-deep" />
              <div>
                <strong className="block text-[0.95rem] tracking-[0.02em] uppercase">
                  {note.title}
                </strong>
                <span className="mt-1.5 block leading-relaxed text-muted-gray">
                  {note.text}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-dark bg-ink px-5 py-20 text-warm-white sm:px-[7vw] sm:py-28">
        <Reveal>
          <h2 className="text-[0.7rem] font-black tracking-[0.14em] text-warm-white/80 uppercase">
            The application process
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-px bg-warm-white/15 sm:grid-cols-2 xl:grid-cols-3">
          {membershipSteps.map((step) => (
            <li key={step.step} className="bg-ink p-7">
              <span className="grid size-9 place-items-center rounded-full border border-gold-bright text-[0.65rem] font-black text-gold-bright">
                {step.step}
              </span>
              <h3 className="mt-5 mb-0 text-[1.05rem] font-black tracking-[0.02em] uppercase">
                {step.title}
              </h3>
              <p className="mt-3 mb-0 leading-relaxed text-warm-white/65">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <Reveal className="mt-12">
          <div className="grid gap-6 border border-warm-white/15 bg-warm-white/5 p-6 sm:p-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-10">
            <div>
              <span className="text-[0.66rem] font-black tracking-[0.12em] text-gold-bright uppercase">
                Registration fee
              </span>
              <p className="editorial-display mt-3 mb-0 text-[clamp(2rem,4vw,3.4rem)] leading-none text-warm-white">
                {registrationFee.display}
              </p>
              <p className="mt-3 mb-0 max-w-xs text-sm leading-relaxed text-warm-white/65">
                Payable once your application has been approved.
              </p>
            </div>

            <div>
              <p className="m-0 text-sm leading-relaxed text-warm-white/80">
                Pay by {registrationFee.paymentMethod} to the merchant code
                below, then send your receipt to the club on WhatsApp.
              </p>
              <dl className="m-0 mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.62rem] font-black tracking-[0.1em] text-warm-white/55 uppercase">
                    Payment method
                  </dt>
                  <dd className="mt-1 text-[0.95rem] font-bold tracking-[0.03em] text-warm-white uppercase">
                    {registrationFee.paymentMethod}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-black tracking-[0.1em] text-warm-white/55 uppercase">
                    Merchant code
                  </dt>
                  <dd className="mt-1 text-[0.95rem] font-black tracking-[0.08em] text-gold-bright">
                    {registrationFee.merchantCode}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[0.62rem] font-black tracking-[0.1em] text-warm-white/55 uppercase">
                    Send the receipt to
                  </dt>
                  <dd className="mt-1 text-[0.95rem] font-bold tracking-[0.03em] text-warm-white">
                    <a
                      href={registrationFee.receiptPhoneHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-gold-bright/60 underline-offset-4 transition-colors hover:text-gold-bright"
                    >
                      {registrationFee.receiptPhoneDisplay}
                    </a>{" "}
                    on WhatsApp
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <Button
            asChild
            className="h-auto rounded-sm bg-gold-bright px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-warm-white"
          >
            <a href={siteConfig.contact.emailHref}>
              Ask about membership
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </Reveal>
      </section>

      <section className="bg-gold-bright px-5 py-20 sm:px-[7vw] sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:gap-[9vw]">
          <Reveal>
            <span className="text-[0.7rem] font-black tracking-[0.12em] uppercase">
              Where we are based
            </span>
            <h2 className="editorial-display mt-3 mb-0 text-[clamp(2.2rem,5.2vw,5rem)]">
              Based in
              <br />
              {coverageBase.name}.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed">
              The club runs from {siteConfig.identity.location}. Areas of activity
              beyond the confirmed base are published only once they have been
              confirmed.
            </p>
            <TextLink to="/membership/coverage" className="mt-6">
              Full coverage information
            </TextLink>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="text-[0.7rem] font-black tracking-[0.12em] uppercase">
              Confirmed locations
            </span>
            <ul className="mt-5 space-y-3">
              {confirmedCoverage.map((area) => (
                <li
                  key={area.name}
                  className="border-b border-ink/20 pb-3 last:border-b-0"
                >
                  <strong className="block text-[0.95rem] tracking-[0.04em] uppercase">
                    {area.name}
                  </strong>
                  <span className="mt-1 block text-sm leading-relaxed">
                    {area.note}
                  </span>
                </li>
              ))}
            </ul>
            {futureCoverage.length === 0 && (
              <p className="mt-6 text-sm leading-relaxed">
                No additional areas of activity have been confirmed. This section
                will be updated if that changes.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
