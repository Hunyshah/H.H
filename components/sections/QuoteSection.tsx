import type { ComponentType } from "react";

import { LazyQuoteForm } from "@/components/forms/LazyQuoteForm";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { telHref, whatsappHref } from "@/lib/contact";
import { quoteSection as copy } from "@/lib/content/home";
import { ui } from "@/lib/content/site";
import type { SiteSettings } from "@/lib/data/settings";
import type { LeadInput } from "@/lib/validations/lead";

type QuoteSectionProps = {
  settings: SiteSettings;
  defaultProjectType?: LeadInput["projectType"];
};

export function QuoteSection({ settings, defaultProjectType }: QuoteSectionProps) {
  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      className="scroll-mt-(--header-height) bg-ink-950 section-y text-ivory"
    >
      <div className="container-site grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            id="quote-title"
            eyebrow={copy.eyebrow}
            title={copy.title}
            intro={copy.intro}
            tone="dark"
          />
          <Reveal delay={200}>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-xs border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <ContactItem
                Icon={PhoneIcon}
                label={copy.call}
                value={settings.phone}
                href={telHref(settings.phone)}
                event="call_click"
              />
              <ContactItem
                Icon={WhatsAppIcon}
                label={copy.whatsapp}
                value={
                  settings.whatsapp.startsWith("[") ? settings.whatsapp : `+${settings.whatsapp}`
                }
                href={whatsappHref(settings.whatsapp, ui.whatsappGreeting)}
                event="whatsapp_click"
                external
              />
              <ContactItem
                Icon={MailIcon}
                label={copy.email}
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
              <ContactItem Icon={MapPinIcon} label={copy.office} value={settings.address} />
            </ul>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <LazyQuoteForm whatsapp={settings.whatsapp} defaultProjectType={defaultProjectType} />
        </Reveal>
      </div>
    </section>
  );
}

type ContactItemProps = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
  event?: "call_click" | "whatsapp_click";
  external?: boolean;
};

function ContactItem({ Icon, label, value, href, event, external }: ContactItemProps) {
  const body = (
    <>
      <Icon size={20} className="mt-0.5 shrink-0 text-gold" />
      <span className="min-w-0">
        <span className="block text-xs font-bold tracking-(--tracking-eyebrow) text-muted-on-dark uppercase">
          {label}
        </span>
        <span className="mt-1 block text-[15px] font-semibold break-words text-ivory">{value}</span>
      </span>
    </>
  );
  const className = "flex min-h-11 gap-4 bg-ink-950 p-5 transition-colors duration-300";

  return (
    <li className="flex">
      {href && event ? (
        <TrackedLink
          href={href}
          event={event}
          placement="quote_section"
          className={`${className} w-full hover:bg-ink-900`}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {body}
        </TrackedLink>
      ) : href ? (
        <a href={href} className={`${className} w-full hover:bg-ink-900`}>
          {body}
        </a>
      ) : (
        <div className={`${className} w-full`}>{body}</div>
      )}
    </li>
  );
}
