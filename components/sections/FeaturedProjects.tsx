import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredSection } from "@/lib/content/home";
import type { ProjectCard } from "@/lib/data/projects";

import { FeaturedGrid } from "./FeaturedGrid";

export function FeaturedProjects({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="work-title" className="bg-ink-950 section-y text-ivory">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="work-title"
            index={3}
            eyebrow={featuredSection.eyebrow}
            title={featuredSection.title}
            intro={featuredSection.intro}
            tone="dark"
          />
          <Reveal className="shrink-0">
            <ButtonLink href="/projects" variant="outline-dark">
              {featuredSection.viewAll}
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal className="mt-10">
          <FeaturedGrid projects={projects} />
        </Reveal>
      </div>
    </section>
  );
}
