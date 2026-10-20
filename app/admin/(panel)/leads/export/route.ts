import { isLeadStatus } from "@/lib/admin/leads";
import { NotAuthorizedError, assertAdmin } from "@/lib/auth/admin";

const COLUMNS = [
  "created_at",
  "name",
  "phone",
  "project_type",
  "plot_size",
  "location",
  "budget",
  "message",
  "status",
  "notes",
  "source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
] as const;

/** Quotes a CSV cell and neutralises spreadsheet formulas (CSV injection). */
function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  let supabase;
  try {
    ({ supabase } = await assertAdmin());
  } catch (err) {
    if (err instanceof NotAuthorizedError) return new Response("Unauthorized", { status: 401 });
    throw err;
  }

  const status = new URL(request.url).searchParams.get("status");
  let query = supabase
    .from("leads")
    .select(COLUMNS.join(","))
    .order("created_at", { ascending: false })
    .limit(10000);
  if (isLeadStatus(status)) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return new Response(error.message, { status: 500 });

  const rows = (data as unknown as Record<string, unknown>[]).map((row) =>
    COLUMNS.map((c) => cell(row[c])).join(","),
  );
  // BOM so Excel opens UTF-8 (Urdu names, en dashes) correctly.
  const csv = "﻿" + [COLUMNS.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hh-associate-leads-${status && isLeadStatus(status) ? `${status}-` : ""}${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
