"use client";

import { useSearchParams } from "next/navigation";

import { useFlip } from "@/components/motion/useFlip";
import { categories, isCategory } from "@/lib/content/projects";
import { projectsPage as copy } from "@/lib/content/pages";
import type { ProjectCard as ProjectCardData } from "@/lib/data/projects";

import { FilterChips } from "./FilterChips";
import { ProjectsGrid } from "./ProjectsGrid";

/**
 * Projects grid with category chips synced to `?category=` (shareable links,
 * back button). Uses history.replaceState, which Next.js keeps in sync with
 * useSearchParams, so filtering never re-fetches the page.
 */
export function ProjectsExplorer({ projects }: { projects: ProjectCardData[] }) {
  const params = useSearchParams();
  const raw = params.get("category");
  const filter = isCategory(raw) ? raw : "all";
  const { ref, snapshot } = useFlip<HTMLUListElement>(filter);

  const options = [
    { value: "all", label: copy.all },
    ...categories.map((c) => ({ value: c.value, label: c.short })),
  ];
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const onChange = (value: string) => {
    snapshot();
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete("category");
    else next.set("category", value);
    const query = next.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  };

  return (
    <>
      <FilterChips
        options={options}
        value={filter}
        onChange={onChange}
        label={copy.filterLabel}
        tone="light"
      />
      <ProjectsGrid ref={ref} projects={visible} />
      {visible.length === 0 && <p className="mt-10 text-muted">{copy.empty}</p>}
    </>
  );
}
