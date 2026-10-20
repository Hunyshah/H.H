import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectorsSection } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { categories, type ProjectCategory } from "@/lib/content/projects";
import type { ProjectCard } from "@/lib/data/projects";

const fallbackImages: Record<ProjectCategory, string> = {
  residential: images.modernHouse,
  commercial: images.commercial,
  industrial: images.factoryHall,
  civil: images.siteCranes,
};

/** The four sectors, each pictured with its first featured project when one exists. */
export function Sectors({ projects }: { projects: ProjectCard[] }) {
  return (
    <section id="sectors" aria-labelledby="sectors-title" className="bg-ivory section-y">
      <div className="container-site">
        <SectionHeading
          id="sectors-title"
          index={1}
          eyebrow={sectorsSection.eyebrow}
          title={sectorsSection.title}
          intro={sectorsSection.intro}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {categories.map((c, i) => {
            const project = projects.find((p) => p.category === c.value && p.coverUrl);
            return (
              <Reveal as="li" key={c.value} delay={i * 100}>
                <Link
                  href={`/projects?category=${c.value}`}
                  className="group relative block overflow-hidden rounded-xs bg-ink-950 transition-transform duration-700 ease-arch motion-safe:hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={project?.coverUrl ?? fallbackImages[c.value]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover transition-transform duration-[1.6s] ease-arch motion-safe:group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/35 to-transparent"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block text-xs font-bold tracking-(--tracking-eyebrow) text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-ivory">{c.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-on-dark">
                      {sectorsSection.items[c.value]}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ivory">
                      <span className="draw-line">{sectorsSection.cta}</span>
                      <ArrowUpRightIcon size={16} className="text-gold" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
