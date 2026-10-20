import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Faq } from "@/components/content/Faq";
import { Markdown } from "@/components/content/Markdown";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { processSection } from "@/lib/content/home";
import { serviceCategories, servicesPage as copy } from "@/lib/content/pages";
import { getProjectsInCategories } from "@/lib/data/projects";
import { getServiceBySlug, getServices } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";

export async function generateStaticParams() {
  const services = await getServices();
  return services.length > 0
    ? services.map((s) => ({ slug: s.slug }))
    : [{ slug: "__no-services__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} in Faisalabad`,
    description: service.short ?? undefined,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

  const related = await getProjectsInCategories(serviceCategories[service.slug] ?? []);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={service.title}
        intro={service.short}
        breadcrumbs={[
          { label: copy.eyebrow, href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      >
        <ButtonLink href="/contact#quote">Get a Free Estimate</ButtonLink>
      </PageHero>

      {service.body && (
        <section aria-label={copy.included} className="bg-ivory section-y">
          <div className="container-site grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:gap-20">
            <Reveal>
              <Eyebrow>{copy.included}</Eyebrow>
            </Reveal>
            <Reveal delay={100} className="max-w-3xl">
              <Markdown source={service.body} />
            </Reveal>
          </div>
        </section>
      )}

      <section aria-labelledby="service-process" className="bg-sand section-y">
        <div className="container-site">
          <Reveal>
            <Eyebrow>{copy.process}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="service-process" className="mt-5 text-[32px] font-bold lg:text-[46px]">
              {processSection.title}
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xs border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {processSection.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="bg-sand p-6">
                <span className="font-display text-sm font-bold text-gold-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="service-related" className="bg-ivory section-y">
          <div className="container-site">
            <Reveal>
              <h2 id="service-related" className="text-[32px] font-bold lg:text-[46px]">
                {copy.related}
              </h2>
            </Reveal>
            <ProjectsGrid projects={related} />
          </div>
        </section>
      )}

      {service.faq.length > 0 && (
        <section aria-labelledby="service-faq" className="border-t border-line bg-ivory section-y">
          <div className="container-site grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:gap-20">
            <Reveal>
              <h2 id="service-faq" className="text-[28px] font-bold lg:text-[36px]">
                {copy.faq}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Faq items={service.faq} />
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
