import { useLocation } from "react-router-dom";
import { Newspaper } from "lucide-react";

import { ConceptNotice } from "@/components/ConceptNotice";
import { EmptyState, PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Badge } from "@/components/ui/badge";
import { gallerySections } from "@/data/navigation";
import {
  hasPublishedNews,
  newsEmptyState,
  publishedNews,
  sortNewsByDate,
} from "@/data/news";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demoLabels } from "@/lib/demoLabels";

/**
 * News.
 *
 * Data-driven from `src/data/news.ts`. No articles exist, and none are
 * invented: this site has no fabricated stories, no invented authors and no
 * invented publication dates. `author` is nullable in the data model precisely
 * so a name is never filled in to look complete.
 */
export function NewsPage() {
  const { pathname } = useLocation();

  usePageMeta(
    "News",
    `Stories, announcements and updates from ${siteConfig.identity.name}. Nothing is published here until a real article has been written and approved.`,
  );

  const articles = sortNewsByDate(publishedNews);

  return (
    <main>
      <SiteHeader />
      <ConceptNotice />

      <PageHero
        eyebrow="Gallery · News"
        title="Stories from"
        accent="the Pack."
        description="Announcements, run write-ups and club updates. Every article is written and approved before it appears here."
        parent={{ label: "Gallery overview", to: "/gallery" }}
        watermark="NEWS"
      />

      <SectionSubnav
        sections={gallerySections}
        pathname={pathname}
        label="Gallery sections"
      />

      <section className="bg-pure-white px-5 py-20 sm:px-[7vw] sm:py-28">
        {hasPublishedNews ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <StaggerItem key={article.id}>
                <article className="flex h-full flex-col border border-ink/15 bg-pure-white">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                  ) : null}

                  <div className="flex flex-1 flex-col p-6">
                    {article.isDemo && (
                      <Badge className="w-max rounded-sm border-0 bg-gold-bright text-[0.6rem] font-black tracking-[0.1em] text-ink uppercase">
                        {demoLabels.news}
                      </Badge>
                    )}

                    <h2 className="mt-4 mb-0 text-[1.15rem] font-black tracking-[0.02em] uppercase">
                      {article.title}
                    </h2>

                    <p className="mt-3 mb-0 text-[0.7rem] font-bold tracking-[0.1em] text-muted-gray uppercase">
                      {[article.publicationDate, article.author]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <p className="mt-4 mb-0 leading-relaxed text-muted-gray">
                      {article.summary}
                    </p>

                    {article.body.length > 0 && (
                      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-gray">
                        {article.body.map((paragraph, index) => (
                          <p key={index} className="m-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <EmptyState
              icon={Newspaper}
              heading={newsEmptyState.heading}
              body={newsEmptyState.body}
              action={{ label: "Contact WWH3", to: `/#${sectionIds.contact}` }}
            />
          </Reveal>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
