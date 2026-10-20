import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { sampleBeforeAfter, sampleMedia, sampleProjects } from "@/lib/content/samples";
import type { Enums } from "@/lib/supabase/database.types";
import { getPublicClient } from "@/lib/supabase/public";
import { imageUrl } from "@/lib/supabase/storage";

import { TAGS } from "./tags";

export type ProjectCard = {
  id: string;
  slug: string;
  title: string;
  category: Enums<"project_category">;
  status: Enums<"project_status">;
  location: string | null;
  scope: string | null;
  summary: string | null;
  coverUrl: string | null;
  updatedAt?: string | null;
};

export type BeforeAfterPair = {
  projectSlug: string;
  projectTitle: string;
  before: { url: string; alt: string };
  after: { url: string; alt: string };
};

const CARD_COLUMNS =
  "id, slug, title, category, status, location, scope, summary, cover_image_path, updated_at";

type CardRow = {
  id: string;
  slug: string;
  title: string;
  category: Enums<"project_category">;
  status: Enums<"project_status">;
  location: string | null;
  scope: string | null;
  summary: string | null;
  cover_image_path: string | null;
  updated_at: string;
};

function toCard(row: CardRow): ProjectCard {
  const { cover_image_path, updated_at, ...rest } = row;
  return { ...rest, coverUrl: imageUrl(cover_image_path), updatedAt: updated_at };
}

/** Published projects flagged `is_featured`, in admin sort order. */
export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects);

  const supabase = getPublicClient();
  if (!supabase) return sampleProjects;

  const { data, error } = await supabase
    .from("projects")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("[projects] featured query failed:", error.message);
    return [];
  }
  return data.map(toCard);
}

/** Published projects that are still under construction. */
export async function getOngoingProjects(): Promise<ProjectCard[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects);

  const supabase = getPublicClient();
  if (!supabase) return sampleProjects.filter((p) => p.status === "ongoing");

  const { data, error } = await supabase
    .from("projects")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .eq("status", "ongoing")
    .order("sort_order")
    .limit(8);

  if (error) {
    console.error("[projects] ongoing query failed:", error.message);
    return [];
  }
  return data.map(toCard);
}

/**
 * One before/after image pair for the home page slider: the first featured
 * project that has at least one `before` and one `after` image.
 */
export async function getFeaturedBeforeAfter(): Promise<BeforeAfterPair | null> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects);

  const supabase = getPublicClient();
  if (!supabase) return sampleBeforeAfter;

  const { data, error } = await supabase
    .from("project_media")
    .select(
      "storage_path, alt, phase, sort_order, projects!inner(slug, title, sort_order, is_featured, is_published)",
    )
    .eq("type", "image")
    .in("phase", ["before", "after"])
    .eq("projects.is_featured", true)
    .eq("projects.is_published", true)
    .order("sort_order");

  if (error) {
    console.error("[projects] before/after query failed:", error.message);
    return null;
  }

  const byProject = new Map<
    string,
    {
      title: string;
      order: number;
      before?: BeforeAfterPair["before"];
      after?: BeforeAfterPair["after"];
    }
  >();
  for (const row of data) {
    const url = imageUrl(row.storage_path);
    if (!url) continue;
    const p = row.projects;
    const entry = byProject.get(p.slug) ?? { title: p.title, order: p.sort_order };
    const image = { url, alt: row.alt ?? p.title };
    if (row.phase === "before") entry.before ??= image;
    else entry.after ??= image;
    byProject.set(p.slug, entry);
  }

  let best: (BeforeAfterPair & { order: number }) | null = null;
  for (const [slug, v] of byProject) {
    if (v.before && v.after && (!best || v.order < best.order)) {
      best = {
        projectSlug: slug,
        projectTitle: v.title,
        before: v.before,
        after: v.after,
        order: v.order,
      };
    }
  }
  if (!best) return null;
  return {
    projectSlug: best.projectSlug,
    projectTitle: best.projectTitle,
    before: best.before,
    after: best.after,
  };
}

// ---------------------------------------------------------------------------
// Listing and detail
// ---------------------------------------------------------------------------

export type ProjectMedia = {
  id: string;
  type: Enums<"media_type">;
  url: string | null; // image URL
  videoUrl: string | null;
  alt: string;
  caption: string | null;
  phase: Enums<"media_phase">;
};

export type ProjectDetail = ProjectCard & {
  plotSize: string | null;
  coveredAreaSqft: number | null;
  floors: number | null;
  year: number | null;
  story: string | null;
  heroVideoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string | null;
  media: ProjectMedia[];
  testimonial: {
    clientName: string;
    quote: string | null;
    videoUrl: string | null;
    rating: number | null;
  } | null;
};

/** Every published project, in admin sort order (projects page, sitemap). */
export async function getAllProjects(): Promise<ProjectCard[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects);

  const supabase = getPublicClient();
  if (!supabase) return sampleProjects;

  const { data, error } = await supabase
    .from("projects")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[projects] list query failed:", error.message);
    return [];
  }
  return data.map(toCard);
}

/** One published project with its media and testimonial, or null. */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects, TAGS.project(slug));

  const supabase = getPublicClient();
  if (!supabase) return sampleProjectDetail(slug);

  const { data, error } = await supabase
    .from("projects")
    .select(
      `${CARD_COLUMNS}, plot_size, covered_area_sqft, floors, year, story, hero_video_url,
       seo_title, seo_description, updated_at,
       project_media(id, type, storage_path, video_url, alt, caption, phase, sort_order),
       testimonials(client_name, quote, video_url, rating, is_published)`,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[projects] detail query failed:", error.message);
    return null;
  }
  if (!data) return null;

  const media = [...data.project_media]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      id: m.id,
      type: m.type,
      url: imageUrl(m.storage_path),
      videoUrl: m.video_url,
      alt: m.alt || data.title,
      caption: m.caption,
      phase: m.phase,
    }));
  const t = data.testimonials.find((x) => x.is_published);

  return {
    ...toCard(data),
    plotSize: data.plot_size,
    coveredAreaSqft: data.covered_area_sqft,
    floors: data.floors,
    year: data.year,
    story: data.story,
    heroVideoUrl: data.hero_video_url,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    updatedAt: data.updated_at,
    media,
    testimonial: t
      ? { clientName: t.client_name, quote: t.quote, videoUrl: t.video_url, rating: t.rating }
      : null,
  };
}

/** Other published projects in the same category. */
export async function getRelatedProjects(
  category: Enums<"project_category">,
  excludeSlug: string,
  limit = 3,
): Promise<ProjectCard[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.category === category && p.slug !== excludeSlug).slice(0, limit);
}

/** Projects in any of the given categories (service pages). */
export async function getProjectsInCategories(
  list: Enums<"project_category">[],
  limit = 3,
): Promise<ProjectCard[]> {
  const all = await getAllProjects();
  return all.filter((p) => list.includes(p.category)).slice(0, limit);
}

function sampleProjectDetail(slug: string): ProjectDetail | null {
  const card = sampleProjects.find((p) => p.slug === slug);
  if (!card) return null;
  return {
    ...card,
    plotSize: null,
    coveredAreaSqft: null,
    floors: null,
    year: null,
    story:
      "## The client's need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]",
    heroVideoUrl: null,
    seoTitle: null,
    seoDescription: null,
    updatedAt: null,
    media: sampleMedia[slug] ?? [],
    testimonial: null,
  };
}
