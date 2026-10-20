"use client";

import { clsx } from "clsx";
import { useState } from "react";

import { useFlip } from "@/components/motion/useFlip";
import { FilterChips } from "@/components/projects/FilterChips";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { featuredSection } from "@/lib/content/home";
import { categories } from "@/lib/content/projects";
import type { ProjectCard as ProjectCardData } from "@/lib/data/projects";

/** Bento grid of featured projects with animated category filtering. */
export function FeaturedGrid({ projects }: { projects: ProjectCardData[] }) {
  const [filter, setFilter] = useState("all");
  const { ref, snapshot } = useFlip<HTMLUListElement>(filter);

  const present = categories.filter((c) => projects.some((p) => p.category === c.value));
  const options = [
    { value: "all", label: featuredSection.all },
    ...present.map((c) => ({ value: c.value, label: c.short })),
  ];
  // 2×2 tile + four smaller ones: a complete bento.
  const visible = (
    filter === "all" ? projects : projects.filter((p) => p.category === filter)
  ).slice(0, 5);

  return (
    <>
      {present.length > 1 && (
        <FilterChips
          options={options}
          value={filter}
          onChange={(value) => {
            snapshot();
            setFilter(value);
          }}
          label="Filter projects by sector"
        />
      )}
      <ul
        ref={ref}
        className="mt-10 grid auto-rows-[300px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-4"
      >
        {visible.map((project, i) => (
          <li
            key={project.id}
            data-flip-key={project.id}
            className={clsx(i === 0 && "sm:col-span-2 lg:row-span-2")}
          >
            <ProjectCard project={project} large={i === 0} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-10 text-muted-on-dark">{featuredSection.empty}</p>}
    </>
  );
}
