import type { CSSProperties, ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro?: string | null;
  breadcrumbs: Crumb[];
  children?: ReactNode;
};

/** Dark opening band shared by inner pages (keeps the header transparent-on-dark). */
export function PageHero({ eyebrow, title, intro, breadcrumbs, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 pt-(--header-height) text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-muted-on-dark)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] opacity-[0.07]"
      />
      <div className="container-site pt-8 pb-16 md:pt-12 md:pb-20 lg:pb-24">
        <Reveal variant="fade">
          <Breadcrumbs items={breadcrumbs} />
        </Reveal>
        <Reveal variant="fade" delay={80} className="mt-10 md:mt-14">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        </Reveal>
        <h1
          data-reveal="words"
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
          className="mt-5 max-w-4xl text-[38px] leading-[1.06] font-extrabold sm:text-[44px] lg:text-[62px]"
        >
          <SplitWords text={title} />
        </h1>
        {intro && (
          <Reveal delay={450}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-on-dark sm:text-lg">
              {intro}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={550} className="mt-8">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
