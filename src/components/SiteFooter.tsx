import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

import { BrandLockup } from "@/components/BrandMark";
import { Separator } from "@/components/ui/separator";
import { flattenNav } from "@/data/navigation";
import { sectionIds, siteConfig } from "@/data/siteConfig";

const iconFor = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  mail: Mail,
  phone: Phone,
} as const;

/**
 * Site footer.
 *
 * Social channels are only rendered when the club has supplied a real URL. Any
 * unconfirmed channel is omitted entirely rather than rendered as a dead `#`
 * link, so a visitor never taps something that goes nowhere.
 */
export function SiteFooter() {
  const socials = siteConfig.social;

  return (
    <footer className="on-dark bg-ink text-warm-white">
      <div className="grid gap-10 px-5 pt-16 pb-8 sm:px-[7vw] lg:grid-cols-[1fr_1.1fr_.9fr] lg:gap-12">
        <div>
          <Link to="/" className="inline-block rounded-sm">
            <BrandLockup tone="light" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-warm-white/60">
            {siteConfig.identity.type} in {siteConfig.identity.location}.
          </p>
          <p className="mt-3 text-sm font-semibold text-gold-bright">
            {siteConfig.identity.motto}.
          </p>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-black tracking-[0.14em] text-warm-white uppercase">
            Explore
          </h2>
          {/* Flattened from the central nav config, so every dropdown page stays
              reachable from the footer without duplicating the link list. */}
          <nav
            aria-label="Footer"
            className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.75rem] font-extrabold tracking-[0.08em] uppercase sm:grid-cols-1"
          >
            {flattenNav().map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="w-max rounded-sm transition-colors hover:text-gold-bright focus-visible:text-gold-bright focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-black tracking-[0.14em] text-warm-white uppercase">
            Contact
          </h2>
          <address className="mt-4 space-y-2 text-sm text-warm-white/65 not-italic">
            <p>{siteConfig.contact.address}</p>
            <p>
              <a
                href={siteConfig.contact.emailHref}
                className="underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {siteConfig.contact.email}
              </a>
            </p>
            <p>
              <a
                href={siteConfig.contact.telephoneHref}
                className="underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {siteConfig.contact.telephoneDisplay}
              </a>
            </p>
          </address>

          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((social) => {
                const Icon = iconFor[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      rel="noopener noreferrer"
                      className="grid size-10 place-items-center rounded-sm border border-warm-white/20 text-warm-white transition-colors hover:border-gold-bright hover:bg-gold-bright hover:text-ink"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="px-5 pb-8 sm:px-[7vw]">
        <Separator className="bg-warm-white/15" />
        <div className="mt-6 flex flex-col gap-3 text-[0.68rem] tracking-[0.1em] text-warm-white/45 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 {siteConfig.identity.abbreviation} · Registered with the{" "}
            {siteConfig.registration.authority} · {siteConfig.registration.legalForm}
          </span>
          <Link
            to={`/#${sectionIds.contact}`}
            className="w-max rounded-sm font-extrabold text-warm-white/70 transition-colors hover:text-gold-bright"
          >
            {siteConfig.identity.motto}
          </Link>
        </div>
      </div>
    </footer>
  );
}
