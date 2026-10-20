import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { sampleServices } from "@/lib/content/samples";
import type { Json } from "@/lib/supabase/database.types";
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

export type FaqItem = { q: string; a: string };

export type ServiceDetail = ServiceSummary & {
  body: string | null;
  faq: FaqItem[];
};

function parseFaq(value: Json): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    typeof item.q === "string" &&
    typeof item.a === "string"
      ? [{ q: item.q, a: item.a }]
      : [],
  );
}

/** One service with body and FAQ, or null. */
export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.services);

  const supabase = getPublicClient();
  if (!supabase) {
    const s = sampleServices.find((x) => x.slug === slug);
    return s ? { ...s, body: null, faq: [] } : null;
  }

  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, short, body, faq")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[services] detail query failed:", error.message);
    return null;
  }
  return data ? { ...data, faq: parseFaq(data.faq) } : null;
}
