# WWH3 Clean Website

The website for **West West Hash House Harriers** — a men's non-competitive
social Hash running fellowship in Freetown, Sierra Leone.

A static React single-page application. There is no backend, no database, no
authentication and no admin area: it builds to plain files that can be hosted
anywhere static hosting is available.

## Stack

| Concern | Choice |
| --- | --- |
| Build tool | Vite 7 |
| UI | React 19 + TypeScript |
| Routing | React Router 7 (SPA mode) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Components | shadcn/ui, `radix-nova` style, on Radix UI primitives |
| Icons | Lucide React |
| Animation | Motion |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Tests | Vitest + React Testing Library + jsdom |
| Linting | ESLint 9 (flat config) + typescript-eslint |

## Requirements

Node.js LTS (20 or newer) and npm.

## Commands

```powershell
npm install        # install dependencies
npm run dev        # start the dev server (usually http://localhost:5173)
npm run lint       # ESLint, zero warnings tolerated
npm run test       # run the test suite once
npm run test:watch # run tests in watch mode
npm run build      # type-check, then build to dist/
npm run preview    # serve the production build locally
```

`npm run build` runs `tsc --noEmit` first, so a type error fails the build.

## Routes

The primary navigation is defined once in `src/data/navigation.ts`. Gallery and
Membership are dropdown sections; every child page is also linked from the
footer and from the section's own sub-navigation, so no destination is reachable
only by opening a menu.

| Path | Page |
| --- | --- |
| `/` | Homepage — all club sections |
| `/runs` | Hash Log: completed runs and the upcoming schedule |
| `/runs/:slug` | A single run story with its own photographs |
| `/gallery` | Gallery overview — the four content categories |
| `/gallery/photos` | Photograph archive: carousel, grid and enlarged previews |
| `/gallery/events` | Confirmed events (currently an empty state) |
| `/gallery/publications` | Approved documents (currently an empty state) |
| `/gallery/news` | Articles and announcements (currently an empty state) |
| `/membership` | Qualifications and the six-step application process |
| `/membership/partnerships` | Confirmed partners (currently an empty state) |
| `/membership/donors` | Approved supporter recognition (currently an empty state) |
| `/membership/trends` | Aggregated statistics (currently withheld) |
| `/membership/coverage` | Confirmed base and areas of activity |
| `/#<id>` | A homepage section (`about`, `hashing`, `membership`, …) |
| anything else | Redirects to `/` |

`/gallery` is a real overview page rather than a redirect, so the dropdown
trigger and search engines both have a hub destination.

The site is an SPA. A production host must rewrite unknown paths to
`index.html`, otherwise a direct visit to `/runs` will 404.

### Navigation behaviour

- Dropdowns use Radix `DropdownMenu` (shadcn), not a hover-driven menu, so they
  open on click and work with touch, keyboard and screen readers.
- Arrow keys, Home/End, typeahead, Enter and Escape are handled by the primitive;
  focus returns to the trigger on close.
- Below the `lg` breakpoint the navigation collapses into the Radix `Sheet`.
- The active page is marked with `aria-current`, and the active section with an
  accessible "(current section)" label plus a gold underline.

## Where to edit content

Content is separated from components. Each data module is independent and
exports a strict type, so a mistake is a type error rather than a wrong page.

| File | Contains |
| --- | --- |
| `src/data/siteConfig.ts` | Club identity, contact details, registration, homepage copy, pillars and conduct |
| `src/data/navigation.ts` | **The single source of navigation truth**: top-level entries, dropdown children, section descriptors, active-state helpers |
| `src/data/membership.ts` | Membership process and qualifications, trend metrics, coverage |
| `src/data/events.ts` | `ClubEvent` type, `allEvents`, `publishedEvents`, empty-state copy |
| `src/data/publications.ts` | `Publication` type, `allPublications`, download/permission selectors |
| `src/data/news.ts` | `NewsArticle` type, `allNews`, `publishedNews`, empty-state copy |
| `src/data/partners.ts` | `Partner` type, `allPartners`, `publishedPartners` |
| `src/data/donors.ts` | `Donor` type, `allDonors`, `publishedDonors` (consent-gated) |
| `src/data/runs.ts` | Run type, `upcomingRuns`, `completedRuns`, selectors |
| `src/data/gallery.ts` | Gallery items, consent flags, selectors |
| `src/data/faq.ts` | FAQ entries |
| `src/data/hashTerms.ts` | Hash terminology glossary |
| `src/styles.css` | Tailwind `@theme` tokens, shadcn CSS variables, keyframes |
| `src/components/BrandMark.tsx` | The club logo used in header, Sheet and footer |
| `public/` | Images, the logo and `robots.txt` |

### Images

Replace the files in `public/` and keep the filenames, or update the paths in the
data modules.

`public/gallery_photos/` holds the nine real club photographs
(`wwh3-01.jpeg` … `wwh3-09.jpeg`). The club has confirmed the people shown
consented to their use, so they are published and carry no placeholder badge.
They have no written descriptions yet, so `alt` and `caption` are deliberately
generic rather than invented — see
[`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md#3-photography).

The remaining WebP entries are **placeholders, not club photographs**, and are
badged as such everywhere they appear.

Every `GalleryItem` declares its intrinsic `width`/`height` so the browser can
reserve space before the file downloads. If you replace an image, update those
two numbers to match the new file.

### Logo

The club logo is `public/wwh3-logo.png`, referenced by `LOGO_SRC` in
`src/components/BrandMark.tsx`. That file has an opaque black background, so it
is always presented on a dark rounded plate. It is marked `alt=""` because the
club name is always rendered as real text next to it, so replacing the file with
a vector or transparent version needs no other change. See
[`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md).

## Important content note

All run records, run stories, Hares, dates and locations on the site are
**demonstration material**. Each is labelled in the interface with one of the
three disclosures defined in `src/lib/demoLabels.ts`:

- `Demo record`
- `Placeholder story`
- `Placeholder photograph`

The one exception is the nine photographs in `public/gallery_photos/`, which are
real, consented club photographs. They are unbadged because they are genuine,
but they are also undescribed — see
[`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md#3-photography).

A site-wide `ConceptNotice` reinforces this on every page. Do not remove a label
or the notice without replacing the underlying content first.

`upcomingRuns` is deliberately **empty** so that no invented date can ever be
presented as a real event. See [`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md) for the
full list of outstanding content, including the missing logo, the production
domain and the real run schedule.

## The join form

`src/components/JoinForm.tsx` validates locally with Zod and then opens a
pre-filled `mailto:` to the club's address. The site transmits nothing and has no
server to receive submissions, so the form tells the visitor they must still press
send. The rules live in `src/lib/joinSchema.ts`.

## Possible future modules

The content is already split into independent data modules, so these can be added
without restructuring the site. **None of them exist yet, and none should be
added without a decision about hosting, security and who is allowed to edit them.**

- Runs and the Hash Log — replacing the demo records with confirmed history
- Hash Log archive — browsing, filtering and searching past runs
- Gallery management — approving photographs and recording consent
- Announcements — upcoming events and notices
- Join requests — receiving applications instead of relying on `mailto:`
- Contact messages — a real enquiry form with a mail or CRM destination
- Site settings — editable contact details and content from a CMS

A CMS or database-backed admin would need a hosting decision, authentication and
an authorisation model. A static host can only support read-only content, so
editable content would mean moving to a service such as a headless CMS.

## Accessibility and motion

- Motion is opt-in and respects `prefers-reduced-motion`
- Every interactive element is reachable and operable by keyboard
- The mobile navigation is a Radix `Sheet`, which provides focus trapping,
  Escape-to-close and focus restoration
- Gallery and Membership dropdowns are Radix `DropdownMenu`, opened by click or
  keyboard — never hover-only — with arrow-key navigation and Escape-to-close
- The "Is this your first Hash?" radios are a Radix `RadioGroup` inside
  `FormControl`, so the group (not each item) carries `aria-invalid` and
  `aria-describedby` when it fails validation
- The six Hash steps each have their own wayfinding animation, keyed off
  `data-step-motif`. The motifs are `aria-hidden` decorative spans — the ordered
  list carries the meaning. Under `prefers-reduced-motion` they are pinned
  visible and untransformed, since the animations are what normally position
  them
- Every page sets its own `document.title` and meta description via
  `src/hooks/usePageMeta.ts`, so all twelve routes are independently indexable
- Tests cover labelled navigation, dropdown keyboard operation, dialog semantics,
  empty states, route coverage and form error associations

## Governance

The club's internal governance structure is private and is not published
anywhere on this site. The public membership process states only that
*"The application is reviewed by WWH3."* No officers, committees, councils or
internal decision-making procedures are rendered on any route, and
`src/test/publicGovernance.test.tsx` enforces that.

## Project layout

```
src/
  components/
    motion/      Reveal, StaggerGroup, PageTransition, ScrollProgress
    ui/          shadcn/ui primitives (Radix based)
    *.tsx        SiteHeader, SiteFooter, NavDropdown, PageHero,
                 SectionSubnav, BrandMark, JoinForm, ...
  data/          all editable content
  hooks/         useHashScroll, usePrefersReducedMotion, usePageMeta
  lib/           cn helper, join schema, disclosure labels
  pages/         one file per route
  test/          Vitest setup, router helper and test suites
```

