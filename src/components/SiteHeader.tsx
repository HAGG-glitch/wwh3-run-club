import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { BrandLockup } from "@/components/BrandMark";
import { MenuMark } from "@/components/MenuMark";
import { NavDropdown } from "@/components/NavDropdown";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  isNavEntryActive,
  primaryNav,
  type NavEntry,
} from "@/data/navigation";
import { sectionIds, siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/** Underline indicator shared by plain links and dropdown triggers. */
const activeUnderline =
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold-deep after:transition-transform after:duration-200";

/**
 * Sticky site header.
 *
 * Mobile navigation is a Radix `Sheet`, which gives Escape-to-close,
 * outside-click-to-close, focus trapping and focus restoration for free — all of
 * which the previous hand-rolled menu was missing.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  // Shrink the header once the page has moved. Kept independent of Motion so
  // sticky-header behaviour survives reduced motion.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the Sheet whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  const joinTarget = `/#${sectionIds.membership}`;

  /** Renders one top-level entry: a plain link, or a dropdown. */
  const renderEntry = (entry: NavEntry, variant: "bar" | "sheet") => {
    if (entry.kind === "dropdown") {
      return (
        <NavDropdown
          key={entry.to}
          entry={entry}
          pathname={pathname}
          variant={variant}
          onNavigate={() => setMenuOpen(false)}
        />
      );
    }

    const active = isNavEntryActive(entry, pathname);

    if (variant === "sheet") {
      return (
        <Link
          key={entry.to}
          to={entry.to}
          onClick={() => setMenuOpen(false)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "border-b border-ink/12 py-4 text-[0.92rem] font-extrabold tracking-[0.06em] whitespace-nowrap uppercase transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none",
            active ? "text-gold-deep" : "text-ink hover:text-gold-deep",
          )}
        >
          {entry.label}
        </Link>
      );
    }

    return (
      <Link
        key={entry.to}
        to={entry.to}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative inline-flex items-center rounded-sm px-1 py-2 text-[0.78rem] font-extrabold tracking-[0.08em] whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none",
          activeUnderline,
          active
            ? "text-gold-deep after:scale-x-100"
            : "text-ink after:scale-x-0 hover:text-gold-deep hover:after:scale-x-100",
        )}
      >
        {entry.label}
      </Link>
    );
  };

  return (
    <>
      <ScrollProgress />

      <div className="flex h-[34px] items-center justify-center bg-gold px-4 text-[0.7rem] font-extrabold tracking-[0.13em] text-ink uppercase sm:justify-between sm:px-[4vw]">
        <span className="hidden sm:inline">{siteConfig.identity.location}</span>
        <span className="truncate text-center sm:text-left">
          {siteConfig.identity.rallyingCall} · {siteConfig.schedule.frequency}{" "}
          {siteConfig.schedule.regularDay}s
        </span>
        <span className="hidden sm:inline">
          Est. {siteConfig.identity.established}
        </span>
      </div>

      <header
        data-testid="site-header"
        data-scrolled={scrolled}
        className={cn(
          /* Two columns below `lg` so the lockup and the menu button share one
             row. Without `grid-cols` here the grid auto-places children into
             separate rows, which put the burger in a second row that overflowed
             the fixed header height and sat on top of the page content. */
          "sticky top-0 z-50 grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-ink/15 bg-warm-white/95 px-4 backdrop-blur-md transition-[height,box-shadow,background-color] duration-300 sm:gap-x-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:px-[4vw] xl:gap-x-10",
          /* The height shrink is desktop-only. On mobile it nudged the lockup
             and the button up 4px on every scroll, which read as the header
             visibly jumping while the page moved. */
          scrolled
            ? "h-[72px] shadow-[0_12px_35px_rgba(23,25,29,0.08)] lg:h-[72px]"
            : "h-[72px] lg:h-[86px]",
        )}
      >
        <Link
          to="/"
          aria-label={`${siteConfig.identity.name} home`}
          className="w-max shrink-0 rounded-sm focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none"
        >
          <BrandLockup />
        </Link>

        {/* Desktop navigation. A single flex row with a consistent gap keeps
            every item — plain link or dropdown trigger — on the same baseline.
            `flex-nowrap` plus `whitespace-nowrap` prevents wrapping, and the
            nav is centered in its own grid track so it never collides with the
            logo or the action button. */}
        <nav
          aria-label="Main"
          data-testid="desktop-nav"
          className="hidden flex-nowrap items-center gap-x-6 lg:flex xl:gap-x-8"
        >
          {primaryNav.map((entry) => renderEntry(entry, "bar"))}
        </nav>

        <div className="hidden items-center justify-self-end gap-5 lg:flex">
          {/* Hairline rule separates the action button from the link group. */}
          <span aria-hidden="true" className="h-7 w-px bg-ink/15" />
          <Button
            asChild
            size="lg"
            className="h-auto rounded-sm bg-ink px-5 py-3.5 text-[0.76rem] font-extrabold tracking-[0.07em] whitespace-nowrap text-warm-white uppercase transition-colors hover:bg-gold-bright hover:text-ink"
          >
            <Link to={joinTarget}>
              Join the Hash
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
              className="group size-11 justify-self-end rounded-sm border-ink/25 bg-warm-white/60 text-ink transition-colors hover:border-gold-deep hover:bg-gold-bright/20 hover:text-gold-deep active:bg-gold-bright/35 lg:hidden"
            >
              <MenuMark />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[86vw] max-w-sm gap-0 border-l border-ink/15 bg-warm-white p-0 text-ink sm:max-w-sm"
            data-testid="mobile-nav"
          >
            <SheetHeader className="border-b border-ink/15 p-5 pr-14">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate between the sections of the {siteConfig.identity.name}{" "}
                website.
              </SheetDescription>
              <BrandLockup />
            </SheetHeader>

            <nav
              aria-label="Mobile"
              className="flex flex-col overflow-y-auto px-5 py-1"
            >
              {primaryNav.map((entry) => renderEntry(entry, "sheet"))}
            </nav>

            <div className="px-5 py-5">
              <Button
                asChild
                className="h-auto w-full justify-between rounded-sm bg-ink px-5 py-3.5 text-[0.76rem] font-extrabold tracking-[0.07em] text-warm-white uppercase hover:bg-gold-bright hover:text-ink"
              >
                <Link to={joinTarget} onClick={() => setMenuOpen(false)}>
                  Join the Hash
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="mt-auto space-y-1 px-5 pt-4 pb-7 text-[0.78rem] text-muted-gray">
              <Separator className="mb-4 bg-ink/15" />
              <p className="font-semibold">{siteConfig.contact.address}</p>
              <p>
                <a
                  href={siteConfig.contact.emailHref}
                  className="underline underline-offset-4 hover:text-gold-deep"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                <a
                  href={siteConfig.contact.telephoneHref}
                  className="underline underline-offset-4 hover:text-gold-deep"
                >
                  {siteConfig.contact.telephoneDisplay}
                </a>
              </p>
            </div>

            <SheetClose className="sr-only">Close navigation</SheetClose>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
