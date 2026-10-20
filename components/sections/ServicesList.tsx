import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { servicesSection } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import type { ServiceSummary } from "@/lib/data/services";

export function ServicesList({ services }: { services: ServiceSummary[] }) {
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="services-title" className="bg-sand section-y">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="services-title"
            index={2}
            eyebrow={servicesSection.eyebrow}
            title={servicesSection.title}
            intro={servicesSection.intro}
          />
          <div className="relative mt-12 mr-3.5 mb-3.5 hidden md:mr-5.5 md:mb-5.5 md:block">
            <Reveal
              variant="frame"
              delay={300}
              className="absolute inset-0 translate-x-5.5 translate-y-5.5 rounded-xs border border-gold"
            />
            <Reveal
              variant="wipe"
              className="relative aspect-[4/3] overflow-hidden rounded-xs bg-ink-900"
            >
              <Parallax className="absolute inset-x-0 -inset-y-[8%]">
                <Image
                  src={images.engineer}
                  alt={servicesSection.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 90vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
          </div>
        </div>

        <div>
          <ol className="border-t border-line">
            {services.map((service, i) => (
              <Reveal as="li" key={service.id} delay={i * 70} className="border-b border-line">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-7 sm:grid-cols-[3.5rem_1fr_auto] sm:py-8"
                >
                  <span className="pt-1 font-display text-sm font-bold text-gold-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold tracking-(--tracking-display) text-body transition-colors duration-500 group-hover:text-brand-purple sm:text-2xl">
                      {service.title}
                    </span>
                    {service.short && (
                      <span className="mt-2 block text-[15px] leading-relaxed text-muted">
                        {service.short}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 inline-flex size-10 items-center justify-center rounded-full border border-line text-body transition-all duration-500 ease-arch group-hover:border-gold group-hover:bg-gold">
                    <ArrowUpRightIcon size={18} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <ButtonLink href="/services" variant="outline-light">
              {servicesSection.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
