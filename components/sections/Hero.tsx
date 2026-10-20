import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { hero } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { categoryLabel } from "@/lib/content/projects";
import type { ProjectCard } from "@/lib/data/projects";

type HeroProps = {
  project: ProjectCard | null;
  /** Optional muted looping background video (MP4 URL). */
  backgroundVideoSrc?: string;
};

export function Hero({ project, backgroundVideoSrc }: HeroProps) {
  const leadWords = hero.titleLead.split(/\s+/).length;
  const imageSrc = project?.coverUrl ?? images.factoryHall;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink-950 pt-(--header-height) text-ivory"
    >
      {backgroundVideoSrc && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block">
          <video
            src={backgroundVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-ink-950/70" />
        </div>
      )}

      {/* Fine architectural grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-muted-on-dark)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] opacity-[0.07]"
      />

      <div className="container-site grid items-center gap-14 pt-10 pb-20 md:pt-16 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <Reveal variant="fade">
            <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>
          </Reveal>
          <h1
            id="hero-title"
            data-reveal="words"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="mt-6 text-[40px] leading-[1.04] font-extrabold sm:text-[44px] lg:text-[64px] xl:text-[70px]"
          >
            <SplitWords text={hero.titleLead} />{" "}
            <span className="text-gold">
              <SplitWords text={hero.titleAccent} offset={leadWords} />
            </span>
          </h1>
          <Reveal variant="rise" delay={500}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-on-dark sm:text-lg">
              {hero.intro}
            </p>
          </Reveal>
          <Reveal delay={800} className="mt-10 flex flex-wrap gap-4">
            <MagneticButton>
              <ButtonLink href="/contact#quote" className="px-7">
                {hero.primaryCta}
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="/projects" variant="outline-dark" className="px-7">
              {hero.secondaryCta}
            </ButtonLink>
          </Reveal>
        </div>

        <figure className="relative mr-3.5 mb-3.5 md:mr-5.5 md:mb-5.5">
          <div
            aria-hidden="true"
            data-reveal="frame"
            style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-xs border border-gold md:translate-x-5.5 md:translate-y-5.5"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-ink-900 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={imageSrc}
              alt={
                project
                  ? `${project.title}, ${project.location ?? ""}`
                  : "Completed factory production hall"
              }
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
            <div
              aria-hidden="true"
              data-reveal="curtain"
              style={{ "--reveal-delay": "150ms" } as React.CSSProperties}
              className="absolute inset-0 bg-ink-950"
            />
          </div>
          {project && (
            <figcaption className="absolute right-0 bottom-0 left-0 sm:right-auto sm:bottom-6 sm:left-6">
              <Link
                href={`/projects/${project.slug}`}
                className="group flex items-center justify-between gap-6 bg-ink-950 px-5 py-4 sm:min-w-80"
              >
                <span>
                  <span className="block text-[11px] font-bold tracking-(--tracking-eyebrow) text-gold uppercase">
                    {hero.captionLabel} · {categoryLabel(project.category, true)}
                  </span>
                  <span className="draw-line mt-1 inline font-display text-base font-semibold text-ivory">
                    {project.title}
                  </span>
                  {project.scope && (
                    <span className="mt-0.5 block text-sm text-muted-on-dark">{project.scope}</span>
                  )}
                </span>
                <ArrowUpRightIcon
                  size={20}
                  className="shrink-0 text-gold transition-transform duration-500 ease-arch group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
