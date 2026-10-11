/**
 * Confirmed WWH3 club information.
 *
 * Everything in this file has been supplied and confirmed by the club. Content
 * that has NOT been confirmed lives in CONTENT_NEEDED.md and must never be
 * invented here — it is either omitted or explicitly marked as a placeholder.
 */

import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Footprints,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

export type SocialLink = {
  /** Platform name, used as the accessible label. */
  label: string;
  href: string;
  /** Lucide icon name resolved in `SiteFooter`. */
  icon: "facebook" | "instagram" | "whatsapp" | "mail" | "phone" | "tiktok";
};

export type Registration = {
  authority: string;
  incorporationDate: string;
  legalForm: string;
  companyNumber: string;
};

export const siteConfig = {
  identity: {
    name: "West West Hash House Harriers",
    /**
     * The full name split for the logo lockup.
     *
     * The club asked for the name spelled out beside the logo rather than the
     * WWH3 abbreviation, so it is broken after "West West" to keep the header
     * compact. The `<br />` in `BrandLockup` is a real line break, so the words
     * are still read in order. `name` stays the single-string form for
     * `document.title`, `aria-label` and structured data.
     */
    nameParts: {
      first: "West West",
      rest: "Hash House Harriers",
    },
    abbreviation: "WWH3",
    type: "Men's non-competitive social Hash running fellowship",
    location: "Western Area, Freetown, Sierra Leone",
    established: "16 July 2026",
    establishedIso: "2026-07-16",
    founderCount: 7,
    motto: "Men who run together, stay together",
    rallyingCall: "On-On",
    officialColours: ["Black", "White", "Gold"] as const,
  },

  /** Run rhythm — regular schedule only, no fabricated upcoming dates. */
  schedule: {
    regularDay: "Friday",
    frequency: "Fortnightly",
    runsPerMonth: 2,
    note: "Regular Hash runs are held fortnightly on Fridays, with additional Friday and special runs announced when required.",
  },

  about: {
    paragraphs: [
      "WWH3 was founded on 16 July 2026 by seven members and received official approval and acceptance from its mother kennel, the Freetown Hash House Harriers (FH3), with recognition from a sister kennel, the Sierra Hash House Harriers and Harriettes (SH4). It is dedicated to promoting fitness, fellowship, discipline and brotherhood among men.",
      "WWH3 remains an autonomous fellowship governed by its own Constitution, while carrying the approval and support of its mother kennel, Freetown Hash House Harriers.",
      "Its name reflects its roots in western Freetown. Regular Hash runs are held fortnightly on Fridays, with additional Friday and special runs announced when required. Walkers and runners of different abilities are welcome, and no member of the Pack should be left behind.",
    ] as const,
  },

  vision:
    "To build a united brotherhood of adventurous men who run, laugh, explore and create lasting friendships through the spirit of hashing.",

  mission:
    "To bring men together through running, adventure, humour and fellowship, creating a welcoming brotherhood where members build lasting friendships, stay active, explore new places and enjoy the unique spirit of hashing.",

  contact: {
    address: "C/O IPCB Office, New England Ville, Freetown, Sierra Leone",
    email: "westwesth3@gmail.com",
    telephoneDisplay: "+232 75 181352",
    /** E.164 form — safe to hand to a tel: link. */
    telephoneHref: "tel:+23275181352",
    emailHref: "mailto:westwesth3@gmail.com",
  },

  registration: {
    authority: "National Investment Board of Sierra Leone",
    incorporationDate: "3 September 2026",
    legalForm: "Private Company Limited by Guarantee",
    companyNumber: "SL030926WESTW31727",
  } satisfies Registration,

  /**
   * Social channels supplied and confirmed by the club. The footer hides any
   * channel without an href rather than rendering a dead `#` link.
   */
  social: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61593822987247",
      icon: "facebook",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/westwest_hash/",
      icon: "instagram",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@west.west.hash.ho",
      icon: "tiktok",
    },
  ] as SocialLink[],
} as const;

/** Section ids used by in-page navigation. Keep in sync with the homepage. */
export const sectionIds = {
  about: "about",
  nextHash: "next-hash",
  hashing: "hashing",
  pillars: "pillars",
  log: "hash-log",
  gallery: "gallery",
  membership: "membership",
  faq: "faq",
  conduct: "conduct",
  contact: "contact",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

/** Primary navigation. Internal sections route to `/#<id>`. */
export const primaryNav: ReadonlyArray<{
  label: string;
  to: string;
}> = [
  { label: "About", to: `/#${sectionIds.about}` },
  { label: "The Hash", to: `/#${sectionIds.hashing}` },
  { label: "Hash Log", to: "/runs" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: `/#${sectionIds.contact}` },
];

/* -------------------------------------------------------------------------- */
/* Homepage statistics — all figures confirmed                               */
/* -------------------------------------------------------------------------- */

export const clubStats: ReadonlyArray<{ value: string; label: string }> = [
  { value: "7", label: "Founding members" },
  { value: "2×", label: "Friday runs each month" },
  { value: "1", label: "Pack moving together" },
];

/* -------------------------------------------------------------------------- */
/* Five pillars — constitutional values                                       */
/* -------------------------------------------------------------------------- */

export type Pillar = {
  number: string;
  name: string;
  text: string;
  icon: LucideIcon;
};

export const pillars: readonly Pillar[] = [
  {
    number: "01",
    name: "Brotherly Love",
    text: "Look out for one another, on the trail and beyond it.",
    icon: HeartHandshake,
  },
  {
    number: "02",
    name: "Fitness",
    text: "Move for wellbeing, at a pace that keeps the Pack together.",
    icon: Footprints,
  },
  {
    number: "03",
    name: "Fellowship",
    text: "Share the miles, the laughter and the stories afterwards.",
    icon: Users,
  },
  {
    number: "04",
    name: "Truth",
    text: "Act with honesty, humility and respect for the fellowship.",
    icon: Compass,
  },
  {
    number: "05",
    name: "Relief",
    text: "Support our members and the communities where we run.",
    icon: ShieldCheck,
  },
];

/* -------------------------------------------------------------------------- */
/* Constitution — Mandate, Objectives, Powers, Values                         */
/* -------------------------------------------------------------------------- */

export type GovernanceClause = {
  /** Bold lead-in, used by the numbered Values clauses. */
  title?: string;
  text: string;
};

export type GovernanceSection = {
  id: "mandate" | "objectives" | "powers" | "values";
  title: string;
  /** Sentence shown above the list; omitted when empty. */
  intro: string;
  /** Lettered (A, B, C) for the constitutional lists, numeric for Values. */
  numbering: "alpha" | "numeric";
  clauses: readonly GovernanceClause[];
};

/**
 * Supplied verbatim by the club from its Constitution. Wording, ordering and
 * lettering must not be edited — a change here is a change to the club's
 * governing document, not an editorial one.
 */
export const governance: readonly GovernanceSection[] = [
  {
    id: "mandate",
    title: "Mandate",
    intro: "The West West Hash House Harriers is committed to:",
    numbering: "alpha",
    clauses: [
      { text: "Organizing enjoyable, challenging, and memorable hash runs." },
      {
        text: "Promoting brotherhood, friendship, fitness, and personal well-being.",
      },
      {
        text: "Welcoming men from diverse backgrounds in a spirit of respect and inclusion.",
      },
      {
        text: "Encouraging good humour, creativity, adventure, and responsible fun.",
      },
      {
        text: "Supporting the safety of hashers, local communities, and the environments in which we run.",
      },
      {
        text: "Preserving and promoting the traditions and camaraderie of the Hash House Harriers.",
      },
      {
        text: "Building a strong, active, and sustainable kennel for present and future members.",
      },
      {
        text: "Undertaking occasional charitable and community activities in the name of the kennel.",
      },
      {
        text: "Building partnerships with other organizations in the performance of its functions.",
      },
    ],
  },
  {
    id: "objectives",
    title: "Objectives",
    intro: "",
    numbering: "alpha",
    clauses: [
      {
        text: "To organise regular hash runs, trails and social events for members and guests.",
      },
      {
        text: "To promote physical fitness, mental wellbeing and camaraderie among men.",
      },
      {
        text: "To uphold, teach and pass on the customs and traditions of the Hash House Harriers.",
      },
      {
        text: "To foster friendly relations with other hash kennels in Sierra Leone and abroad.",
      },
      {
        text: "To act safely and responsibly, and to respect the communities and environments in which we run.",
      },
      {
        text: "To undertake occasional charitable and community activities in the name of the Kennel.",
      },
    ],
  },
  {
    id: "powers",
    title: "Powers",
    intro:
      "To further its objectives, the Kennel may do all lawful things, including:",
    numbering: "alpha",
    clauses: [
      { text: "Open and operate bank accounts and hold funds." },
      {
        text: "Raise funds, receive donations and sponsorship consistent with its values.",
      },
      { text: "Acquire, hold, hire and dispose of equipment and property." },
      { text: "Organise runs, events, camps and travels." },
      { text: "Enter into agreements and engage suppliers and vendors." },
      { text: "Produce, hold and sell regalia and merchandise." },
      {
        text: "Affiliate and cooperate with other kennels and other bodies or individuals, and make charitable donations.",
      },
      { text: "Undertake any other business that it deems fit and necessary." },
    ],
  },
  {
    id: "values",
    title: "Values and the Spirit of the Hash",
    intro: "",
    numbering: "numeric",
    clauses: [
      {
        title: "Non-competitive",
        text: "the Hash is not a race. The last hasher home is as welcome as the first, and walkers are as valued as runners.",
      },
      {
        title: "Humility and humour",
        text: "hashers take the traditions of the Hash seriously and themselves not at all; good-natured teasing is part of the fun and is never a cover for malice.",
      },
      {
        title: "Fellowship and inclusion",
        text: "within its remit as a men’s kennel, the Hash welcomes men of good repute without regard to ethnicity, faith, nationality, background, profession or ability; no one is left behind on trial.",
      },
      {
        title: "Responsibility and safety",
        text: "enjoyment is always tempered by safety, moderation and respect for others, for the public, for land and business owners and for the environment.",
      },
      {
        title: "Respect and dignity",
        text: "harassment, bullying, discrimination and abuse have no place in the Kennel, on trial or in the Circle.",
      },
      {
        title: "The five pillars of WWH3",
        text: "are brotherly love, fitness, fellowship, truth, and relief—and the golden rule is that the traditions of the Hash exist for joy, never for cruelty.",
      },
      {
        title: "No politics or religion",
        text: "shall be promoted or debated in the Circle or on the trail; the Hash is a refuge from both.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* How a Hash runs                                                            */
/* -------------------------------------------------------------------------- */

export type HashStep = { step: string; title: string; text: string };

export const hashSteps: readonly HashStep[] = [
  {
    step: "01",
    title: "The Hare plans and marks the trail",
    text: "A Hare plans and marks a safe, adventurous route using environmentally responsible materials.",
  },
  {
    step: "02",
    title: "The Pack follows",
    text: "Runners and walkers read the trail together and call On-On when the route is found.",
  },
  {
    step: "03",
    title: "Checks and false trails regroup everyone",
    text: "Checks, false trails and pauses bring the Pack back together. The Hash is not a race.",
  },
  {
    step: "04",
    title: "Walkers and runners continue together",
    text: "Different abilities are welcome from the first trail mark to the finish. No one is left behind.",
  },
  {
    step: "05",
    title: "The Circle gathers after the trail",
    text: "The fellowship gathers after the trail for humour, recognition and tradition.",
  },
];

/* -------------------------------------------------------------------------- */
/* Membership pathway                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The public membership process and qualifications live in
 * `src/data/membership.ts` so the Membership dropdown pages and the homepage
 * share one definition. They are deliberately not restated here.
 */

/* -------------------------------------------------------------------------- */
/* Safety and conduct                                                         */
/* -------------------------------------------------------------------------- */

export const conductStandards: readonly string[] = [
  "No harassment, bullying or discrimination.",
  "No pressure to drink; non-alcoholic alternatives are always available.",
  "Consent before photographing or posting others.",
  "Politics and religion stay outside the trail and the Circle.",
];

/* -------------------------------------------------------------------------- */
/* Next Hash — honest empty state                                             */
/* -------------------------------------------------------------------------- */

/**
 * Shown in place of a schedule until WWH3 confirms real dates. These strings
 * are deliberately the only "upcoming" information published.
 */
export const nextHashPending = {
  heading: "Next run details coming soon.",
  body: "Contact WWH3 for the latest meeting point and starting time.",
} as const;
