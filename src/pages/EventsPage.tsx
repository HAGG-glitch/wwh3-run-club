import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";

import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  eventsEmptyState,
  hasPublishedEvents,
  publishedEvents,
  sortEventsByDate,
  type ClubEvent,
} from "@/data/events";
import { gallerySections } from "@/data/navigation";
import { getRunBySlug } from "@/data/runs";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/** One event card. Renders a registration link only when one exists. */
function EventCard({ event }: { event: ClubEvent }) {
  const run = event.runSlug ? getRunBySlug(event.runSlug) : undefined;

  return (
    <article className="flex h-full flex-col border border-ink/15 bg-pure-white">
      {event.coverImage ? (
        <img
          src={event.coverImage}
          alt=""
          loading="lazy"
          className="h-52 w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm border-ink/25 text-[0.6rem] font-black tracking-[0.1em] uppercase"
          >
            {event.status}
          </Badge>
          {event.isDemo && (
            <Badge className="rounded-sm border-0 bg-gold-bright text-[0.6rem] font-black tracking-[0.1em] text-ink uppercase">
              {demoLabels.event}
            </Badge>
          )}
        </div>

        <h2 className="mt-4 mb-0 text-[1.15rem] font-black tracking-[0.02em] uppercase">
          {event.title}
        </h2>

        <dl className="mt-4 grid gap-1.5 text-[0.78rem] text-muted-gray">
          {event.date ? (
            <div className="flex gap-2">
              <dt className="font-bold text-ink">Date</dt>
              <dd className="m-0">{event.date}</dd>
            </div>
          ) : null}
          {event.time ? (
            <div className="flex gap-2">
              <dt className="font-bold text-ink">Time</dt>
              <dd className="m-0">{event.time}</dd>
            </div>
          ) : null}
          {event.location ? (
            <div className="flex gap-2">
              <dt className="font-bold text-ink">Location</dt>
              <dd className="m-0">{event.location}</dd>
            </div>
          ) : null}
        </dl>

        <p className="mt-4 mb-0 leading-relaxed text-muted-gray">
          {event.description}
        </p>

        {run && run.galleryImages.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {run.galleryImages.map((image) => (
              <img
                key={image}
                src={image}
                alt=""
                loading="lazy"
                className="h-20 w-full object-cover"
              />
            ))}
          </div>
        ) : null}

        {run ? (
          <Button
            asChild
            className="mt-5 h-auto w-full justify-center rounded-sm bg-ink py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
          >
            <Link to={`/runs/${run.slug}`}>
              View the photographs
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ) : null}

        {event.registrationLink ? (
          <Button
            asChild
            className="mt-6 h-auto w-full justify-center rounded-sm bg-ink py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
          >
            <a href={event.registrationLink} rel="noopener noreferrer">
              Register
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Events.
 *
 * Data-driven from `src/data/events.ts`. No event records exist yet, so the page
 * renders the honest empty state rather than an invented club calendar. Each
 * record carries title, slug, date, time, location, description, cover image,
 * status, registration link, published flag and demo flag, so adding a confirmed
 * event is a data-only change.
 */
export function EventsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Events",
    `Confirmed ${siteConfig.identity.name} events with dates, times and locations. Listed only once details are confirmed by the club.`,
  );

  const events = sortEventsByDate(publishedEvents);

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Gallery · Events"
        title="Dates the club"
        accent="has confirmed."
        description="Events appear here only when the date, time and location have been confirmed by the club. Anything still being planned is not listed."
        parent={{ label: "Gallery overview", to: "/gallery" }}
        watermark="WHEN"
      />

      <SectionSubnav
        sections={gallerySections}
        pathname={pathname}
        label="Gallery sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        {hasPublishedEvents ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <StaggerItem key={event.id}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <EmptyState
              icon={CalendarDays}
              heading={eventsEmptyState.heading}
              body={eventsEmptyState.body}
              action={{ label: "Contact WWH3", to: `/#${sectionIds.contact}` }}
            />
          </Reveal>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
