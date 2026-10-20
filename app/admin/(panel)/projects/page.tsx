import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectToggles } from "@/components/admin/ProjectToggles";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { categoryLabel } from "@/lib/content/projects";
import { requireAdmin } from "@/lib/auth/admin";
import { imageUrl } from "@/lib/supabase/storage";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const { supabase } = await requireAdmin();
  const { deleted } = await searchParams;
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, category, status, location, is_published, is_featured, sort_order, cover_image_path, updated_at",
    )
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Changes appear on the public site immediately."
        actions={
          <Link href="/admin/projects/new" className={buttonStyles({ variant: "gold" })}>
            New project
          </Link>
        }
      />
      {deleted && (
        <p
          role="status"
          className="mb-4 rounded-xs bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Project deleted.
        </p>
      )}
      {error && <p className="mb-4 text-sm text-red-800">{error.message}</p>}
      <Table>
        <thead>
          <tr>
            <Th className="w-20">Cover</Th>
            <Th>Project</Th>
            <Th>Sector</Th>
            <Th>Status</Th>
            <Th>Visibility</Th>
            <Th className="w-16">Order</Th>
          </tr>
        </thead>
        <tbody>
          {(projects ?? []).map((p) => {
            const cover = imageUrl(p.cover_image_path);
            return (
              <tr key={p.id}>
                <Td>
                  <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-ink-900">
                    {cover && (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="64px"
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                </Td>
                <Td>
                  <Link href={`/admin/projects/${p.id}`} className="font-bold hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted">
                    /projects/{p.slug}
                    {p.location ? ` · ${p.location}` : ""}
                  </p>
                </Td>
                <Td>{categoryLabel(p.category, true)}</Td>
                <Td>
                  <Badge variant={p.status === "ongoing" ? "warning" : "default"}>
                    {p.status === "ongoing" ? "Ongoing" : "Completed"}
                  </Badge>
                </Td>
                <Td>
                  <ProjectToggles
                    id={p.id}
                    title={p.title}
                    published={p.is_published}
                    featured={p.is_featured}
                  />
                </Td>
                <Td className="tabular-nums">{p.sort_order}</Td>
              </tr>
            );
          })}
          {(projects ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                No projects yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
