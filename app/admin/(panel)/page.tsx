import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { daysAgoIso, formatDateTime, startOfMonthPkt, startOfWeekPkt } from "@/lib/admin/format";
import { sourceLabel, statusMeta } from "@/lib/admin/leads";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const since = daysAgoIso(90);
  const weekStart = startOfWeekPkt();
  const monthStart = startOfMonthPkt();

  const [{ data: recent }, { data: latest }, { count: total }] = await Promise.all([
    supabase
      .from("leads")
      .select("created_at, source, utm_source, utm_medium, referrer, status")
      .gte("created_at", since),
    supabase
      .from("leads")
      .select(
        "id, name, phone, project_type, location, status, created_at, source, utm_source, utm_medium, referrer",
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const rows = recent ?? [];
  const thisWeek = rows.filter((r) => r.created_at >= weekStart).length;
  const thisMonth = rows.filter((r) => r.created_at >= monthStart).length;
  const open = rows.filter((r) => r.status === "new").length;

  const bySource = new Map<string, number>();
  for (const r of rows.filter((r) => r.created_at >= monthStart)) {
    const key = sourceLabel(r);
    bySource.set(key, (bySource.get(key) ?? 0) + 1);
  }
  const sources = [...bySource.entries()].sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(1, ...sources.map(([, n]) => n));

  const stats = [
    { label: "Leads this week", value: thisWeek },
    { label: "Leads this month", value: thisMonth },
    { label: "New, not yet contacted (90 days)", value: open },
    { label: "All-time leads", value: total ?? 0 },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Weeks start on Monday, Pakistan time." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-2 font-display text-4xl font-bold tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Leads by source — this month</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <p className="text-sm text-muted">No leads yet this month.</p>
            ) : (
              <ul className="grid gap-3">
                {sources.map(([label, n]) => (
                  <li key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{label}</span>
                      <span className="tabular-nums">{n}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-xs bg-sand">
                      <div
                        className="h-2 rounded-xs bg-brand-purple"
                        style={{ width: `${(n / maxSource) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Latest leads</CardTitle>
            <Link href="/admin/leads" className="text-sm font-bold text-gold-text hover:underline">
              View all
            </Link>
          </CardHeader>
          <ul>
            {(latest ?? []).map((lead) => {
              const status = statusMeta(lead.status);
              return (
                <li
                  key={lead.id}
                  className="flex items-start justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="font-bold">{lead.name}</p>
                    <p className="truncate text-sm text-muted">
                      {[lead.project_type, lead.location, sourceLabel(lead)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant={status.badge}>{status.label}</Badge>
                    <p className="mt-1 text-xs text-muted">{formatDateTime(lead.created_at)}</p>
                  </div>
                </li>
              );
            })}
            {(latest ?? []).length === 0 && (
              <li className="px-5 py-4 text-sm text-muted">No leads yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}
