import { categoryLabel } from "@/lib/content/projects";
import { site } from "@/lib/content/site";
import { TAGS } from "@/lib/data/tags";
import { getAllProjects, getProjectBySlug } from "@/lib/data/projects";
import { siteUrl } from "@/lib/env";
import { OG_SIZE, jpegResponse, renderOgJpeg } from "@/lib/og/render";

export const alt = `Project by ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/jpeg";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.length > 0
    ? projects.map((p) => ({ slug: p.slug }))
    : [{ slug: "__no-projects__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const host = new URL(siteUrl).host;

  return jpegResponse(
    await renderOgJpeg({
      title: project?.title ?? site.name,
      eyebrow: project
        ? [categoryLabel(project.category), project.location].filter(Boolean).join(" · ")
        : "Construction · Faisalabad",
      photoUrl: project?.coverUrl ?? null,
      footer: `${site.name} · ${host}`,
      tags: [TAGS.project(slug)],
    }),
  );
}
