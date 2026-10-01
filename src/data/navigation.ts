/**
 * Central navigation configuration.
 *
 * The single source of truth for the site's primary navigation. `SiteHeader`,
 * `SiteFooter` and the Gallery/Membership overview pages all read from here, so
 * a new destination is added once and appears everywhere.
 *
 * Each dropdown entry also carries its own `to` path, which lets the dropdown
 * trigger double as a link to the section overview while the menu opens a
 * separate list of child pages.
 */

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Camera,
  FileText,
  Handshake,
  HeartHandshake,
  MapPinned,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";

import { hasPublishedDonors } from "@/data/donors";
import { hasPublishedEvents } from "@/data/events";
import { hasApprovedPhotography } from "@/data/gallery";
import { hasPublishedNews } from "@/data/news";
import { hasPublishedPartners } from "@/data/partners";
import { hasPublicPublications } from "@/data/publications";
import { sectionIds } from "@/data/siteConfig";

/* -------------------------------------------------------------------------- */
/* Shapes                                                                     */
/* -------------------------------------------------------------------------- */

export type NavChild = {
  label: string;
  /** Absolute in-app route. */
  to: string;
  /** One-line summary shown inside the dropdown. */
  description: string;
};

export type NavEntry =
  | { kind: "link"; label: string; to: string }
  | {
      kind: "dropdown";
      label: string;
      /** Overview route for the whole section. */
      to: string;
      children: readonly NavChild[];
    };

/** A navigable destination that also backs an overview card. */
export type SectionDescriptor = NavChild & {
  /** Lucide icon for the overview card. */
  icon: LucideIcon;
  /**
   * Whether this section currently has published records. Used to show an
   * honest "awaiting content" state on overview cards.
   */
  hasRecords: boolean;
};

/* -------------------------------------------------------------------------- */
/* Section descriptors                                                        */
/* -------------------------------------------------------------------------- */

export const gallerySections: readonly SectionDescriptor[] = [
  {
    label: "Photos",
    to: "/gallery/photos",
    description:
      "Photographs from runs and Circles, published only with consent.",
    icon: Camera,
    hasRecords: hasApprovedPhotography,
  },
  {
    label: "Events",
    to: "/gallery/events",
    description:
      "Confirmed club events, with dates, locations and registration details.",
    icon: CalendarDays,
    hasRecords: hasPublishedEvents,
  },
  {
    label: "Publications",
    to: "/gallery/publications",
    description:
      "Approved club documents, published only when publication is permitted.",
    icon: FileText,
    hasRecords: hasPublicPublications,
  },
  {
    label: "News",
    to: "/gallery/news",
    description: "WWH3 stories, announcements and club updates.",
    icon: Newspaper,
    hasRecords: hasPublishedNews,
  },
] as const;

export const membershipSections: readonly SectionDescriptor[] = [
  {
    label: "Membership",
    to: "/membership",
    description: "Requirements, the application process and how to join.",
    icon: Users,
    hasRecords: true,
  },
  {
    label: "Partnerships",
    to: "/membership/partnerships",
    description: "Confirmed partner organisations and supporters.",
    icon: Handshake,
    hasRecords: hasPublishedPartners,
  },
  {
    label: "Donors",
    to: "/membership/donors",
    description:
      "Approved donor and supporter recognition, published with permission.",
    icon: HeartHandshake,
    hasRecords: hasPublishedDonors,
  },
  {
    label: "Membership Trends",
    to: "/membership/trends",
    description:
      "Aggregated membership statistics, published once verified.",
    icon: TrendingUp,
    hasRecords: false,
  },
  {
    label: "Coverage",
    to: "/membership/coverage",
    description: "The club's confirmed base and areas of activity.",
    icon: MapPinned,
    hasRecords: true,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Primary navigation                                                         */
/* -------------------------------------------------------------------------- */

export const galleryNavChildren: readonly NavChild[] = gallerySections.map(
  ({ label, to, description }) => ({ label, to, description }),
);

export const membershipNavChildren: readonly NavChild[] =
  membershipSections.map(({ label, to, description }) => ({ label, to, description }));

export const primaryNav: readonly NavEntry[] = [
  { kind: "link", label: "Home", to: "/" },
  { kind: "link", label: "About", to: `/#${sectionIds.about}` },
  { kind: "link", label: "Runs", to: "/runs" },
  { kind: "dropdown", label: "Gallery", to: "/gallery", children: galleryNavChildren },
  {
    kind: "dropdown",
    label: "Membership",
    to: "/membership",
    children: membershipNavChildren,
  },
  { kind: "link", label: "Contact", to: `/#${sectionIds.contact}` },
] as const;

/* -------------------------------------------------------------------------- */
/* Active-state helpers                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Whether a top-level entry represents the current page.
 *
 * Section dropdowns stay highlighted anywhere beneath their overview route, so
 * "Gallery" is marked active on `/gallery/photos` as well as `/gallery`.
 */
export function isNavEntryActive(entry: NavEntry, pathname: string): boolean {
  if (entry.kind === "link") {
    return entry.to === "/" ? pathname === "/" : pathname === entry.to;
  }

  return pathname === entry.to || pathname.startsWith(`${entry.to}/`);
}

/** Whether a dropdown child represents the current page. */
export function isNavChildActive(child: NavChild, pathname: string): boolean {
  return pathname === child.to;
}

/**
 * Flattens the navigation into plain links for the footer.
 *
 * A dropdown contributes its own overview link plus each child, so every
 * destination stays reachable from the footer without a second link list.
 *
 * Deduplicated by route, because a section's first child can be the overview
 * itself (Membership does this) and would otherwise render twice.
 */
export function flattenNav(
  entries: readonly NavEntry[] = primaryNav,
): readonly NavChild[] {
  const flattened = entries.flatMap((entry) =>
    entry.kind === "dropdown"
      ? [
          { label: entry.label, to: entry.to, description: "" },
          ...entry.children,
        ]
      : [{ label: entry.label, to: entry.to, description: "" }],
  );

  const seen = new Set<string>();

  return flattened.filter((item) => {
    if (seen.has(item.to)) return false;
    seen.add(item.to);
    return true;
  });
}
