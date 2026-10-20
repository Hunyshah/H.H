import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/layout/PageHero";
import { FilterChips } from "@/components/projects/FilterChips";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { projectsPage as copy } from "@/lib/content/pages";
import { categories } from "@/lib/content/projects";
import { getAllProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Projects — Homes, Plazas & Factories in Faisalabad",
  description: copy.metaDescription,
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getAllProjects(), getSiteSettings()]);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        breadcrumbs={[{ label: copy.title, href: "/projects" }]}
      />
      <section aria-labelledby="project-list-title" className="bg-ivory section-y">
        <div className="container-site">
          <h2 id="project-list-title" className="sr-only">
            All projects
          </h2>
          {/* The fallback is the full, unfiltered grid: prerendered HTML for
              crawlers; the URL filter applies once the client reads ?category=. */}
          <Suspense fallback={<StaticProjects projects={projects} />}>
            <ProjectsExplorer projects={projects} />
          </Suspense>
        </div>
      </section>
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}

function StaticProjects({ projects }: { projects: Awaited<ReturnType<typeof getAllProjects>> }) {
  return (
    <>
      <FilterChipsStatic />
      <ProjectsGrid projects={projects} />
    </>
  );
}

function FilterChipsStatic() {
  const options = [
    { value: "all", label: copy.all },
    ...categories.map((c) => ({ value: c.value, label: c.short })),
  ];
  return (
    <FilterChips
      options={options}
      value="all"
      onChange={undefined}
      label={copy.filterLabel}
      tone="light"
    />
  );
}
