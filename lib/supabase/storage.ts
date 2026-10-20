import { supabaseUrl } from "@/lib/env";

export const PROJECT_IMAGES_BUCKET = "project-images";

/**
 * Resolves an image reference to a URL. Values may be a storage path inside the
 * `project-images` bucket (uploaded from the admin panel) or an absolute URL
 * (placeholder images in the seed data).
 */
export function imageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  if (!supabaseUrl) return null;
  const clean = pathOrUrl.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/${clean}`;
}
