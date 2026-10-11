import { useLocation } from "react-router-dom";
import { FileText, Lock } from "lucide-react";

import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gallerySections } from "@/data/navigation";
import {
  hasPublicPublications,
  publicPublications,
  publicationsEmptyState,
  sortPublicationsByDate,
  viewOnlyPublications,
  type Publication,
} from "@/data/publications";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/** One publication card. Renders a download only when one is permitted. */
function PublicationCard({ publication }: { publication: Publication }) {
  const downloadable = publication.downloadAllowed && Boolean(publication.fileUrl);

  return (
    <article className="flex h-full flex-col border border-ink/15 bg-pure-white">
      {publication.coverImage ? (
        <img
          src={publication.coverImage}
          alt=""
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm border-ink/25 text-[0.6rem] font-black tracking-[0.1em] uppercase"
          >
            {publication.type}
          </Badge>
          {publication.isDemo && (
            <Badge className="rounded-sm border-0 bg-gold-bright text-[0.6rem] font-black tracking-[0.1em] text-ink uppercase">
              {demoLabels.publication}
            </Badge>
          )}
        </div>

        <h2 className="mt-4 mb-0 text-[1.1rem] font-black tracking-[0.02em] uppercase">
          {publication.title}
        </h2>

        {publication.publicationDate && (
          <p className="mt-2 mb-0 text-[0.72rem] font-bold tracking-[0.1em] text-muted-gray uppercase">
            {publication.publicationDate}
          </p>
        )}

        <p className="mt-4 mb-0 leading-relaxed text-muted-gray">
          {publication.description}
        </p>

        {downloadable ? (
          <Button
            asChild
            className="mt-6 h-auto w-full justify-center rounded-sm bg-ink py-3.5 text-[0.74rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
          >
            <a href={publication.fileUrl ?? "#"} download>
              Download
            </a>
          </Button>
        ) : (
          /* View-only: publication is public but downloading is not permitted,
             so no link and no dead download button is rendered. */
          <p className="mt-6 inline-flex items-center gap-2 border border-ink/15 px-4 py-3 text-[0.7rem] font-black tracking-[0.08em] text-muted-gray uppercase">
            <Lock aria-hidden="true" className="size-3.5" />
            View only — download not permitted
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Publications.
 *
 * Two independent gates protect every document: the record must be `published`
 * *and* carry `publicationPermissionConfirmed`. Legal material therefore stays
 * off the public site by default, and no download control is ever rendered for
 * a document the club has not approved for download.
 */
export function PublicationsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "Publications",
    `Approved ${siteConfig.identity.name} documents. Nothing is published or downloadable until the club confirms publication permission.`,
  );

  const documents = [
    ...sortPublicationsByDate(publicPublications),
    ...viewOnlyPublications,
  ];

  return (
    <main>
      <SiteHeader />

      <PageHero
        eyebrow="Gallery · Publications"
        title="Documents the"
        accent="club has approved."
        description="Only documents the club has explicitly approved for publication appear here, and a download is offered only where downloading is permitted."
        parent={{ label: "Gallery overview", to: "/gallery" }}
        watermark="DOCS"
      />

      <SectionSubnav
        sections={gallerySections}
        pathname={pathname}
        label="Gallery sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        {hasPublicPublications ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((publication) => (
              <StaggerItem key={publication.id}>
                <PublicationCard publication={publication} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <EmptyState
              icon={FileText}
              heading={publicationsEmptyState.heading}
              body={publicationsEmptyState.body}
              note={
                <p className="mx-auto max-w-lg">
                  Legal and constitutional documents stay private on the public
                  website until publication permission has been confirmed in
                  writing.
                </p>
              }
              action={{ label: "Contact WWH3", to: `/#${sectionIds.contact}` }}
            />
          </Reveal>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
