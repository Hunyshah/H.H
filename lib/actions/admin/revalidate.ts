import "server-only";

import { updateTag } from "next/cache";

import { TAGS } from "@/lib/data/tags";

/**
 * Expires public cache entries after an admin save, so the change is live on
 * the next request (no redeploy). Server Actions use updateTag for
 * read-your-own-writes semantics.
 */
export function refresh(...tags: string[]) {
  for (const tag of new Set(tags)) updateTag(tag);
}

export const refreshProject = (...slugs: (string | null | undefined)[]) =>
  refresh(TAGS.projects, ...slugs.filter((s): s is string => Boolean(s)).map(TAGS.project));
