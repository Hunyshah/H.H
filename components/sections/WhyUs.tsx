import Image from "next/image";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyUsSection as copy } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";

export function WhyUs({ years }: { years: string }) {
  return (
    <section aria-labelledby="why-title" className="bg-ivory section-y">
      <div className="container-site grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="relative mr-3.5 mb-3.5 md:mr-5.5 md:mb-5.5">
          <Reveal
            variant="frame"
            delay={300}
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-xs border border-gold md:translate-x-5.5 md:translate-y-5.5"
          />
          <Reveal
            variant="wipe"
            className="relative aspect-[4/5] overflow-hidden rounded-xs bg-ink-900 sm:aspect-[5/4] lg:aspect-[4/5]"
          >
            <Parallax className="absolute inset-x-0 -inset-y-[8%]">
              <Image
                src={images.houseDusk}
                alt={copy.imageAlt}
                fill
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </Parallax>
          </Reveal>
          <Reveal
            delay={500}
            className="absolute -bottom-3.5 left-5 bg-gold px-6 py-5 text-ink-950 sm:left-8 md:-bottom-5.5"
          >
            <span className="block font-display text-5xl leading-none font-extrabold tracking-(--tracking-display)">
              {years}
            </span>
            <span className="mt-2 block text-xs font-bold tracking-(--tracking-eyebrow) uppercase">
              {copy.badgeLabel}
            </span>
          </Reveal>
        </div>

        <div>
          <SectionHeading id="why-title" index={5} eyebrow={copy.eyebrow} title={copy.title} />
          <ul className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {copy.points.map((point, i) => (
              <Reveal as="li" key={point.title} delay={i * 90}>
                <span aria-hidden="true" className="block h-px w-10 bg-gold" />
                <h3 className="mt-5 text-xl font-bold">{point.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{point.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
