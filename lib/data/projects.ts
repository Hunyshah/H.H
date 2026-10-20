import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { sampleBeforeAfter, sampleProjects } from "@/lib/content/samples";
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
};

export type BeforeAfterPair = {
  projectSlug: string;
  projectTitle: string;
  before: { url: string; alt: string };
  after: { url: string; alt: string };
};

const CARD_COLUMNS =
  "id, slug, title, category, status, location, scope, summary, cover_image_path";

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
};

function toCard(row: CardRow): ProjectCard {
  const { cover_image_path, ...rest } = row;
  return { ...rest, coverUrl: imageUrl(cover_image_path) };
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
