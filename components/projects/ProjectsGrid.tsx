import type { Ref } from "react";

import type { ProjectCard as ProjectCardData } from "@/lib/data/projects";

import { ProjectCard } from "./ProjectCard";

/** Responsive project card grid. Items carry `data-flip-key` for filter animations. */
export function ProjectsGrid({
  projects,
  ref,
}: {
  projects: ProjectCardData[];
  ref?: Ref<HTMLUListElement>;
}) {
  return (
    <ul
      ref={ref}
      className="mt-10 grid auto-rows-[340px] gap-5 sm:grid-cols-2 lg:auto-rows-[400px] lg:grid-cols-3"
    >
      {projects.map((project) => (
        <li key={project.id} data-flip-key={project.id}>
          <ProjectCard
            project={project}
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </li>
      ))}
    </ul>
  );
}
