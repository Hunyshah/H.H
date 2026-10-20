import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { processPage as copy } from "@/lib/content/pages";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Our Process — From Plot to Keys",
  description: copy.metaDescription,
  alternates: { canonical: "/process" },
};

export default async function ProcessPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        breadcrumbs={[{ label: copy.eyebrow, href: "/process" }]}
      />
      <section aria-label="Process steps" className="bg-ivory section-y">
        <ol className="container-site">
          {copy.steps.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr_380px] lg:gap-12 lg:py-16"
            >
              <Reveal>
                <span className="font-display text-6xl leading-none font-extrabold tracking-(--tracking-display) text-gold-text lg:text-7xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[28px] font-bold lg:text-[36px]">{step.title}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                  {step.text}
                </p>
              </Reveal>
              <Reveal
                delay={160}
                className="rounded-xs bg-sand p-6 md:col-start-2 lg:col-start-auto"
              >
                <h3 className="text-xs font-bold tracking-(--tracking-eyebrow) text-gold-text uppercase">
                  {copy.receive}
                </h3>
                <ul className="mt-4 grid gap-3">
                  {step.receive.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] text-body">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mt-0.5 shrink-0 text-gold-text"
                        aria-hidden="true"
                      >
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
