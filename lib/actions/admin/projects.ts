"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { assertAdmin } from "@/lib/auth/admin";
import { PROJECT_IMAGES_BUCKET } from "@/lib/supabase/storage";
import {
  formObject,
  mediaUpdateSchema,
  newImagesSchema,
  newVideoSchema,
  projectSchema,
} from "@/lib/validations/admin";

import { refreshProject } from "./revalidate";
import { fieldErrorsFrom, type FormState } from "./state";

const id = z.uuid();

/** Create (no `id` field) or update a project. New projects go to their edit page to add media. */
export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formObject(formData);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }
  const { supabase } = await assertAdmin();
  const projectId = raw.id ? id.safeParse(raw.id) : null;

  if (projectId && !projectId.success) return { ok: false, message: "Invalid project." };

  if (projectId?.success) {
    const { data: before } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", projectId.data)
      .maybeSingle();
    const { error } = await supabase.from("projects").update(parsed.data).eq("id", projectId.data);
    if (error) return dbError(error);
    refreshProject(before?.slug, parsed.data.slug);
    return { ok: true, message: "Project saved." };
  }

  const { data, error } = await supabase.from("projects").insert(parsed.data).select("id").single();
  if (error) return dbError(error);
  refreshProject(parsed.data.slug);
  redirect(`/admin/projects/${data.id}?created=1`);
}

function dbError(error: { code?: string; message: string }): FormState {
  if (error.code === "23505") {
    return {
      ok: false,
      message: "That slug is already used by another project.",
      fieldErrors: { slug: "Already in use" },
    };
  }
  return { ok: false, message: error.message };
}

/** Quick toggle from the project list. */
export async function setProjectFlag(
  projectId: string,
  flag: "is_published" | "is_featured",
  value: boolean,
) {
  const { supabase } = await assertAdmin();
  const { data, error } = await supabase
    .from("projects")
    .update(flag === "is_published" ? { is_published: value } : { is_featured: value })
    .eq("id", id.parse(projectId))
    .select("slug")
    .single();
  if (error) return { ok: false, message: error.message };
  refreshProject(data.slug);
  return { ok: true };
}

/** Deletes a project, its media rows (cascade) and its uploaded files. */
export async function deleteProject(projectId: string) {
  const { supabase } = await assertAdmin();
  const pid = id.parse(projectId);

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", pid)
    .maybeSingle();
  const { data: files } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .list(`projects/${pid}`, { limit: 1000 });
  if (files?.length) {
    await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .remove(files.map((f) => `projects/${pid}/${f.name}`));
  }
  const { error } = await supabase.from("projects").delete().eq("id", pid);
  if (error) return { ok: false, message: error.message };

  refreshProject(project?.slug);
  redirect("/admin/projects?deleted=1");
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

async function projectSlug(
  supabase: Awaited<ReturnType<typeof assertAdmin>>["supabase"],
  projectId: string,
) {
  const { data } = await supabase.from("projects").select("slug").eq("id", projectId).maybeSingle();
  return data?.slug;
}

/** Registers images already uploaded to Storage (client-side compressed). */
export async function addProjectImages(projectId: string, images: z.input<typeof newImagesSchema>) {
  const pid = id.parse(projectId);
  const parsed = newImagesSchema.safeParse(images);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid images" };
  if (parsed.data.some((img) => !img.storage_path.startsWith(`projects/${pid}/`))) {
    return { ok: false, message: "Image path does not belong to this project." };
  }
  const { supabase } = await assertAdmin();

  const { data: last } = await supabase
    .from("project_media")
    .select("sort_order")
    .eq("project_id", pid)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const start = (last?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("project_media").insert(
    parsed.data.map((img, i) => ({
      ...img,
      project_id: pid,
      type: "image" as const,
      sort_order: start + i,
    })),
  );
  if (error) return { ok: false, message: error.message };

  // First images of a project without a cover become the cover automatically.
  const { data: project } = await supabase
    .from("projects")
    .select("slug, cover_image_path")
    .eq("id", pid)
    .single();
  if (project && !project.cover_image_path) {
    const cover = parsed.data.find((i) => i.phase === "after") ?? parsed.data[0]!;
    await supabase.from("projects").update({ cover_image_path: cover.storage_path }).eq("id", pid);
  }
  refreshProject(project?.slug);
  return { ok: true };
}

export async function addProjectVideo(projectId: string, input: z.input<typeof newVideoSchema>) {
  const pid = id.parse(projectId);
  const parsed = newVideoSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid video" };
  const { supabase } = await assertAdmin();

  const { count } = await supabase
    .from("project_media")
    .select("id", { count: "exact", head: true })
    .eq("project_id", pid);
  const { error } = await supabase.from("project_media").insert({
    ...parsed.data,
    project_id: pid,
    type: "video",
    sort_order: (count ?? 0) + 1,
    alt: parsed.data.caption,
  });
  if (error) return { ok: false, message: error.message };
  refreshProject(await projectSlug(supabase, pid));
  return { ok: true };
}

export async function updateMedia(mediaId: string, input: z.input<typeof mediaUpdateSchema>) {
  const parsed = mediaUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  const { supabase } = await assertAdmin();
  const { data, error } = await supabase
    .from("project_media")
    .update(parsed.data)
    .eq("id", id.parse(mediaId))
    .select("project_id")
    .single();
  if (error) return { ok: false, message: error.message };
  refreshProject(await projectSlug(supabase, data.project_id));
  return { ok: true };
}

/** Saves a new order: `orderedIds` from first to last. */
export async function reorderMedia(projectId: string, orderedIds: string[]) {
  const pid = id.parse(projectId);
  const ids = z.array(z.uuid()).max(200).parse(orderedIds);
  const { supabase } = await assertAdmin();
  const results = await Promise.all(
    ids.map((mid, i) =>
      supabase
        .from("project_media")
        .update({ sort_order: i + 1 })
        .eq("id", mid)
        .eq("project_id", pid),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, message: failed.error.message };
  refreshProject(await projectSlug(supabase, pid));
  return { ok: true };
}

export async function deleteMedia(mediaId: string) {
  const { supabase } = await assertAdmin();
  const { data: media, error } = await supabase
    .from("project_media")
    .delete()
    .eq("id", id.parse(mediaId))
    .select("project_id, storage_path")
    .single();
  if (error) return { ok: false, message: error.message };

  if (media.storage_path && !/^https?:\/\//.test(media.storage_path)) {
    await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([media.storage_path]);
    // Clear the cover if it pointed at this file.
    await supabase
      .from("projects")
      .update({ cover_image_path: null })
      .eq("id", media.project_id)
      .eq("cover_image_path", media.storage_path);
  }
  refreshProject(await projectSlug(supabase, media.project_id));
  return { ok: true };
}

export async function setCover(projectId: string, path: string) {
  const pid = id.parse(projectId);
  const cover = z.string().min(1).max(500).parse(path);
  const { supabase } = await assertAdmin();
  const { data, error } = await supabase
    .from("projects")
    .update({ cover_image_path: cover })
    .eq("id", pid)
    .select("slug")
    .single();
  if (error) return { ok: false, message: error.message };
  refreshProject(data.slug);
  return { ok: true };
}
