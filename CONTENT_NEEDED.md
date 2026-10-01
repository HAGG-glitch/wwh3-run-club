# Content still needed from WWH3

Nothing on this site has been invented. Where confirmed information was not
available, the interface either omits the content or labels it clearly as
placeholder/demo material. This file lists everything the club still needs to
supply, and exactly where it will be used.

**Rule for maintainers:** do not delete a "Placeholder" or "Demo" label without
replacing the underlying content. Those labels are the only thing stopping a
visitor from treating sample material as an official club record.

> This file is an internal working document. It is **not** rendered on the public
> website and must never be linked from the site or copied into `index.html`.

---

## 1. Branding

| Item | Status | Where it is used |
| --- | --- | --- |
| Club logo | **Supplied** — `public/wwh3-logo.png` (772 × 516) | `src/components/BrandMark.tsx` |
| Logo as an SVG/vector with a transparent background | Missing | Preferred replacement for the PNG |
| Logo usage rules / clear space / minimum size | Missing | Brand section of this file |
| Approved club fonts | Missing | `--font-display` / `--font-body` in `src/styles.css` |
| Favicon derived from the approved logo | Missing | `public/favicon.svg` is still the W3 mark |

### Note on the current logo file

`public/wwh3-logo.png` is in place and used in the header, mobile Sheet and
footer. Two things to be aware of:

- The PNG has an **opaque black background**, not a transparent one. It is
  therefore always shown on a dark rounded plate, which keeps the edges looking
  deliberate on the light header as well as in the dark footer.
- It is a 232 KB PNG at 1.5:1 aspect. A vector (SVG) or transparent WebP would
  be sharper and considerably lighter.

To swap it, replace the file and update `LOGO_SRC` in
`src/components/BrandMark.tsx`. Nothing else needs to change: the logo is marked
`alt=""` because the club name is always rendered as real text alongside it, so
the file can be re-cut without touching the accessible name.

## 2. Runs and the Hash Log

| Item | Status | Where it is used |
| --- | --- | --- |
| Confirmed upcoming run dates | **Missing** | `src/data/runs.ts` → `upcomingRuns` (intentionally empty) |
| Meeting point and start time per run | Missing | `HashRun.startTime`, `HashRun.meetingLocation` |
| Real completed run records | **Missing** | `src/data/runs.ts` → `completedRuns` (currently 3 demo entries) |
| Real Hares' names, per run | Missing | `HashRun.hares` (demo entries use "Sample Hare A" etc.) |
| Run distances, difficulty, terrain | Missing | `HashRun.distance`, `difficulty`, `terrain` |
| Full run write-ups and memorable moments | Missing | `HashRun.story`, `HashRun.memorableMoments` |
| Correct Hash numbers | Missing | `HashRun.hashNumber` |

Until real runs arrive, every demo run is badged **Demo record**,
**Placeholder story** and **Placeholder photograph** (see `src/lib/demoLabels.ts`).

## 3. Photography

| Item | Status | Where it is used |
| --- | --- | --- |
| Club photographs | **Supplied** | `src/data/gallery.ts` → 9 entries `wwh3-01`…`wwh3-09` |
| Per-photo consent confirmation | **Confirmed** | All nine are `consentConfirmed: true` |
| Descriptions of what each photo shows | **Missing** | `GalleryItem.alt`, `caption`, `descriptionConfirmed` |
| Photo credits / photographer names | Missing | `GalleryItem` has no credit field yet |
| Real dates, locations, Hash numbers | Missing | `GalleryItem.date`, `location`, `hashNumber` |
| Approval for the current hero image | Missing | `index.html` Open Graph image, `HomePage` hero |

### Descriptions for the nine club photographs

`public/gallery_photos/wwh3-01.jpeg` … `wwh3-09.jpeg` are the supplied
photographs, renamed from their original WhatsApp export names. The club has
confirmed the people shown consented to their use on the website, so they are
published and are **not** badged as placeholders.

They currently have no description. `alt` and `caption` read
"WWH3 club photograph" and `descriptionConfirmed` is `false` for all nine,
tracked by `galleryPhotosNeedingDescriptions`. This is deliberate: a
specific-but-invented description ("the Pack sprinting down the hill") would
mislead anyone using a screen reader, who has no way to check it. For each
photo, supply what is actually in the frame, then set
`descriptionConfirmed: true`.

| File | Size | Also known as |
| --- | --- | --- |
| `wwh3-01.jpeg` | 1600×1200 | `WhatsApp Image 2026-09-25 at 3.46.54 PM (1).jpeg` |
| `wwh3-02.jpeg` | 1448×1086 | `WhatsApp Image 2026-09-25 at 3.46.54 PM (2).jpeg` |
| `wwh3-03.jpeg` | 1600×1200 | `WhatsApp Image 2026-09-25 at 3.46.54 PM.jpeg` |
| `wwh3-04.jpeg` | 1448×1086 | `WhatsApp Image 2026-09-25 at 3.46.55 PM (1).jpeg` |
| `wwh3-05.jpeg` | 1600×1200 | `WhatsApp Image 2026-09-25 at 3.46.55 PM (3).jpeg` |
| `wwh3-06.jpeg` | 1448×1086 | `WhatsApp Image 2026-09-25 at 3.46.55 PM.jpeg` |
| `wwh3-07.jpeg` | 1600×1200 | `WhatsApp Image 2026-09-25 at 3.54.19 PM (1).jpeg` |
| `wwh3-08.jpeg` | 1200×1600 | `WhatsApp Image 2026-09-25 at 3.54.19 PM (2).jpeg` |
| `wwh3-09.jpeg` | 1152×864 | `WhatsApp Image 2026-09-25 at 3.54.19 PM.jpeg` |

### Remaining placeholders

Four WebP entries (`gallery-shoreline-regroup`, `gallery-circle`,
`gallery-following-marks`, `gallery-atlantic`) are still generic placeholders
kept only to populate the Carousel/mosaic split and the "Freetown" category.
They are badged "Placeholder photograph". Delete them once a second batch of
real photographs is available — the two earlier placeholders have already been
removed.

## 4. Events

| Item | Status | Where it is used |
| --- | --- | --- |
| Approved event records | **Missing** | `src/data/events.ts` → `allEvents` (intentionally empty) |
| Event titles and slugs | Missing | `ClubEvent.title`, `ClubEvent.slug` |
| Confirmed dates | Missing | `ClubEvent.date` |
| Confirmed start times | Missing | `ClubEvent.time` |
| Confirmed locations / venues | Missing | `ClubEvent.location` |
| Event descriptions | Missing | `ClubEvent.description` |
| Cover images for events | Missing | `ClubEvent.coverImage` |
| Registration links, if registration is used | Missing | `ClubEvent.registrationLink` |
| Which events are drafts vs scheduled vs completed | Missing | `ClubEvent.status` |

`/gallery/events` currently shows the empty state: *"No published events are
currently available."* No event has been invented. Each record needs
`published: true` before it appears publicly.

## 5. Publications

| Item | Status | Where it is used |
| --- | --- | --- |
| Approved publications | **Missing** | `src/data/publications.ts` → `allPublications` (intentionally empty) |
| Document titles | Missing | `Publication.title` |
| Publication types | Missing | `Publication.type` |
| Publication dates | Missing | `Publication.publicationDate` |
| Descriptions | Missing | `Publication.description` |
| Cover images | Missing | `Publication.coverImage` |
| File paths or external URLs | Missing | `Publication.fileUrl` |
| **Publication download permissions** | **Missing** | `Publication.downloadAllowed` |
| **Confirmed permission to publish at all** | **Missing** | `Publication.publicationPermissionConfirmed` |

**Two separate permissions are required** before anything appears:

1. `publicationPermissionConfirmed: true` — the club has approved making the
   document public. This protects legal and constitutional material, which must
   **not** be published publicly until this is confirmed.
2. `downloadAllowed: true` — visitors may download it. Without this a document
   is shown as *view only* and no download link is rendered.

`/gallery/publications` currently shows: *"No public documents are currently
available."* No fake download buttons or placeholder links exist.

## 6. News

| Item | Status | Where it is used |
| --- | --- | --- |
| News articles | **Missing** | `src/data/news.ts` → `allNews` (intentionally empty) |
| Article titles and slugs | Missing | `NewsArticle.title`, `NewsArticle.slug` |
| Publication dates | Missing | `NewsArticle.publicationDate` |
| Summaries | Missing | `NewsArticle.summary` |
| Full article body content | Missing | `NewsArticle.body` |
| **News cover photographs** | **Missing** | `NewsArticle.coverImage` |
| Authors | Missing | `NewsArticle.author` (nullable — left null rather than invented) |

No article has been written and none has been invented. `/gallery/news` shows an
empty state until real stories are supplied.

## 7. Partners

| Item | Status | Where it is used |
| --- | --- | --- |
| Confirmed partner organisations | **Missing** | `src/data/partners.ts` → `allPartners` (intentionally empty) |
| Partner names | Missing | `Partner.name` |
| Partner types | Missing | `Partner.type` |
| **Partner logos** | **Missing** | `Partner.logo` |
| **Partner descriptions** | **Missing** | `Partner.description` |
| Website URLs, where approved for linking | Missing | `Partner.websiteUrl` |
| Active vs past partnerships | Missing | `Partner.partnershipStatus` |

No partner is named, described or illustrated, because naming a partner implies
an endorsement that has not been granted. `/membership/partnerships` shows an
empty state.

## 8. Donors and supporters

| Item | Status | Where it is used |
| --- | --- | --- |
| Approved donor / supporter records | **Missing** | `src/data/donors.ts` → `allDonors` (intentionally empty) |
| Names | Missing | `Donor.name` |
| Logos | Missing | `Donor.logo` |
| Support categories | Missing | `Donor.supportCategory` |
| Descriptions | Missing | `Donor.description` |
| **Donor-recognition permission** | **Missing** | `Donor.recognitionConsent` |

No donor has been fabricated. Nothing is listed until `recognitionConsent` is
`true`. **Contribution amounts are deliberately not modelled at all** — there is
no amount field in the type, so no sum can be displayed by accident.

## 9. Membership statistics

| Item | Status | Where it is used |
| --- | --- | --- |
| Verified membership statistics | **Missing** | `src/data/membership.ts` → `trendMetrics` (all `value: null`) |
| Total membership | Missing | `MembershipTrendMetric` key `totalMembership` |
| New members by period | Missing | key `newMembersByPeriod` |
| Active members | Missing | key `activeMembers` |
| Member retention | Missing | key `memberRetention` |
| Run participation (aggregated) | Missing | key `runParticipation` |

No figure has been estimated or invented. `/membership/trends` shows: *"Membership
trend information will be published when verified data becomes available."*

**Never supply** names, telephone numbers, email addresses or individual
attendance histories. The data model only accepts aggregate values, so personal
data has no code path to the page.

## 10. Coverage and locations of activity

| Item | Status | Where it is used |
| --- | --- | --- |
| Confirmed base location | **Confirmed** | `coverageBase` — derived from `siteConfig.identity.location` |
| Western Area / Freetown / Sierra Leone | **Confirmed** | `confirmedCoverage` in `src/data/membership.ts` |
| **Additional approved locations of activity** | **Missing** | `futureCoverage` (intentionally empty) |
| Any areas of activity beyond the current base | Missing | `futureCoverage` entries |
| Coverage statistics | Missing | Not modelled — none exist |

The confirmed base is deliberately held separately from `futureCoverage`, so the
club's current base is never blurred together with plans for future expansion.

## 11. Club details

| Item | Status | Where it is used |
| --- | --- | --- |
| Production domain name | **Missing** | Canonical URL, `og:url`, sitemap (see `public/robots.txt`) |
| Social media URLs | **Missing** | `src/data/siteConfig.ts` → `social` (intentionally empty) |
| Current office / meeting venue details | Partial | `siteConfig.contact.address` is the confirmed correspondence address |
| Membership fee amounts | Missing | `membershipSteps` step 05 says "applicable fees" only |
| Charity / community work | Missing | `pillars` Relief pillar is generic |

## 12. Community information

| Item | Status | Where it is used |
| --- | --- | --- |
| Guest / first-time Hasher instructions | Partial | `faqItems` answers this in general terms only |
| Kit, dress code and equipment list | Missing | `hashTerms` mentions kit generally |
| Safety briefing / risk assessment wording | Missing | `conductStandards` is generic |
| Weather and route cancellation policy | Missing | Not rendered |

---

## Governance: deliberately not published

The club's internal governance structure is **private** and is not recorded
anywhere in this repository's public-facing code, data or tests. WWH3 intends to
establish a general group later.

- The public membership process states only that *"The application is reviewed
  by WWH3."* It does not name any body, officer or procedure.
- No officers, committees, councils, voting structures or internal titles are
  rendered on any route.
- `src/test/publicGovernance.test.tsx` asserts that no route renders such a term,
  and that none appears in page copy, attributes or document titles.

If governance information is ever approved for publication, add it deliberately —
do not simply delete the guard test.

---

## Before launch

- [ ] Supply a confirmed run schedule, then replace `upcomingRuns`.
- [ ] Supply approved photography and consent, then set `consentConfirmed: true`
      and remove `isDemo` on the relevant gallery and run entries.
- [ ] Supply approved events, then populate `src/data/events.ts` → `allEvents`.
- [ ] Supply publications **and their permissions**, then populate
      `src/data/publications.ts`. Confirm `publicationPermissionConfirmed` before
      any legal document is exposed.
- [ ] Supply news articles, cover photographs and authors, then populate
      `src/data/news.ts` → `allNews`.
- [ ] Supply confirmed partners with logos and descriptions, then populate
      `src/data/partners.ts` → `allPartners`.
- [ ] Supply approved donors **with recognition consent**, then populate
      `src/data/donors.ts` → `allDonors`.
- [ ] Supply verified membership statistics, then fill `trendMetrics` values in
      `src/data/membership.ts`. Aggregates only.
- [ ] Supply any approved areas of activity beyond the base, then populate
      `futureCoverage`.
- [ ] Supply the production domain, then add `<link rel="canonical">` and an
      `og:url` to `index.html` and a `Sitemap:` line to `public/robots.txt`.
- [ ] Replace `public/wwh3-logo.png` with an approved vector or transparent
      version, then update `LOGO_SRC` in `src/components/BrandMark.tsx`.
- [ ] Remove the site-wide `ConceptNotice` from the page layouts once no demo
      material remains. It is rendered by `src/components/ConceptNotice.tsx` and
      included on every route.

