import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Footprints,
  MapPin,
  Mountain,
  Rabbit,
  Timer,
  type LucideIcon,
} from "lucide-react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getRunBySlug } from "@/data/runs";
import { demoLabels } from "@/lib/demoLabels";

export function RunStoryPage() {
  const { slug } = useParams();
  const run = getRunBySlug(slug);

  // Unknown slug -> send the visitor back to the archive rather than rendering
  // an empty page.
  if (!run) return <Navigate to="/runs" replace />;

  /* Built from whatever this run actually has. Optional fields are skipped
     rather than rendered as "null" or an empty rule. */
  type RunStat = { label: string; value: string; icon: LucideIcon };

  const statCandidates: Array<RunStat | null> = [
    run.date ? { label: "Date", value: run.date, icon: CalendarDays } : null,
    run.startTime
      ? { label: "Start time", value: run.startTime, icon: Timer }
      : null,
    run.meetingLocation
      ? { label: "Location", value: run.meetingLocation, icon: MapPin }
      : null,
    run.distance
      ? { label: "Distance", value: run.distance, icon: Footprints }
      : null,
    run.terrain ? { label: "Terrain", value: run.terrain, icon: Mountain } : null,
    run.hares.length > 0
      ? {
          label: run.hares.length > 1 ? "Hares" : "Hare",
          value: run.hares.join(", "),
          icon: Rabbit,
        }
      : null,
  ];

  const stats = statCandidates.filter((stat): stat is RunStat => stat !== null);

  /* Built from the fields this run actually has, so a real record with no
     difficulty does not render a dangling separator. */
  const kicker = [
    run.hashNumber ? `Hash #${run.hashNumber}` : null,
    run.difficulty,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main>
      <SiteHeader />

      <section className="on-dark relative h-[26rem] overflow-hidden bg-ink text-warm-white sm:h-[42rem]">
        <img
          src={run.coverImage}
          alt={run.title}
          className="size-full object-cover motion-safe:animate-hero-image-in"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,12,14,.92),rgba(10,12,14,.08)_70%)]"
        />
        <div className="absolute inset-x-0 bottom-0 z-2 px-5 pb-12 sm:px-[7vw] sm:pb-16">
          <Link
            to="/runs"
            className="mb-8 inline-flex items-center gap-2 rounded-sm text-[0.72rem] font-black tracking-[0.08em] uppercase transition-colors hover:text-gold-bright"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Hash Log
          </Link>
          <div className="mb-4 flex flex-wrap gap-2">
            {run.isDemo && (
              <>
                <Badge className="rounded-sm border-0 bg-gold-bright font-black tracking-[0.09em] text-ink uppercase">
                  {demoLabels.record}
                </Badge>
                <Badge className="rounded-sm border-0 bg-warm-white/20 font-black tracking-[0.09em] text-warm-white uppercase">
                  {demoLabels.story}
                </Badge>
                <Badge className="rounded-sm border-0 bg-warm-white/20 font-black tracking-[0.09em] text-warm-white uppercase">
                  {demoLabels.photo}
                </Badge>
              </>
            )}
          </div>
          <p className="m-0 mb-2 text-[0.75rem] font-black tracking-[0.12em] text-warm-white/75 uppercase">
            {kicker}
          </p>
          <h1 className="editorial-display m-0 max-w-4xl text-[clamp(2.5rem,8vw,8rem)]">
            {run.title}
          </h1>
        </div>
      </section>

      {stats.length > 0 && (
        <section
          aria-label="Run details"
          className="grid gap-px bg-ink/20 px-5 sm:grid-cols-2 sm:px-[7vw] lg:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="grid grid-cols-[1.75rem_1fr] items-center gap-x-3 bg-gold-bright px-5 py-5"
            >
              <Icon aria-hidden="true" className="row-span-2 size-5" />
              <span className="text-[0.62rem] font-black tracking-[0.09em] text-ink/60 uppercase">
                {label}
              </span>
              <strong className="text-[0.92rem]">{value}</strong>
            </div>
          ))}
        </section>
      )}

      <article className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-[8vw]">
          <Reveal>
            <p className="m-0 text-[clamp(1.3rem,2.4vw,2.1rem)] leading-[1.35] font-semibold text-ink">
              {run.summary}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="space-y-6 text-[1.05rem] leading-[1.85] text-muted-gray">
              {run.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {run.memorableMoments.length > 0 && (
          <Reveal delay={0.05} className="mt-14 border-t border-ink/15 pt-10">
            <h2 className="m-0 mb-6 text-[0.7rem] font-black tracking-[0.14em] uppercase">
              Moments from the trail
            </h2>
            <StaggerGroup
              as="ul"
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3"
            >
              {run.memorableMoments.map((moment, index) => (
                <StaggerItem key={moment} as="li">
                  <div className="flex h-full items-center gap-4 border border-ink/15 p-5">
                    <span className="editorial-display text-[1.5rem] text-gold-deep">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.85rem] font-bold uppercase">
                      {moment}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>
        )}
      </article>

      {/* Every image comes from this run's own galleryImages — never a shared
          hardcoded file. */}
      {run.galleryImages.length > 0 && (
        <section
          aria-label="Photographs from this run"
          className="bg-pure-white px-5 pb-20 sm:px-[7vw] sm:pb-28"
        >
          <Separator className="mb-8 bg-ink/15" />
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="m-0 text-[0.7rem] font-black tracking-[0.14em] uppercase">
              Photographs from this run
            </h2>
            <Link
              to="/gallery/photos"
              className="inline-flex items-center gap-2 border-b border-ink pb-1 text-[0.72rem] font-black tracking-[0.1em] uppercase transition-colors hover:border-gold-deep hover:text-gold-deep"
            >
              Open the full gallery
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {run.galleryImages.map((image, index) => (
              <figure key={`${image}-${index}`} className="m-0">
                <img
                  src={image}
                  alt={`${run.title} — photograph ${index + 1}`}
                  loading="lazy"
                  className="h-[22rem] w-full object-cover sm:h-[28rem]"
                />
                <figcaption className="pt-3 text-[0.66rem] font-bold tracking-[0.08em] text-muted-gray uppercase">
                  {run.isDemo
                    ? "Demo image · replace with approved club photography"
                    : run.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
