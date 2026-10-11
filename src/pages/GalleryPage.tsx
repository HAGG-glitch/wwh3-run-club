import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Button } from "@/components/ui/button";
import { gallerySections } from "@/data/navigation";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";

/**
 * Gallery overview.
 *
 * `/gallery` is kept as the section landing page rather than redirected, so the
 * dropdown trigger has a meaningful destination and search engines get a hub
 * page. The four categories come from the central navigation config, so the
 * cards cannot drift out of sync with the dropdown.
 */
export function GalleryPage() {
  usePageMeta(
    "Gallery",
    `Photographs, events, publications and news from ${siteConfig.identity.name}. Each section states honestly when no approved content has been published yet.`,
  );

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="The gallery"
        title="Everything the"
        accent="club publishes."
        description="Four sections, each built to be added to as the club approves real content. Where nothing has been approved yet, this site says so rather than filling the gap."
        watermark={
          <>
            ON
            <br />
            <span className="text-gold-bright/50">ON</span>
          </>
        }
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-[0.7rem] font-black tracking-[0.14em] uppercase">
              Four sections
            </h2>
            <p className="mt-4 leading-relaxed text-muted-gray">
              Sections marked &ldquo;awaiting content&rdquo; have no approved
              records yet. They will appear here as soon as the club supplies
              them.
            </p>
          </div>
        </Reveal>

        <StaggerGroup className="grid gap-5 sm:grid-cols-2">
          {gallerySections.map((section) => {
            const Icon = section.icon;

            return (
              <StaggerItem key={section.to}>
                <Link
                  to={section.to}
                  className="group flex h-full flex-col border border-ink/15 bg-pure-white p-7 transition-colors hover:border-gold-deep focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon aria-hidden="true" className="size-8 text-gold-deep" />
                    {!section.hasRecords && (
                      <span className="border border-ink/20 px-2.5 py-1 text-[0.6rem] font-black tracking-[0.12em] text-muted-gray uppercase">
                        Awaiting content
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 mb-0 text-[1.3rem] font-black tracking-[0.02em] uppercase">
                    {section.label}
                  </h3>
                  <p className="mt-3 mb-0 flex-1 leading-relaxed text-muted-gray">
                    {section.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-[0.72rem] font-black tracking-[0.1em] uppercase transition-colors group-hover:border-gold-deep group-hover:text-gold-deep">
                    Open {section.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <section className="on-dark bg-ink px-5 py-20 text-warm-white sm:px-[7vw] sm:py-24">
        <Reveal>
          <h2 className="editorial-display m-0 max-w-3xl text-[clamp(2.2rem,5.4vw,5rem)]">
            Nothing is published
            <br />
            <em className="text-gold-bright not-italic">
              before it is approved.
            </em>
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-warm-white/70">
            Photographs require consent. Documents require publication
            permission. Events require confirmed dates. Until each is true, the
            section says what is missing instead of inventing a record.
          </p>
          <Button
            asChild
            className="mt-8 h-auto rounded-sm bg-gold-bright px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-ink uppercase hover:bg-warm-white"
          >
            <Link to={`/#${sectionIds.contact}`}>
              Contact the club
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
