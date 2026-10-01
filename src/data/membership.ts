/**
 * Membership content, trends and coverage.
 *
 * Holds the public membership rules and process (previously inline in
 * `siteConfig.ts`) plus the data models behind the Membership dropdown pages.
 *
 * Governance note: the club's internal decision-making structure is private
 * and is **not** described anywhere in this module. The public process says
 * only that an application is reviewed by WWH3.
 */

import { siteConfig } from "@/data/siteConfig";

/* -------------------------------------------------------------------------- */
/* Membership process                                                         */
/* -------------------------------------------------------------------------- */

/** The public membership process, in order. */
export const membershipSteps = [
  {
    step: "01",
    title: "Attend a Hash",
    text: "Come out to a run as a guest and experience a trail with the Pack.",
  },
  {
    step: "02",
    title: "Complete three runs",
    text: "Take part in three runs so that you and the existing members can get to know each other.",
  },
  {
    step: "03",
    title: "Receive endorsement",
    text: "An existing member endorses your application to the club.",
  },
  {
    step: "04",
    title: "Application reviewed by WWH3",
    text: "The application is reviewed by WWH3.",
  },
  {
    step: "05",
    title: "Pay applicable fees",
    text: "An approved applicant pays the applicable fees.",
  },
  {
    step: "06",
    title: "Welcome to the fellowship",
    text: "The new member is formally welcomed into the fellowship.",
  },
] as const;

/** Qualifications and caveats that apply alongside the steps. */
export const membershipNotes = [
  {
    title: "Men aged 18 or above",
    text: "Applicants must be men aged 18 or above.",
  },
  {
    title: "Every ability is welcome",
    text: "Runners and walkers of different abilities are welcome.",
  },
  {
    title: "Existing Hashers",
    text: "Existing Hashers may be exempted from the three-run requirement.",
  },
  {
    title: "No guarantee of membership",
    text: "Submitting an application does not guarantee membership.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Membership trends                                                          */
/* -------------------------------------------------------------------------- */

export type TrendMetricKey =
  | "totalMembership"
  | "newMembersByPeriod"
  | "activeMembers"
  | "memberRetention"
  | "runParticipation";

export type MembershipTrendMetric = {
  key: TrendMetricKey;
  label: string;
  /** Formatted value, e.g. "48 members". Null until verified data exists. */
  value: string | null;
  /** Short explanation of what the metric counts. */
  description: string;
};

/**
 * Aggregated metrics only.
 *
 * No names, telephone numbers, email addresses or individual attendance
 * histories are stored or rendered here — those are never exposed publicly.
 */
const trendMetrics: readonly MembershipTrendMetric[] = [
  {
    key: "totalMembership",
    label: "Total membership",
    value: null,
    description: "The number of members on the current membership roll.",
  },
  {
    key: "newMembersByPeriod",
    label: "New members by period",
    value: null,
    description: "Members who joined the club within each reporting period.",
  },
  {
    key: "activeMembers",
    label: "Active members",
    value: null,
    description: "Members who have taken part in recent runs.",
  },
  {
    key: "memberRetention",
    label: "Member retention",
    value: null,
    description: "The share of members who remain active between periods.",
  },
  {
    key: "runParticipation",
    label: "Run participation",
    value: null,
    description: "Attendance at runs, reported as aggregated totals only.",
  },
];

/** True only once verified figures have been supplied for every metric. */
export const hasVerifiedMembershipTrends = trendMetrics.every(
  (metric) => metric.value !== null,
);

/** Metric definitions, so the page can explain what will be published. */
export const membershipTrendMetrics = trendMetrics;

/** Public-facing copy for the trends empty state. */
export const trendsEmptyState = {
  heading:
    "Membership trend information will be published when verified data becomes available.",
  body: "Only aggregated figures are published, and only once they have been checked against the club's membership records.",
} as const;

/* -------------------------------------------------------------------------- */
/* Coverage                                                                    */
/* -------------------------------------------------------------------------- */

export type CoverageArea = {
  name: string;
  /** What this area means for the club. */
  note: string;
  /** True when the club has confirmed the location. */
  confirmed: boolean;
};

/**
 * Confirmed base, derived from the central site config rather than restated, so
 * there is a single source of truth for the club's location.
 */
export const coverageBase: CoverageArea = {
  name: siteConfig.identity.location,
  note: "Confirmed home area of the club. Runs are organised from here.",
  confirmed: true,
};

/** Freetown and its region, both confirmed from the club's own address. */
export const confirmedCoverage: readonly CoverageArea[] = [
  {
    name: "Western Area",
    note: "The region of Sierra Leone in which the club is based and active.",
    confirmed: true,
  },
  {
    name: "Freetown",
    note: "The city where the club is headquartered.",
    confirmed: true,
  },
  {
    name: "Sierra Leone",
    note: "The country within which the club currently operates.",
    confirmed: true,
  },
];

/**
 * Areas of activity beyond the current base.
 *
 * No future areas are listed, because none have been confirmed. The empty entry
 * is rendered as an explicit statement rather than a gap.
 */
export const futureCoverage: readonly CoverageArea[] = [];
