import type { Metadata } from "next";
import Link from "next/link";

import { LeadRow } from "@/components/admin/LeadRow";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonStyles } from "@/components/ui/button";
import { Table, Th } from "@/components/ui/table";
import { formatDateTime } from "@/lib/admin/format";
import { isLeadStatus, leadStatuses, sourceLabel } from "@/lib/admin/leads";
import { requireAdmin } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

const PAGE_SIZE = 50;

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const status = isLeadStatus(params.status) ? params.status : null;
  const page = Math.max(1, Number(params.page) || 1);

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  const { data: leads, count, error } = await query;

  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const href = (s: string | null, p = 1) => {
    const q = new URLSearchParams();
    if (s) q.set("status", s);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${count ?? 0} ${status ? `“${leadStatuses.find((s) => s.value === status)?.label}”` : "total"} · status and notes save automatically`}
        actions={
          <a
            href={`/admin/leads/export${status ? `?status=${status}` : ""}`}
            className={buttonStyles({ variant: "outline" })}
          >
            Export CSV
          </a>
        }
      />

      <nav aria-label="Filter by status" className="mb-5 flex flex-wrap gap-2">
        {[{ value: null, label: "All" }, ...leadStatuses].map((s) => (
          <Link
            key={s.label}
            href={href(s.value)}
            aria-current={status === s.value ? "page" : undefined}
            className={cn(
              buttonStyles({ variant: status === s.value ? "default" : "outline", size: "sm" }),
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {error && <p className="mb-4 text-sm text-red-800">{error.message}</p>}

      <Table>
        <thead>
          <tr>
            <Th>Received</Th>
            <Th>Client</Th>
            <Th>Project</Th>
            <Th>Source</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {(leads ?? []).map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              createdLabel={formatDateTime(lead.created_at)}
              sourceLabel={sourceLabel(lead)}
            />
          ))}
          {(leads ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                No leads{status ? " with this status" : " yet"}.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center gap-3 text-sm">
          {page > 1 && (
            <Link
              href={href(status, page - 1)}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Previous
            </Link>
          )}
          <span className="text-muted">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link
              href={href(status, page + 1)}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
