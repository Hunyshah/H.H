import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ComponentType } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import { telHref, whatsappHref } from "@/lib/contact";
import { companyLinks, sectorLinks, site, ui } from "@/lib/content/site";
import type { SiteSettings, SocialKey } from "@/lib/data/settings";

import { Logo } from "./Logo";
import { TrackedLink } from "./TrackedLink";

const socialMeta: Record<SocialKey, { label: string; Icon: ComponentType<{ size?: number }> }> = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
};

const heading = "mb-5 text-xs font-bold tracking-(--tracking-eyebrow) text-gold uppercase";
const link =
  "inline-flex min-h-11 items-center text-[15px] text-muted-on-dark transition-colors duration-300 hover:text-ivory md:min-h-9";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = (Object.keys(socialMeta) as SocialKey[]).filter((key) => settings.socials[key]);

  return (
    <footer className="bg-ink-950 pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-ivory md:pb-0">
      <div aria-hidden="true" className="h-px bg-gold/60" />
      <div className="container-site grid gap-12 pt-16 pb-10 md:grid-cols-2 md:pt-20 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
        <div>
          <Logo variant="dark" size="lg" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-on-dark">
            {ui.footerAbout}
          </p>
          {socials.length > 0 && (
            <div className="mt-7">
              <p className="sr-only">{ui.followUs}</p>
              <ul className="flex gap-2">
                {socials.map((key) => {
                  const { label, Icon } = socialMeta[key];
                  return (
                    <li key={key}>
                      <a
                        href={settings.socials[key] ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${site.name} on ${label}`}
                        className="inline-flex size-11 items-center justify-center rounded-xs border border-line-dark text-muted-on-dark transition-colors duration-300 hover:border-gold hover:text-gold"
                      >
                        <Icon size={18} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <nav aria-label="Sectors">
          <h2 className={heading}>{ui.footerSectors}</h2>
          <ul>
            {sectorLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className={heading}>{ui.footerCompany}</h2>
          <ul>
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{ui.footerContact}</h2>
          <address className="grid gap-1 not-italic">
            <TrackedLink
              href={telHref(settings.phone)}
              event="call_click"
              placement="footer"
              className={`${link} gap-3`}
            >
              <PhoneIcon size={18} className="shrink-0 text-gold" />
              {settings.phone}
            </TrackedLink>
            <TrackedLink
              href={whatsappHref(settings.whatsapp, ui.whatsappGreeting)}
              event="whatsapp_click"
              placement="footer"
              target="_blank"
              rel="noopener noreferrer"
              className={`${link} gap-3`}
            >
              <WhatsAppIcon size={18} className="shrink-0 text-gold" />
              {ui.whatsapp}
            </TrackedLink>
            <a href={`mailto:${settings.email}`} className={`${link} gap-3 break-all`}>
              <MailIcon size={18} className="shrink-0 text-gold" />
              {settings.email}
            </a>
            <p className="mt-2 flex gap-3 text-[15px] leading-relaxed text-muted-on-dark">
              <MapPinIcon size={18} className="mt-1 shrink-0 text-gold" />
              {settings.address}
            </p>
          </address>
        </div>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line-dark py-6 text-[13px] text-muted-on-dark sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CopyrightYear /> {site.name}. {ui.rights}
        </p>
        <p>
          {site.locality}, {site.city} · {site.region}, {site.country}
        </p>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
