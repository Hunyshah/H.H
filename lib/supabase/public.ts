import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null = null;

/**
 * Cookie-less anon client for public, cacheable reads (`"use cache"` functions).
 * RLS limits it to published content. Returns null when Supabase is not configured.
 */
export function getPublicClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Opt out of Next's fetch Data Cache: its entries are keyed by URL and
    // carry no tags, so they would survive updateTag() and serve stale rows.
    // Caching happens one level up, in tagged "use cache" functions.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return client;
}
