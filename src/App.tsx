import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { PageTransition } from "@/components/motion/PageTransition";
import { Toaster } from "@/components/ui/sonner";
import { useHashScroll } from "@/hooks/useHashScroll";
import { CoveragePage } from "@/pages/CoveragePage";
import { DonorsPage } from "@/pages/DonorsPage";
import { EventsPage } from "@/pages/EventsPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { HomePage } from "@/pages/HomePage";
import { MembershipPage } from "@/pages/MembershipPage";
import { NewsPage } from "@/pages/NewsPage";
import { PartnershipsPage } from "@/pages/PartnershipsPage";
import { PhotosPage } from "@/pages/PhotosPage";
import { PublicationsPage } from "@/pages/PublicationsPage";
import { RunStoryPage } from "@/pages/RunStoryPage";
import { RunsPage } from "@/pages/RunsPage";
import { TrendsPage } from "@/pages/TrendsPage";

/**
 * Resets scroll on navigation.
 *
 * Only runs for hash-less navigations — `useHashScroll` owns the case where a
 * hash is present, so the two behaviours never fight each other.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && hash !== "#") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useHashScroll();

  return (
    <>
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/runs/:slug" element={<RunStoryPage />} />

          {/* `/gallery` is a real overview page rather than a redirect, so the
              dropdown trigger and search engines both have a hub destination. */}
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/photos" element={<PhotosPage />} />
          <Route path="/gallery/events" element={<EventsPage />} />
          <Route path="/gallery/publications" element={<PublicationsPage />} />
          <Route path="/gallery/news" element={<NewsPage />} />

          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/partnerships" element={<PartnershipsPage />} />
          <Route path="/membership/donors" element={<DonorsPage />} />
          <Route path="/membership/trends" element={<TrendsPage />} />
          <Route path="/membership/coverage" element={<CoveragePage />} />

          {/* Unknown paths redirect home with a clean URL rather than silently
              rendering the homepage at the wrong address. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>

      <Toaster position="bottom-right" />
    </>
  );
}
