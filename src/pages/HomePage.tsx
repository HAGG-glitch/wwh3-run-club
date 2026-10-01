import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Mountain,
  Phone,
} from "lucide-react";

import { ConceptNotice } from "@/components/ConceptNotice";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JoinForm } from "@/components/JoinForm";
import { Reveal, InView } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import {
  Eyebrow,
  SectionHeading,
  SectionLabel,
  TextLink,
} from "@/components/SectionPrimitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqItems } from "@/data/faq";
import { featuredGalleryItems } from "@/data/gallery";
import { hashTerms } from "@/data/hashTerms";
import {
  publishedRuns,
  hasConfirmedUpcomingRuns,
  upcomingRuns,
} from "@/data/runs";
import {
  clubStats,
  conductStandards,
  hashSteps,
  nextHashPending,
  pillars,
  sectionIds,
  siteConfig,
} from "@/data/siteConfig";
import { membershipNotes, membershipSteps } from "@/data/membership";
import { cn } from "@/lib/utils";
import { demoLabels } from "@/lib/demoLabels";

/* -------------------------------------------------------------------------- */
/* 1. Navigation is rendered by <SiteHeader /> above.                         */
/* 2. Hero                                                                   */
/* -------------------------------------------------------------------------- */

const HERO_WORDS = [
  { word: "RUN.", note: "Move at your own pace." },
  { word: "EXPLORE.", note: "Follow the trail through Freetown." },
  { word: "TOGETHER.", note: "No member of the Pack is left behind." },
] as const;

function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="top"
      aria-label={`${siteConfig.identity.name} — ${siteConfig.identity.motto}`}
      className="on-dark relative isolate flex min-h-[min(820px,calc(100vh-120px))] flex-col overflow-hidden bg-[#0d151d] text-warm-white"
    >
      <img
        src="/wwh3-hero.webp"
        alt="Placeholder photograph of a running group on a hillside above Freetown"
        className="absolute inset-0 -z-2 size-full object-cover object-[center_48%] contrast-[1.05] saturate-[.84] motion-safe:animate-hero-image-in"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,rgba(5,12,18,.72),rgba(5,12,18,.18)_48%,rgba(5,12,18,.56)),linear-gradient(0deg,rgba(5,10,14,.8),transparent_55%,rgba(5,10,14,.25))]"
      />

      <div className="px-5 pt-6 sm:px-[7vw] sm:pt-10">
        <p className="text-[0.66rem] font-black tracking-[0.14em] text-warm-white/70 uppercase sm:text-[0.68rem]">
          {siteConfig.identity.abbreviation} / Freetown / Sierra Leone
        </p>
      </div>

      {/* The oversized words are the page headline, so this is the document's
          single `h1`. The club's full name is available to assistive technology
          and search engines, while the visible treatment stays editorial. */}
      <h1 className="m-0 flex flex-1 flex-col justify-center gap-4 px-5 py-10 sm:px-[4vw] lg:flex-row lg:items-end lg:gap-[2.2vw] lg:px-[3.6vw]">
        <span className="sr-only">
          {siteConfig.identity.name} — {siteConfig.identity.motto}.{" "}
        </span>
        {HERO_WORDS.map((item, index) => (
          <motion.div
            key={item.word}
            className={cn(
              "min-w-0",
              index === 1 && "lg:flex-[1.12] lg:text-center",
              index === 2 && "lg:flex-1 lg:text-right",
            )}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: prefersReducedMotion ? 0 : 0.2 + index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <strong
              className={cn(
                "oversize-hero-word block font-normal",
                index === 1 ? "text-gold-bright" : "text-warm-white",
              )}
            >
              {item.word}
            </strong>
            <span
              className={cn(
                "mt-4 block max-w-[13rem] text-[0.68rem] leading-snug text-warm-white/70 lg:mt-5",
                index === 1 && "lg:mx-auto",
                index === 2 && "lg:ml-auto lg:mr-0",
              )}
            >
              {item.note}
            </span>
          </motion.div>
        ))}
      </h1>

      <div className="px-5 pb-8 sm:px-[4vw]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button
            asChild
            size="lg"
            className="h-auto rounded-sm bg-gold-bright px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-ink hover:text-warm-white"
          >
            <Link to={`/#${sectionIds.membership}`}>
              Join the Next Hash
              <ArrowDownRight aria-hidden="true" />
            </Link>
          </Button>
          <TextLink to={`/#${sectionIds.about}`} tone="light">
            Discover {siteConfig.identity.abbreviation}
            <ArrowRight aria-hidden="true" />
          </TextLink>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[0.62rem] font-black tracking-[0.12em] text-warm-white/60 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>Non-competitive running · Adventure · Fellowship</p>
          <p className="font-black text-gold-bright">{siteConfig.identity.rallyingCall}</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. About WWH3                                                              */
/* -------------------------------------------------------------------------- */

function AboutSection() {
  return (
    <section
      id={sectionIds.about}
      aria-labelledby="about-heading"
      className="px-5 py-20 sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <SectionLabel index="03">Who we are</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[8vw]">
          <h2 id="about-heading" className="m-0">
            <SectionHeading accent="A fellowship.">
              Not a race.
            </SectionHeading>
          </h2>

          <div className="space-y-5 leading-relaxed text-muted-gray">
            {siteConfig.about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={cn(
                  "m-0",
                  index === 0 &&
                    "text-[clamp(1.15rem,1.9vw,1.7rem)] leading-[1.34] font-semibold text-ink",
                )}
              >
                {paragraph}
              </p>
            ))}

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/15 pt-6">
              {clubStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0">
                    <span className="editorial-display block text-[clamp(1.9rem,3.4vw,2.8rem)] text-gold-deep">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[0.68rem] font-bold tracking-[0.08em] text-muted-gray uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="border-l-2 border-gold pl-4">
                <h3 className="m-0 text-[0.7rem] font-black tracking-[0.12em] uppercase">
                  Vision
                </h3>
                <p className="mt-2 mb-0 text-sm leading-relaxed">
                  {siteConfig.vision}
                </p>
              </div>
              <div className="border-l-2 border-gold pl-4">
                <h3 className="m-0 text-[0.7rem] font-black tracking-[0.12em] uppercase">
                  Mission
                </h3>
                <p className="mt-2 mb-0 text-sm leading-relaxed">
                  {siteConfig.mission}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Next Hash                                                               */
/* -------------------------------------------------------------------------- */

function NextHashSection() {
  return (
    <section
      id={sectionIds.nextHash}
      aria-labelledby="next-hash-heading"
      className="on-dark relative overflow-hidden bg-ink px-5 py-16 text-warm-white sm:px-[7vw] sm:py-20"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[5.5rem] -left-[2vw] font-[family-name:var(--font-display)] text-[15vw] leading-none whitespace-nowrap text-warm-white/[.035] select-none"
      >
        ON—ON
      </span>

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-[8vw]">
        <Reveal>
          <Eyebrow tone="light">Next Hash</Eyebrow>
          <h2 id="next-hash-heading" className="m-0">
            <SectionHeading tone="light" accent="a different trail.">
              Every other Friday.
            </SectionHeading>
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-warm-white/65">
            {siteConfig.schedule.note} {siteConfig.identity.motto}.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {hasConfirmedUpcomingRuns ? (
            <ul className="m-0 grid list-none gap-3 p-0">
              {upcomingRuns.map((run) => (
                <li key={run.id}>
                  <Card className="rounded-sm border-0 bg-gold-bright text-ink shadow-[16px_16px_0_rgba(255,255,255,0.07)]">
                    <CardContent className="p-6">
                      <p className="m-0 text-[0.7rem] font-black tracking-[0.1em] uppercase">
                        Hash #{run.hashNumber} · {run.date}
                      </p>
                      <h3 className="mt-2 mb-3 text-lg font-black uppercase">
                        {run.title}
                      </h3>
                      <p className="m-0 flex items-center gap-2 text-sm">
                        <MapPin aria-hidden="true" className="size-4 shrink-0" />
                        {run.meetingLocation}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            /* Honest empty state: no confirmed schedule exists yet, so no date
               is invented. */
            <Card
              data-testid="next-hash-empty"
              className="rounded-sm border-0 bg-gold-bright text-ink shadow-[16px_16px_0_rgba(255,255,255,0.07)]"
            >
              <CardContent className="p-7">
                <Badge className="mb-4 rounded-sm border-0 bg-ink/10 font-black tracking-[0.09em] text-ink uppercase">
                  Awaiting confirmation
                </Badge>
                <h3 className="m-0 text-xl font-black tracking-[0.02em] uppercase">
                  {nextHashPending.heading}
                </h3>
                <p className="mt-3 mb-5 text-sm leading-relaxed text-ink/75">
                  {nextHashPending.body}
                </p>
                <Button
                  asChild
                  className="h-auto w-full justify-between rounded-sm bg-ink px-5 py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
                >
                  <a href={siteConfig.contact.emailHref}>
                    Email {siteConfig.identity.abbreviation}
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <p className="mt-3 mb-0 text-[0.68rem] text-ink/60">
                  {siteConfig.contact.email} ·{" "}
                  <a
                    href={siteConfig.contact.telephoneHref}
                    className="underline underline-offset-4"
                  >
                    {siteConfig.contact.telephoneDisplay}
                  </a>
                </p>
              </CardContent>
            </Card>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. What is Hashing?                                                        */
/* -------------------------------------------------------------------------- */

function HashingSection() {
  return (
    <section
      id={sectionIds.hashing}
      aria-labelledby="hashing-heading"
      className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[.55fr_1.1fr_.65fr] lg:items-end lg:gap-[5vw]">
          <SectionLabel index="05" className="self-start lg:mb-0">
            The Hash
          </SectionLabel>
          <h2 id="hashing-heading" className="m-0">
            <SectionHeading accent="comes alive.">
              How a Hash
            </SectionHeading>
          </h2>
          <p className="m-0 leading-relaxed text-muted-gray">
            A trail with enough uncertainty to turn movement into adventure, and
            strangers into a Pack.
          </p>
        </div>
      </Reveal>

      <StaggerGroup as="ol" className="m-0 mt-12 list-none border-t border-ink/15 p-0">
        {hashSteps.map((step, index) => (
              <StaggerItem
                key={step.step}
                as="li"
                className="grid grid-cols-[2.75rem_1fr] items-start gap-3 border-b border-ink/15 py-6 sm:grid-cols-[5rem_7.5rem_1fr] sm:gap-7"
              >
                <span className="pt-1 text-[0.7rem] font-black tracking-[0.1em] text-muted-gray">
                  {step.step}
                </span>
                {/* Each step gets its own wayfinding motif so the six read as
                    distinct stages of a Hash rather than six identical rows.
                    These are decorative: the ordered list carries the meaning,
                    so the whole cell is hidden from assistive technology. */}
                <span
                  aria-hidden="true"
                  data-step-motif={index}
                  className="step-motif relative hidden h-7 pt-[13px] text-base text-gold-deep sm:block"
                >
                  {index === hashSteps.length - 1 ? (
                    <span className="step-motif-circle" />
                  ) : (
                    <span className="step-motif-trail" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 mb-1.5 text-[1.05rem] tracking-[-0.01em] uppercase sm:text-[1.18rem]">
                    {step.title}
                  </h3>
                  <p className="m-0 max-w-2xl text-muted-gray">{step.text}</p>
                </div>
              </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.05} className="mt-16">
        <h3 className="m-0 mb-8 text-[0.7rem] font-black tracking-[0.14em] text-ink uppercase">
          The language of hashing
        </h3>
        <Accordion
          type="single"
          collapsible
          data-testid="hash-terms-accordion"
          className="border-t border-ink/15"
        >
          {hashTerms.map((term) => (
            <AccordionItem
              key={term.id}
              value={term.id}
              className="border-b border-ink/15"
            >
              <AccordionTrigger className="rounded-sm py-5 text-[0.95rem] font-black tracking-[0.02em] uppercase hover:no-underline hover:text-gold-deep sm:text-base">
                {term.term}
              </AccordionTrigger>
              <AccordionContent className="max-w-3xl pb-5 text-[0.95rem] leading-relaxed text-muted-gray">
                {term.definition}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Five pillars                                                            */
/* -------------------------------------------------------------------------- */

function PillarsSection() {
  return (
    <section
      id={sectionIds.pillars}
      aria-labelledby="pillars-heading"
      className="bg-soft-sand px-5 py-20 sm:px-[7vw] sm:py-24"
    >
      <Reveal>
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.55fr] lg:items-end lg:gap-[8vw]">
          <div>
            <SectionLabel index="06" tone="gold">
              What holds us together
            </SectionLabel>
            <h2 id="pillars-heading" className="m-0">
              <SectionHeading accent="One brotherhood.">
                Five pillars.
              </SectionHeading>
            </h2>
          </div>
          <p className="m-0 leading-relaxed text-muted-gray">
            These constitutional values shape how we move, treat one another and
            show up for the places that welcome us.
          </p>
        </div>
      </Reveal>

      <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <StaggerItem key={pillar.number} as="article" className="h-full">
              <Card className="group h-full rounded-sm border border-ink/15 bg-transparent shadow-none transition-colors duration-300 hover:border-gold hover:bg-gold-bright motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_22px_45px_rgba(23,25,29,0.12)]">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between text-[0.7rem] font-black">
                    <span className="text-muted-gray">{pillar.number}</span>
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.6}
                      className="size-6 text-gold-deep transition-transform duration-300 group-hover:-rotate-9 group-hover:scale-105 motion-safe:group-hover:-rotate-9"
                    />
                  </div>
                  <h3 className="mt-auto mb-3 pt-8 text-[1.15rem] uppercase">
                    {pillar.name}
                  </h3>
                  <p className="m-0 text-[0.89rem] leading-relaxed text-muted-gray">
                    {pillar.text}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Recent Hash Log                                                         */
/* -------------------------------------------------------------------------- */

function RecentRunsSection() {
  return (
    <section
      id={sectionIds.log}
      aria-labelledby="log-heading"
      className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.62fr] lg:items-end lg:gap-[8vw]">
          <div>
            <SectionLabel index="07">Recent adventures</SectionLabel>
            <h2 id="log-heading" className="m-0">
              <SectionHeading accent="Log.">
                The Hash
              </SectionHeading>
            </h2>
          </div>
          <div>
            <p className="mb-5 leading-relaxed text-muted-gray">
              Every trail leaves a story. The entries below use demonstration
              content to show how completed runs will be documented once
              confirmed records and approved photographs are supplied.
            </p>
            <TextLink to="/runs">
              Explore all runs
              <ArrowUpRight aria-hidden="true" />
            </TextLink>
          </div>
        </div>
      </Reveal>

      <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {publishedRuns.map((run) => (
          <StaggerItem key={run.id} as="article" className="h-full">
            <Card className="group h-full overflow-hidden rounded-sm border border-ink/15 bg-warm-white shadow-none transition-shadow duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_24px_55px_rgba(23,25,29,0.13)]">
              <div className="relative h-[19rem] overflow-hidden bg-charcoal">
                <img
                  src={run.coverImage}
                  alt={run.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.045]"
                />
                <Badge className="absolute top-4 left-4 rounded-sm border-0 bg-gold-bright font-black tracking-[0.09em] text-ink uppercase">
                  {demoLabels.record}
                </Badge>
                {run.hashNumber && (
                  <span className="editorial-display absolute right-4 bottom-2 text-[3.4rem] leading-none text-warm-white [text-shadow:0_2px_20px_rgba(0,0,0,.35)]">
                    #{run.hashNumber}
                  </span>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between text-[0.68rem] font-bold tracking-[0.07em] text-muted-gray uppercase">
                  <span>{run.date}</span>
                  <span className="text-gold-deep">{run.distance}</span>
                </div>
                <h3 className="mt-5 mb-2.5 text-[1.3rem] uppercase">
                  <Link
                    to={`/runs/${run.slug}`}
                    className="rounded-sm transition-colors after:absolute after:inset-0 hover:text-gold-deep"
                  >
                    {run.title}
                  </Link>
                </h3>
                <p className="m-0 text-sm leading-relaxed text-muted-gray">
                  {run.summary}
                </p>
                <span className="mt-5 flex items-center justify-between border-t border-ink/15 pt-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">
                  Read the trail story
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </span>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Gallery preview                                                         */
/* -------------------------------------------------------------------------- */

function GalleryPreviewSection() {
  return (
    <section
      id={sectionIds.gallery}
      aria-labelledby="gallery-heading"
      className="overflow-hidden bg-pure-white pb-0"
    >
      <Reveal className="flex flex-col items-start gap-6 px-5 pt-20 pb-10 sm:flex-row sm:items-end sm:justify-between sm:px-[7vw] sm:pt-24 sm:pb-12">
        <div>
          <SectionLabel index="08">Life in the Pack</SectionLabel>
          <h2 id="gallery-heading" className="m-0">
            <SectionHeading accent="Brotherhood.">
              Trail. Circle.
            </SectionHeading>
          </h2>
        </div>
        <Button
          asChild
          className="h-auto rounded-sm bg-ink px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-gold-bright hover:text-ink"
        >
          <Link to="/gallery">
            Open the gallery
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Reveal>

      <StaggerGroup className="grid gap-0 sm:h-[34rem] sm:grid-cols-4">
        {featuredGalleryItems.slice(0, 4).map((item, index) => (
          <StaggerItem
            key={item.id}
            as="article"
            className={cn(
              "group relative min-w-0 overflow-hidden sm:h-full",
              index % 2 === 1 && "sm:mt-16",
            )}
          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              className="size-full object-cover saturate-[.9] transition-[transform,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.055] motion-safe:group-hover:saturate-100"
            />
            <div className="absolute inset-x-4 bottom-4 bg-ink/90 p-4 text-warm-white backdrop-blur-md">
              <span className="block text-[0.6rem] font-black tracking-[0.1em] text-gold-bright uppercase">
                {item.category}
              </span>
              <strong className="mt-1 block text-[0.82rem] uppercase">
                {item.caption}
              </strong>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. Membership — process + join form                                        */
/* -------------------------------------------------------------------------- */

function MembershipSection() {
  return (
    <section
      id={sectionIds.membership}
      aria-labelledby="membership-heading"
      className="bg-soft-sand px-5 py-20 sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-[9vw]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionLabel index="09">Membership</SectionLabel>
            <h2 id="membership-heading" className="m-0">
              <SectionHeading accent="the Circle.">
                Six steps into
              </SectionHeading>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-gray">
              Membership is open to men aged 18 and above who embrace the spirit
              of the Hash and commit to safety, respect and fellowship.
            </p>
            <ul className="mt-7 m-0 grid list-none gap-2.5 p-0">
              {membershipNotes.map((note) => (
                <li
                  key={note.title}
                  className="flex items-start gap-2.5 text-[0.86rem] font-semibold text-gold-deep"
                >
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {note.text}
                </li>
              ))}
            </ul>

            <Link
              to="/membership"
              className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-[0.72rem] font-black tracking-[0.1em] uppercase transition-colors hover:border-gold-deep hover:text-gold-deep"
            >
              Full membership details
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>

          <StaggerGroup as="ol" className="m-0 list-none border-t border-ink/15 p-0">
            {membershipSteps.map((step) => (
              <StaggerItem
                key={step.step}
                as="li"
                className="group grid grid-cols-[2.75rem_1fr_1.5rem] items-start gap-4 border-b border-ink/15 py-6 transition-[padding,background-color] duration-[250ms] hover:bg-gold/8 motion-safe:hover:pl-3"
              >
                <span className="editorial-display pt-0.5 text-[1.7rem] leading-none text-gold-deep">
                  {step.step}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 mb-1 text-base uppercase">{step.title}</h3>
                  <p className="m-0 text-sm text-muted-gray">{step.text}</p>
                </div>
                <ArrowDownRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-muted-gray transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-16">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start lg:gap-[8vw]">
          <div>
            <h3 className="editorial-display m-0 text-[clamp(2rem,3.6vw,3.4rem)] text-ink uppercase">
              Come and
              <br />
              <span className="text-gold-deep">meet the Pack.</span>
            </h3>
            <p className="mt-5 max-w-sm leading-relaxed text-muted-gray">
              Send {siteConfig.identity.abbreviation} a note and we will reply
              with the latest meeting point, starting time and what to expect on
              your first trail.
            </p>
            <p className="mt-5 mb-0 flex items-center gap-2 text-sm font-bold text-ink">
              <CalendarDays aria-hidden="true" className="size-4 text-gold-deep" />
              {siteConfig.schedule.frequency} {siteConfig.schedule.regularDay}s
            </p>
          </div>

          <JoinForm />
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. FAQ                                                                    */
/* -------------------------------------------------------------------------- */

function FaqSection() {
  return (
    <section
      id={sectionIds.faq}
      aria-labelledby="faq-heading"
      className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.62fr] lg:items-end lg:gap-[8vw]">
          <div>
            <SectionLabel index="10">Questions</SectionLabel>
            <h2 id="faq-heading" className="m-0">
              <SectionHeading accent="answered.">
                Frequently asked
              </SectionHeading>
            </h2>
          </div>
          <p className="m-0 leading-relaxed text-muted-gray">
            Everything a first-time visitor usually wants to know. For anything
            else, email {siteConfig.contact.email}.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Accordion
          type="single"
          collapsible
          data-testid="faq-accordion"
          className="border-t border-ink/15"
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-ink/15"
            >
              <AccordionTrigger className="rounded-sm py-5 text-[0.95rem] font-black tracking-[0.02em] uppercase hover:no-underline hover:text-gold-deep sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-3xl pb-5 text-[0.95rem] leading-relaxed text-muted-gray">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. Safety and conduct                                                     */
/* -------------------------------------------------------------------------- */

function ConductSection() {
  return (
    <section
      id={sectionIds.conduct}
      aria-labelledby="conduct-heading"
      className="grid lg:grid-cols-2"
    >
      <InView className="on-dark flex min-h-[26rem] flex-col justify-between bg-[linear-gradient(145deg,#2f3237,#15171a)] p-7 text-gold-bright sm:p-[7vw]">
        <Mountain aria-hidden="true" strokeWidth={1.2} className="size-14" />
        <p
          id="conduct-heading"
          className="editorial-display m-0 text-[clamp(2.4rem,5.4vw,6rem)]"
        >
          Trail first.
          <br />
          People always.
        </p>
      </InView>

      <div className="bg-gold-bright p-7 sm:p-[7vw]">
        <Eyebrow>Our standard</Eyebrow>
        <h2 className="m-0">
          <SectionHeading accent="responsibility.">
            Adventure with
          </SectionHeading>
        </h2>
        <p className="my-7 max-w-xl leading-relaxed">
          We protect the Pack, respect the public and care for the places where
          we run. Safety briefings and responsible conduct are part of every
          well-laid Hash.
        </p>
        <ul className="m-0 grid list-none gap-0 border-t border-ink/25 p-0">
          {conductStandards.map((standard) => (
            <li
              key={standard}
              className="flex items-start gap-3 py-3 text-[0.9rem] font-bold"
            >
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {standard}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 12. Contact                                                                */
/* -------------------------------------------------------------------------- */

function ContactSection() {
  return (
    <section
      id={sectionIds.contact}
      aria-labelledby="contact-heading"
      className="on-dark bg-ink px-5 py-20 text-warm-white sm:px-[7vw] sm:py-28"
    >
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-[8vw]">
          <div>
            <SectionLabel index="12" tone="gold">
              Contact
            </SectionLabel>
            <h2 id="contact-heading" className="m-0">
              <SectionHeading tone="light" accent="your people.">
                Find the trail. Find
              </SectionHeading>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-warm-white/65">
              {siteConfig.identity.motto}. Whether you want to join, visit a run
              or simply ask a question about hashing, we would be glad to hear
              from you.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="m-0 mb-4 text-[0.7rem] font-black tracking-[0.12em] text-gold-bright uppercase">
                Reach us
              </h3>
              <address className="grid gap-4 text-sm text-warm-white/70 not-italic">
                <p className="m-0 flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-gold-bright"
                  />
                  {siteConfig.contact.address}
                </p>
                <p className="m-0 flex items-start gap-3">
                  <Mail
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-gold-bright"
                  />
                  <a
                    href={siteConfig.contact.emailHref}
                    className="rounded-sm underline underline-offset-4 transition-colors hover:text-gold-bright"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
                <p className="m-0 flex items-start gap-3">
                  <Phone
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-gold-bright"
                  />
                  <a
                    href={siteConfig.contact.telephoneHref}
                    className="rounded-sm underline underline-offset-4 transition-colors hover:text-gold-bright"
                  >
                    {siteConfig.contact.telephoneDisplay}
                  </a>
                </p>
              </address>
              <p className="mt-6 mb-0 text-[0.7rem] text-warm-white/45">
                {siteConfig.identity.motto} · {siteConfig.identity.rallyingCall}
              </p>
            </div>

            <div>
              <h3 className="m-0 mb-4 text-[0.7rem] font-black tracking-[0.12em] text-gold-bright uppercase">
                Registration
              </h3>
              <dl className="m-0 grid gap-2 text-[0.78rem] text-warm-white/60">
                <div>
                  <dt className="font-bold text-warm-white/85">Registered with</dt>
                  <dd className="m-0">{siteConfig.registration.authority}</dd>
                </div>
                <div>
                  <dt className="font-bold text-warm-white/85">Incorporated</dt>
                  <dd className="m-0">
                    {siteConfig.registration.incorporationDate}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-warm-white/85">Legal form</dt>
                  <dd className="m-0">{siteConfig.registration.legalForm}</dd>
                </div>
                <div>
                  <dt className="font-bold text-warm-white/85">Company number</dt>
                  <dd className="m-0 font-mono break-all">
                    {siteConfig.registration.companyNumber}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-warm-white/85">Founded</dt>
                  <dd className="m-0">
                    {siteConfig.identity.established} by{" "}
                    {siteConfig.identity.founderCount} founding members
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function HomePage() {
  return (
    <main>
      <SiteHeader />
      <ConceptNotice />

      <Hero />
      <AboutSection />
      <NextHashSection />
      <HashingSection />
      <PillarsSection />
      <RecentRunsSection />
      <GalleryPreviewSection />
      <MembershipSection />
      <FaqSection />
      <ConductSection />
      <ContactSection />

      <SiteFooter />
    </main>
  );
}
