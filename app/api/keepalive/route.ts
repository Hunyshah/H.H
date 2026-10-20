import { connection } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Daily ping (Vercel Cron, see vercel.json) so the free-tier Supabase project
 * is never paused for inactivity — public pages are served from cache and may
 * not touch the database for days. Vercel sends `Authorization: Bearer
 * $CRON_SECRET`; anything else is rejected.
 */
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return Response.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive]", err instanceof Error ? err.message : err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
