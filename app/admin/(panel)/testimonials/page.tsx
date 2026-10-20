import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage({
  searchParams,
}: PageProps<"/admin/testimonials">) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;
  const { data } = await supabase
    .from("testimonials")
    .select("id, client_name, quote, video_url, rating, is_published, projects(title)")
    .order("client_name");

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="The home page section is hidden until at least one testimonial is published."
        actions={
          <Link href="/admin/testimonials/new" className={buttonStyles({ variant: "gold" })}>
            New testimonial
          </Link>
        }
      />
      {saved && (
        <p
          role="status"
          className="mb-4 rounded-xs bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Testimonial saved.
        </p>
      )}
      <Table>
        <thead>
          <tr>
            <Th>Client</Th>
            <Th>Quote</Th>
            <Th>Project</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((t) => (
            <tr key={t.id}>
              <Td>
                <Link href={`/admin/testimonials/${t.id}`} className="font-bold hover:underline">
                  {t.client_name}
                </Link>
                {t.rating && <p className="text-xs text-gold-text">{"★".repeat(t.rating)}</p>}
              </Td>
              <Td className="max-w-md text-muted">
                {t.quote
                  ? `${t.quote.slice(0, 140)}${t.quote.length > 140 ? "…" : ""}`
                  : t.video_url
                    ? "Video testimonial"
                    : ""}
              </Td>
              <Td>{t.projects?.title ?? "—"}</Td>
              <Td>
                <Badge variant={t.is_published ? "success" : "default"}>
                  {t.is_published ? "Published" : "Hidden"}
                </Badge>
              </Td>
            </tr>
          ))}
          {(data ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                No testimonials yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
