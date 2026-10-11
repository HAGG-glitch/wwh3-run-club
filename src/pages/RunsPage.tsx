import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import {
  Eyebrow,
  SectionHeading,
  SectionLabel,
} from "@/components/SectionPrimitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  hasConfirmedUpcomingRuns,
  publishedRuns,
  upcomingRuns,
} from "@/data/runs";
import { nextHashPending, siteConfig } from "@/data/siteConfig";
import { demoLabels } from "@/lib/demoLabels";

export function RunsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="on-dark relative flex min-h-[32rem] items-center overflow-hidden bg-ink px-5 py-16 text-warm-white sm:px-[7vw]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(110deg,transparent_45%,var(--color-gold)_45%_47%,transparent_47%),repeating-linear-gradient(0deg,transparent_0_34px,rgba(255,255,255,0.08)_34px_35px)]"
        />
        <div className="relative z-2 max-w-3xl">
          <Eyebrow tone="light">Run archive</Eyebrow>
          <h1 className="editorial-display m-0 text-[clamp(3rem,9vw,9rem)]">
            Every trail
            <br />
            leaves a <em className="text-gold-bright not-italic">story.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-warm-white/70">
            Browse the Hash Log to see how completed runs will be documented
            once confirmed records and approved club photography are supplied.
          </p>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[7vw] bottom-16 text-right text-[clamp(3.5rem,9vw,9rem)] leading-[0.72] text-warm-white/12 select-none [font-family:var(--font-display)]"
        >
          HASH
          <br />
          <span className="text-gold-bright/50">LOG</span>
        </span>
      </section>

      {/* Completed runs */}
      <section
        aria-labelledby="archive-heading"
        className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28"
      >
        <Reveal>
          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.62fr] lg:items-end lg:gap-[8vw]">
            <div>
              <SectionLabel index="01">Completed trails</SectionLabel>
              <h2 id="archive-heading" className="m-0">
                <SectionHeading accent="runs.">
                  The recent
                </SectionHeading>
              </h2>
            </div>
            <p className="m-0 leading-relaxed text-muted-gray">
              These entries use demonstration content and placeholder
              photography. Replace each record with the club&apos;s confirmed run
              history when it is ready.
            </p>
          </div>
        </Reveal>

        <StaggerGroup as="ul" className="m-0 list-none border-t border-ink/15 p-0">
          {publishedRuns.map((run) => (
            <StaggerItem key={run.id} as="li">
              <Card className="group relative rounded-sm border-0 border-b border-ink/15 bg-transparent shadow-none">
                <CardContent className="grid items-center gap-6 p-0 sm:grid-cols-[11rem_4rem_1fr_0.8fr_1.5rem] sm:gap-7">
                  <div className="relative h-28 overflow-hidden bg-charcoal sm:h-30">
                    <img
                      src={run.coverImage}
                      alt={`${run.title} — ${demoLabels.photo}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                    {run.isDemo && (
                      <Badge className="absolute top-2 left-2 rounded-sm border-0 bg-gold-bright font-black tracking-[0.09em] text-ink uppercase">
                        {demoLabels.photo}
                      </Badge>
                    )}
                  </div>

                  <span className="editorial-display text-[1.7rem] text-gold-deep sm:text-[2.2rem]">
                    #{run.hashNumber}
                  </span>

                  <div className="min-w-0">
                    <p className="m-0 flex flex-wrap items-center gap-2 text-[0.64rem] font-black tracking-[0.09em] text-muted-gray uppercase">
                      <span>
                        {run.date} · {run.difficulty}
                      </span>
                      {run.isDemo && (
                        <Badge
                          variant="outline"
                          className="rounded-sm border-ink/30 font-black tracking-[0.09em] text-muted-gray uppercase"
                        >
                          {demoLabels.record}
                        </Badge>
                      )}
                    </p>
                    <h3 className="mt-1 mb-1.5 text-[1.15rem] uppercase">
                      <Link
                        to={`/runs/${run.slug}`}
                        className="rounded-sm after:absolute after:inset-0 transition-colors hover:text-gold-deep"
                      >
                        {run.title}
                      </Link>
                    </h3>
                    <p className="m-0 hidden text-sm text-muted-gray sm:block">
                      {run.summary}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-gray">
                      <MapPin aria-hidden="true" className="size-4 shrink-0" />
                      {run.meetingLocation}
                    </span>
                    <strong className="text-[0.8rem] uppercase">
                      {run.distance}
                    </strong>
                  </div>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden size-6 text-muted-gray transition-[transform,color] duration-250 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-deep sm:block"
                  />
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Upcoming runs — honest empty state until WWH3 confirms a schedule */}
      <section
        aria-labelledby="upcoming-heading"
        className="on-dark bg-ink px-5 py-20 text-warm-white sm:px-[7vw] sm:py-28"
      >
        <Reveal>
          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.62fr] lg:items-end lg:gap-[8vw]">
            <div>
              <SectionLabel index="02" tone="gold">
                Coming up
              </SectionLabel>
              <h2 id="upcoming-heading" className="m-0">
                <SectionHeading tone="light" accent="Friday.">
                  Find the next
                </SectionHeading>
              </h2>
            </div>
            <p className="m-0 leading-relaxed text-warm-white/60">
              {siteConfig.schedule.note}
            </p>
          </div>
        </Reveal>

        {hasConfirmedUpcomingRuns ? (
          <StaggerGroup className="grid gap-4 md:grid-cols-3">
            {upcomingRuns.map((run) => (
              <StaggerItem key={run.id} as="article" className="h-full">
                <Card className="group flex h-full min-h-[22rem] flex-col rounded-sm border-warm-white/20 bg-transparent shadow-none transition-colors duration-300 hover:bg-gold-bright hover:text-ink">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex justify-between text-[0.66rem] font-black tracking-[0.1em] uppercase">
                      <span>Hash #{run.hashNumber}</span>
                      {run.isDemo && <span>Demo schedule</span>}
                    </div>
                    <span className="editorial-display my-8 text-[5rem] leading-none text-gold-bright transition-colors group-hover:text-ink">
                      {new Date(run.date ?? "").getDay() === 5 ? "FRI" : ""}
                    </span>
                    <h3 className="mt-auto mb-2 text-[1.25rem] uppercase">
                      {run.title}
                    </h3>
                    <p className="m-0 mb-4 flex items-center gap-2 text-sm text-warm-white/60 group-hover:text-ink/65">
                      <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                      {run.date}
                    </p>
                    <div className="flex flex-col gap-1 border-t border-current pt-4 text-[0.75rem]">
                      <span>{run.meetingLocation}</span>
                      <strong>
                        {run.distance} · {run.difficulty}
                      </strong>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          /* No confirmed schedule exists. Rather than publishing invented dates,
             show a Card-based empty state that points to contact details. */
          <Reveal>
            <Card
              data-testid="upcoming-empty"
              className="max-w-2xl rounded-sm border-warm-white/20 bg-transparent shadow-none"
            >
              <CardContent className="p-7">
                <Badge className="mb-4 rounded-sm border-0 bg-gold-bright font-black tracking-[0.09em] text-ink uppercase">
                  Awaiting confirmation
                </Badge>
                <h3 className="m-0 text-xl font-black tracking-[0.02em] text-warm-white uppercase">
                  {nextHashPending.heading}
                </h3>
                <p className="mt-3 mb-5 max-w-lg leading-relaxed text-warm-white/65">
                  {nextHashPending.body} Regular Hash runs are held{" "}
                  {siteConfig.schedule.frequency.toLowerCase()} on{" "}
                  {siteConfig.schedule.regularDay}s.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="h-auto rounded-sm bg-gold-bright px-5 py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-warm-white"
                  >
                    <a href={siteConfig.contact.emailHref}>
                      Email {siteConfig.identity.abbreviation}
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto rounded-sm border-warm-white/30 bg-transparent px-5 py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-warm-white hover:text-ink"
                  >
                    <a href={siteConfig.contact.telephoneHref}>
                      Call {siteConfig.contact.telephoneDisplay}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        )}
      </section>

      <section className="flex flex-col items-start gap-8 bg-gold-bright px-5 py-20 sm:px-[7vw] sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[0.7rem] font-black tracking-[0.12em] uppercase">
            Beyond the run
          </span>
          <h2 className="editorial-display mt-3 mb-0 text-[clamp(2.6rem,6.4vw,6.6rem)]">
            See the Pack
            <br />
            in motion.
          </h2>
        </div>
        <Button
          asChild
          className="h-auto rounded-sm bg-ink px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
        >
          <Link to="/gallery">
            View gallery
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </section>

      <SiteFooter />
    </main>
  );
}
