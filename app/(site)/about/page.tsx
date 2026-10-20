import type { Metadata } from "next";
import Image from "next/image";

import { MapPinIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/PageHero";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { StatsBand } from "@/components/sections/StatsBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { aboutPage as copy } from "@/lib/content/pages";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "About H.H Associate — Engineers & Contractors in Faisalabad",
  description: copy.metaDescription,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        breadcrumbs={[{ label: copy.eyebrow, href: "/about" }]}
      />
      <StatsBand stats={settings.stats} />

      {/* Story */}
      <section aria-labelledby="story-title" className="bg-ivory section-y">
        <div className="container-site grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="story-title" eyebrow={copy.storyEyebrow} title={copy.storyTitle} />
            {copy.story.map((p, i) => (
              <Reveal key={i} delay={150 + i * 80}>
                <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="relative mr-3.5 mb-3.5 md:mr-5.5 md:mb-5.5">
            <Reveal
              variant="frame"
              delay={300}
              className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-xs border border-gold md:translate-x-5.5 md:translate-y-5.5"
            />
            <Reveal
              variant="wipe"
              className="relative aspect-[4/3] overflow-hidden rounded-xs bg-ink-900 lg:aspect-[4/5]"
            >
              <Parallax className="absolute inset-x-0 -inset-y-[8%]">
                <Image
                  src={images.siteCranes}
                  alt="Construction site with cranes and steel structure"
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="bg-ink-900 section-y text-ivory">
        <div className="container-site">
          <SectionHeading
            id="values-title"
            eyebrow={copy.valuesEyebrow}
            title={copy.valuesTitle}
            tone="dark"
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xs border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {copy.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 90} className="bg-ink-900 p-8">
                <span className="font-display text-sm font-bold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-2xl font-bold">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-on-dark">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section aria-labelledby="team-title" className="bg-ivory section-y">
        <div className="container-site">
          <SectionHeading id="team-title" eyebrow={copy.teamEyebrow} title={copy.teamTitle} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.team.map((member, i) => (
              <Reveal as="li" key={i} delay={i * 90}>
                {/* Photo placeholder: replace with next/image once team photos are supplied */}
                <div className="flex aspect-[4/5] items-end rounded-xs bg-sand [background-image:linear-gradient(135deg,transparent_49.5%,var(--color-line)_49.5%,var(--color-line)_50.5%,transparent_50.5%)] p-6">
                  <span className="font-display text-5xl font-extrabold text-line">H.H</span>
                </div>
                <p className="mt-4 font-display text-lg font-semibold">{member.name}</p>
                <p className="text-sm text-muted">{member.role}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Service area */}
      <section aria-labelledby="area-title" className="border-t border-line bg-sand section-y">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="area-title" eyebrow={copy.areaEyebrow} title={copy.areaTitle} />
            <Reveal delay={150}>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                {copy.areaText}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} as="ul" className="grid content-start gap-3 lg:pt-16">
            {copy.areas.map((area) => (
              <li
                key={area}
                className="flex items-center gap-4 border-b border-line pb-3 font-display text-xl font-semibold"
              >
                <MapPinIcon size={20} className="text-gold-text" />
                {area}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
