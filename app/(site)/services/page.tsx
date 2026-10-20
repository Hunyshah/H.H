import type { Metadata } from "next";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { servicesPage as copy } from "@/lib/content/pages";
import { getServices } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Construction & Engineering Services in Faisalabad",
  description: copy.metaDescription,
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        breadcrumbs={[{ label: copy.eyebrow, href: "/services" }]}
      />
      <section aria-label="All services" className="bg-ivory section-y">
        <ul className="container-site grid gap-px overflow-hidden rounded-xs border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={(i % 3) * 90} className="flex bg-ivory">
              <Link
                href={`/services/${service.slug}`}
                className="group flex w-full flex-col p-8 transition-colors duration-500 hover:bg-white sm:p-10"
              >
                <span className="font-display text-sm font-bold text-gold-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-6 text-2xl font-bold text-body transition-colors duration-500 group-hover:text-brand-purple">
                  {service.title}
                </h2>
                {service.short && (
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.short}</p>
                )}
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-body">
                  <span className="draw-line">{copy.learnMore}</span>
                  <ArrowUpRightIcon size={16} className="text-gold-text" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
