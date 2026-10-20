import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/**
 * Data access layer for the admin panel. Verifies the session with Supabase
 * Auth (not just the cookie) and checks membership in `public.admins`, whose
 * RLS lets a user read only their own row. Deduplicated per request.
 */
export const getAdmin = cache(async () => {
  // Admin pages are always request-time: Supabase's session handling and the
  // dashboard's date maths read the clock, which prerendering forbids.
  await connection();
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;

  return { supabase, user: { id: user.id, email: user.email ?? null } satisfies AdminUser };
});

/** For pages: redirects to the login page when the visitor isn't an admin. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class NotAuthorizedError extends Error {
  constructor() {
    super("Not authorized");
  }
}

/** For Server Actions and route handlers: throws instead of redirecting. */
export async function assertAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new NotAuthorizedError();
  return admin;
}
