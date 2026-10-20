import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ui } from "@/lib/content/site";
import { getSiteSettings } from "@/lib/data/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-gold px-4 py-3 font-bold text-ink-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {ui.skipToContent}
      </a>
      <Header phone={settings.phone} whatsapp={settings.whatsapp} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp} />
      <MobileBar phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
