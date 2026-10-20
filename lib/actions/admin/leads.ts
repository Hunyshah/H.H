"use server";

import { z } from "zod";

import { assertAdmin } from "@/lib/auth/admin";

import type { FormState } from "./state";

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "contacted", "site_visit", "quoted", "won", "lost"]).optional(),
  notes: z.string().max(5000).optional(),
});

/** Updates a lead's status and/or notes. */
export async function updateLead(input: z.input<typeof updateSchema>): Promise<FormState> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid update." };
  const { supabase } = await assertAdmin();

  const { id, ...changes } = parsed.data;
  const { error } = await supabase.from("leads").update(changes).eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Saved" };
}
