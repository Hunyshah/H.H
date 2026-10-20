import "server-only";

import { createHmac } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/** Limits per IP: a burst limit and a daily cap. */
const LIMITS = [
  { windowMs: 10 * 60 * 1000, max: 3 },
  { windowMs: 24 * 60 * 60 * 1000, max: 10 },
];

/** Keyed hash of the client IP, so raw IPs are never stored. */
export function hashIp(ip: string): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "hh-associate";
  return createHmac("sha256", key).update(ip).digest("hex");
}

/** First address in x-forwarded-for (set by Vercel), else x-real-ip. */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || null;
}

/** True when this IP hash has already sent too many leads recently. Fails open on errors. */
export async function isRateLimited(
  supabase: SupabaseClient<Database>,
  ipHash: string,
): Promise<boolean> {
  const longest = Math.max(...LIMITS.map((l) => l.windowMs));
  const since = new Date(Date.now() - longest).toISOString();

  const { data, error } = await supabase
    .from("leads")
    .select("created_at")
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(Math.max(...LIMITS.map((l) => l.max)));

  if (error) {
    console.error("[rate-limit] query failed:", error.message);
    return false;
  }

  const now = Date.now();
  return LIMITS.some(
    ({ windowMs, max }) =>
      data.filter((r) => now - new Date(r.created_at).getTime() < windowMs).length >= max,
  );
}
