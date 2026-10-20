import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getPublicClient } from "@/lib/supabase/public";

import { TAGS } from "./tags";

export type Testimonial = {
  id: string;
  clientName: string;
  quote: string | null;
  videoUrl: string | null;
  rating: number | null;
  project: { slug: string; title: string } | null;
};

/** Published testimonials. Empty when none exist (the section then hides). */
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.testimonials);

  const supabase = getPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, quote, video_url, rating, projects(slug, title, is_published)")
    .eq("is_published", true)
    .limit(12);

  if (error) {
    console.error("[testimonials] query failed:", error.message);
    return [];
  }

  return data.map((t) => ({
    id: t.id,
    clientName: t.client_name,
    quote: t.quote,
    videoUrl: t.video_url,
    rating: t.rating,
    // RLS hides unpublished projects, so the join is null for them.
    project: t.projects ? { slug: t.projects.slug, title: t.projects.title } : null,
  }));
}
