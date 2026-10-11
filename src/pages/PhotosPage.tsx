import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, Expand } from "lucide-react";

import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  displayableGalleryItems,
  featuredGalleryItems,
  type GalleryItem,
} from "@/data/gallery";
import { gallerySections } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/* -------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* -------------------------------------------------------------------------- */

/** Placeholder / publication-status badge. */
function PhotoBadge({ item }: { item: GalleryItem }) {
  if (!item.isDemo && item.consentConfirmed) return null;

  return (
    <Badge className="rounded-sm border-0 bg-gold-bright font-black tracking-[0.09em] text-ink uppercase">
      {demoLabels.photo}
    </Badge>
  );
}

function PhotoCaption({ item }: { item: GalleryItem }) {
  const meta = [item.hashNumber ? `Hash #${item.hashNumber}` : null, item.date, item.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <span className="block text-[0.6rem] font-black tracking-[0.1em] text-gold-bright uppercase">
        {item.category}
      </span>
      <strong className="mt-1 block text-[0.82rem] uppercase">{item.caption}</strong>
      {meta && (
        <span className="mt-1 block text-[0.66rem] text-warm-white/60">{meta}</span>
      )}
      {item.isDemo && (
        <span className="mt-1 block text-[0.62rem] text-warm-white/45">
          Demo photograph
        </span>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Photos — the gallery's photographic archive.
 *
 * Holds the original gallery experience (featured Carousel, grid of tiles,
 * enlarged Dialog preview). Photographs carry consent and publication-status
 * fields, and demo imagery is always labelled, so placeholder photographs are
 * never presented as official WWH3 photography.
 */
export function PhotosPage() {
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null);
  const { pathname } = useLocation();

  usePageMeta(
    "Photos",
    `Photographs from ${siteConfig.identity.name} runs and Circles, published only with consent. Demo images are labelled as placeholders.`,
  );

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Gallery · Photos"
        title="Different trails."
        accent="One Pack."
        description={`A visual home for the runs, Circles, landscapes and brotherhood that shape the ${siteConfig.identity.abbreviation} story.`}
        parent={{ label: "Gallery overview", to: "/gallery" }}
        watermark={
          <>
            ON
            <br />
            <span className="text-gold-bright/50">ON</span>
          </>
        }
      />

      <SectionSubnav
        sections={gallerySections}
        pathname={pathname}
        label="Gallery sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="m-0 text-[0.7rem] font-black tracking-[0.14em] uppercase">
                Life in the Pack
              </h2>
            </div>
            <p className="m-0 max-w-xl leading-relaxed text-muted-gray">
              Photographs were taken by club members and used with the consent of
              everyone shown.
            </p>
          </div>
        </Reveal>

        {/* Featured photographs — the only place the Carousel is used. */}
        {featuredGalleryItems.length > 0 && (
          <Reveal className="mb-16">
            <Carousel
              opts={{ align: "start", loop: false }}
              aria-label="Featured photographs"
              className="on-dark"
            >
              <CarouselContent>
                {featuredGalleryItems.map((item) => (
                  <CarouselItem key={`featured-${item.id}`} className="md:basis-1/2 lg:basis-1/3">
                    <figure className="group relative m-0 overflow-hidden bg-charcoal">
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        width={item.width}
                        height={item.height}
                        className="h-[22rem] w-full object-cover sm:h-[26rem]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(10,12,14,.92))] p-5 text-warm-white">
                        <PhotoCaption item={item} />
                      </div>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-6 flex items-center gap-4">
                <CarouselPrevious className="rounded-sm border-warm-white/25 bg-transparent text-warm-white hover:bg-gold-bright hover:text-ink" />
                <CarouselNext className="rounded-sm border-warm-white/25 bg-transparent text-warm-white hover:bg-gold-bright hover:text-ink" />
              </div>
            </Carousel>
          </Reveal>
        )}

        {/* Full gallery — each tile opens an enlarged Dialog. */}
        {displayableGalleryItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayableGalleryItems.map((item) => (
              <figure key={item.id} className="m-0">
                <button
                  type="button"
                  onClick={() => setOpenItem(item)}
                  aria-label={`Enlarge photograph: ${item.caption}`}
                  className="group relative block h-full w-full cursor-zoom-in overflow-hidden bg-charcoal text-left"
                >
                      {/* width/height let the browser reserve the tile before the
                          JPEG arrives, so the grid does not reflow as it loads. */}
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        width={item.width}
                        height={item.height}
                        className="h-[17rem] w-full object-cover opacity-100 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-105 motion-safe:group-hover:opacity-85"
                      />
                  <span className="absolute top-3 left-3">
                    <PhotoBadge item={item} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-3 bottom-3 grid size-9 place-items-center bg-ink/85 text-warm-white opacity-0 transition-opacity group-hover:opacity-100 motion-safe:group-hover:opacity-100"
                  >
                    <Expand className="size-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(transparent,rgba(10,12,14,.92))] p-4 text-warm-white">
                    <span className="min-w-0">
                      <span className="block text-[0.6rem] font-black tracking-[0.1em] text-gold-bright uppercase">
                        {item.category}
                      </span>
                      <strong className="mt-0.5 block truncate text-[0.82rem] uppercase">
                        {item.caption}
                      </strong>
                    </span>
                    <span className="shrink-0 text-[0.62rem] text-warm-white/50">
                      View
                    </span>
                  </span>
                </button>
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Camera}
            heading="No photographs have been published yet."
            body="Approved photographs from completed runs will appear here once consent has been confirmed."
          />
        )}
      </section>

      <section className="grid gap-10 bg-gold-bright px-5 py-20 sm:px-[7vw] sm:py-24 lg:grid-cols-[1fr_.7fr] lg:gap-[9vw]">
        <Reveal>
          <span className="text-[0.7rem] font-black tracking-[0.12em] uppercase">
            Photography standard
          </span>
          <h2 className="editorial-display mt-3 mb-0 text-[clamp(2.4rem,5.6vw,5.6rem)]">
            People first.
            <br />
            Pictures second.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="leading-relaxed">
            Club photographs should only be published with appropriate consent.
            Captions can document the Hash number, date, location, Hares and a
            short memory from the trail.
          </p>
          <Button
            asChild
            className="h-auto rounded-sm bg-ink px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
          >
            <Link to="/runs">
              Explore Hash Log
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Enlarged photograph. Radix Dialog traps focus, closes on Escape and
          restores focus to the tile that opened it. */}
      <Dialog
        open={openItem !== null}
        onOpenChange={(open) => !open && setOpenItem(null)}
      >
        <DialogContent
          data-testid="gallery-dialog"
          className="on-dark max-h-[92vh] w-[94vw] max-w-4xl gap-4 overflow-y-auto rounded-sm border-warm-white/20 bg-ink p-5 text-warm-white sm:p-6"
        >
          <DialogTitle className="text-base font-black tracking-[0.04em] uppercase">
            {openItem?.caption}
          </DialogTitle>
          <DialogDescription className="text-sm text-warm-white/65">
            {openItem
              ? [openItem.category, openItem.date, openItem.location]
                  .filter(Boolean)
                  .join(" · ")
              : null}
          </DialogDescription>

          {openItem && (
            <img
              src={openItem.image}
              alt={openItem.alt}
              width={openItem.width}
              height={openItem.height}
              /* The lightbox is the one place the full file is wanted, so it is
                 fetched eagerly rather than deferred until the grid loads. */
              loading="eager"
              decoding="async"
              className="max-h-[52vh] w-full object-contain"
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <PhotoBadge item={openItem ?? displayableGalleryItems[0]} />
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-auto rounded-sm border-warm-white/30 bg-transparent px-5 py-3 text-[0.72rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-warm-white hover:text-ink"
              >
                <ArrowLeft aria-hidden="true" />
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </main>
  );
}
