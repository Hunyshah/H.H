import Link from "next/link";

import { ClipboardIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { telHref, whatsappHref } from "@/lib/contact";
import { ui } from "@/lib/content/site";

import { TrackedLink } from "./TrackedLink";

const item =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[12px] font-bold tracking-wide";

/** Phone-only sticky bottom bar: Call · WhatsApp · Estimate. */
export function MobileBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-dark bg-ink-950 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <TrackedLink
        href={telHref(phone)}
        event="call_click"
        placement="mobile_bar"
        className={`${item} text-ivory`}
      >
        <PhoneIcon size={20} />
        {ui.call}
      </TrackedLink>
      <TrackedLink
        href={whatsappHref(whatsapp, ui.whatsappGreeting)}
        event="whatsapp_click"
        placement="mobile_bar"
        target="_blank"
        rel="noopener noreferrer"
        className={`${item} border-x border-line-dark text-ivory`}
      >
        <WhatsAppIcon size={20} className="text-whatsapp" />
        {ui.whatsapp}
      </TrackedLink>
      <Link href="/contact#quote" className={`${item} bg-gold text-ink-950`}>
        <ClipboardIcon size={20} />
        {ui.estimate}
      </Link>
    </nav>
  );
}
