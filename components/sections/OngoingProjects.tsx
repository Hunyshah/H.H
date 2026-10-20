import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ongoingSection as copy } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { categoryLabel } from "@/lib/content/projects";
import type { ProjectCard } from "@/lib/data/projects";

/** Compact strip of projects under construction. Renders nothing when there are none. */
export function OngoingProjects({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="ongoing-title"
      className="border-t border-line bg-ivory py-16 md:py-20"
    >
      <div className="container-site grid gap-10 lg:grid-cols-[0.32fr_1fr] lg:items-center">
        <div>
          <Reveal>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="ongoing-title" className="mt-4 text-[26px] font-bold lg:text-[30px]">
              {copy.title}
            </h2>
          </Reveal>
        </div>
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {projects.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 80}
              className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-32px)/3)]"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="group flex items-center gap-4 rounded-xs border border-line bg-white/60 p-3 transition-colors duration-300 hover:border-ink-950"
              >
                <span className="relative size-20 shrink-0 overflow-hidden rounded-xs bg-ink-900">
                  <Image
                    src={p.coverUrl ?? images.siteCranes}
                    alt=""
                    fill
                    sizes="80px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-[1.2s] ease-arch motion-safe:group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-(--tracking-eyebrow) text-gold-text uppercase">
                    <span aria-hidden="true" className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-2 rounded-full bg-gold" />
                    </span>
                    {copy.status}
                  </span>
                  <span className="mt-1 block truncate font-display font-semibold text-body">
                    {p.title}
                  </span>
                  <span className="block truncate text-sm text-muted">
                    {[categoryLabel(p.category, true), p.location].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
