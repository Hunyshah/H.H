import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/contact";
import { ui } from "@/lib/content/site";

import { TrackedLink } from "./TrackedLink";

/**
 * Floating WhatsApp button (tablet and desktop). On phones the sticky bottom
 * bar already offers WhatsApp, so the floating button is hidden there to keep
 * the screen clear.
 */
export function WhatsAppButton({ number }: { number: string }) {
  return (
    <aside aria-label="Chat on WhatsApp">
      <TrackedLink
        href={whatsappHref(number, ui.whatsappGreeting)}
        event="whatsapp_click"
        placement="floating"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ui.chatOnWhatsapp}
        className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgb(21_17_42/0.55)] transition-transform duration-500 ease-arch hover:-translate-y-1 md:inline-flex"
      >
        <WhatsAppIcon size={28} />
      </TrackedLink>
    </aside>
  );
}
