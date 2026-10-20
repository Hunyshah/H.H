import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { MediaManager } from "@/components/admin/MediaManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { buttonStyles } from "@/components/ui/button";
import { deleteProject } from "@/lib/actions/admin/projects";
import { requireAdmin } from "@/lib/auth/admin";
import { imageUrl } from "@/lib/supabase/storage";

export const metadata: Metadata = { title: "Edit project" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<"/admin/projects/[id]">) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: project }, { data: media }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_media").select("*").eq("project_id", id).order("sort_order"),
  ]);
  if (!project) notFound();

  const deleteThis = deleteProject.bind(null, project.id);

  return (
    <>
      <PageHeader
        title={project.title}
        description={project.is_published ? "Published" : "Draft — not visible on the site"}
        actions={
          project.is_published ? (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className={buttonStyles({ variant: "outline" })}
            >
              View on site ↗
            </Link>
          ) : undefined
        }
      />
      {created && (
        <p
          role="status"
          className="mb-6 rounded-xs bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Project created. Add photos below, then switch on “Published” when it&apos;s ready.
        </p>
      )}
      <div className="grid gap-6">
        <MediaManager
          projectId={project.id}
          coverPath={project.cover_image_path}
          media={(media ?? []).map((m) => ({
            id: m.id,
            type: m.type,
            storagePath: m.storage_path,
            url: imageUrl(m.storage_path),
            videoUrl: m.video_url,
            alt: m.alt,
            caption: m.caption,
            phase: m.phase,
          }))}
        />
        <ProjectForm project={project} />
        <div className="rounded-xs border border-red-200 bg-red-50/50 p-5">
          <h2 className="font-bold text-red-900">Delete project</h2>
          <p className="mt-1 mb-4 text-sm text-red-900/80">
            Removes the project, its photos and videos permanently.
          </p>
          <DeleteButton
            action={deleteThis}
            label="Delete project"
            confirmText={`Delete “${project.title}” and all its photos? This cannot be undone.`}
          />
        </div>
      </div>
    </>
  );
}
