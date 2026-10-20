import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { MapEmbed } from "@/components/media/MapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { contactPage as copy } from "@/lib/content/pages";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contact — Free Site Visit & Estimate",
  description: copy.metaDescription,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        breadcrumbs={[{ label: copy.eyebrow, href: "/contact" }]}
      />
      <QuoteSection settings={settings} />
      <section aria-labelledby="map-title" className="bg-ivory section-y">
        <div className="container-site">
          <Reveal>
            <h2 id="map-title" className="text-[32px] font-bold lg:text-[46px]">
              {copy.mapTitle}
            </h2>
          </Reveal>
          <Reveal variant="wipe" className="mt-10">
            <MapEmbed
              src={settings.mapEmbedUrl}
              address={settings.address}
              labels={{
                title: copy.mapTitle,
                load: copy.mapLoad,
                notice: copy.mapNotice,
                open: copy.openInMaps,
                placeholder: copy.mapPlaceholder,
              }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
