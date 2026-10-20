import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { sampleServices } from "@/lib/content/samples";
import { getPublicClient } from "@/lib/supabase/public";

import { TAGS } from "./tags";

export type ServiceSummary = {
  id: string;
  slug: string;
  title: string;
  short: string | null;
};

/** All services in admin sort order (title + short description). */
export async function getServices(): Promise<ServiceSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.services);

  const supabase = getPublicClient();
  if (!supabase) return sampleServices;

  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, short")
    .order("sort_order");

  if (error) {
    console.error("[services] query failed:", error.message);
    return [];
  }
  return data;
}
