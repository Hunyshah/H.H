import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { defaultSettings } from "@/lib/content/defaults";
import type { Json } from "@/lib/supabase/database.types";
import { getPublicClient } from "@/lib/supabase/public";

import { TAGS } from "./tags";

export type SiteStats = {
  projects: string;
  years: string;
  sectors: string;
  delivery: string;
};

export type SocialKey = "facebook" | "instagram" | "youtube" | "tiktok";

export type SiteSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl: string | null;
  stats: SiteStats;
  socials: Record<SocialKey, string | null>;
};

function asRecord(value: Json | null): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function str(value: Json | undefined, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function optionalStr(value: Json | undefined): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/** Contact details, stats and social links. Cached; revalidated with the `settings` tag. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.settings);

  const supabase = getPublicClient();
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[settings] query failed:", error.message);
    return defaultSettings;
  }

  const stats = asRecord(data.stats);
  const socials = asRecord(data.socials);
  const d = defaultSettings;

  return {
    phone: data.phone || d.phone,
    whatsapp: data.whatsapp || d.whatsapp,
    email: data.email || d.email,
    address: data.address || d.address,
    mapEmbedUrl: data.map_embed_url,
    stats: {
      projects: str(stats.projects, d.stats.projects),
      years: str(stats.years, d.stats.years),
      sectors: str(stats.sectors, d.stats.sectors),
      delivery: str(stats.delivery, d.stats.delivery),
    },
    socials: {
      facebook: optionalStr(socials.facebook),
      instagram: optionalStr(socials.instagram),
      youtube: optionalStr(socials.youtube),
      tiktok: optionalStr(socials.tiktok),
    },
  };
}
