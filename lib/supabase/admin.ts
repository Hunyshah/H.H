import "server-only";

import { createClient } from "@supabase/supabase-js";

import { supabaseUrl } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Service-role client. Bypasses RLS, so use it only in trusted server code
 * (e.g. inserting leads from the quote-form Server Action). Never import it
 * from a client component.
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
