import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isNavChildActive,
  isNavEntryActive,
  type NavEntry,
} from "@/data/navigation";
import { cn } from "@/lib/utils";

type NavDropdownEntry = Extract<NavEntry, { kind: "dropdown" }>;

type NavDropdownProps = {
  entry: NavDropdownEntry;
  pathname: string;
  /** Closes the mobile Sheet after an item is chosen. */
  onNavigate?: () => void;
  /** `bar` for the desktop header, `sheet` for the mobile menu. */
  variant?: "bar" | "sheet";
};

const focusRing =
  "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none";

const itemClassName =
  "cursor-pointer items-start gap-1 rounded-sm px-3 py-2.5 outline-none data-[highlighted]:bg-ink/5 data-[highlighted]:text-ink";

/**
 * Section dropdown used by both the desktop header and the mobile Sheet.
 *
 * Built on Radix `DropdownMenu` rather than a hover-driven menu, because:
 * - it opens on **click**, so touch users can operate it (a hover-only menu is
 *   unusable on a phone);
 * - arrow keys, Home/End, typeahead and Enter all work, and focus returns to
 *   the trigger on Escape;
 * - `modal={false}` keeps the page scrollable behind the menu and stops it
 *   fighting the Sheet's own focus lock when nested inside it.
 *
 * The trigger is a button rather than a link, so it has exactly one meaning
 * ("open this section's pages"). The section overview is reachable as the first
 * item in the menu, which keeps the trigger's accessible name unambiguous.
 */
export function NavDropdown({
  entry,
  pathname,
  onNavigate,
  variant = "bar",
}: NavDropdownProps) {
  const isActive = isNavEntryActive(entry, pathname);
  const isSheet = variant === "sheet";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        data-testid={`nav-trigger-${entry.label.toLowerCase()}`}
        /* An explicit label keeps the active state in the accessible name,
           rather than relying on how a screen reader happens to join the
           adjacent visually-hidden text. The visible label is still contained
           within it. */
        aria-label={isActive ? `${entry.label} (current section)` : entry.label}
        className={cn(
          "inline-flex items-center gap-1.5 font-black tracking-[0.08em] uppercase transition-colors",
          focusRing,
          isSheet
            ? "w-full justify-between border-b border-ink/12 px-1 py-4 text-[0.92rem] whitespace-nowrap text-left"
            : "px-1 py-2 text-[0.78rem] whitespace-nowrap",
          isActive ? "text-gold-deep" : "text-ink hover:text-gold-deep",
        )}
      >
        {entry.label}
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform duration-200"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={isSheet ? 4 : 10}
        collisionPadding={16}
        data-testid={`nav-dropdown-${entry.label.toLowerCase()}`}
        className="z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] w-[min(19rem,calc(100vw-2.5rem))] overflow-y-auto rounded-sm border border-ink/12 bg-pure-white p-1.5 shadow-[0_18px_40px_-18px_rgba(10,12,14,0.45)]"
      >
        <DropdownMenuItem
          asChild
          onSelect={() => onNavigate?.()}
          className={cn(
            itemClassName,
            pathname === entry.to && "bg-ink/5 font-black",
          )}
        >
          <Link to={entry.to}>
            <span className="block text-[0.82rem] tracking-[0.06em] uppercase">
              {entry.label} overview
            </span>
            <span className="mt-1 block text-[0.68rem] font-normal text-muted-gray normal-case">
              All {entry.label.toLowerCase()} pages
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-ink/10" />

        {entry.children.map((child) => (
          <DropdownMenuItem
            key={child.to}
            asChild
            onSelect={() => onNavigate?.()}
            className={cn(
              itemClassName,
              isNavChildActive(child, pathname) && "bg-ink/5 font-black",
            )}
          >
            <Link to={child.to}>
              <span className="block text-[0.82rem] tracking-[0.06em] uppercase">
                {child.label}
              </span>
              <span className="mt-1 block text-[0.68rem] font-normal text-muted-gray normal-case">
                {child.description}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
