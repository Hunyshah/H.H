"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { leadSchema, normalizePhone, type LeadInput } from "@/lib/validations/lead";

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof LeadInput, string>> };

/**
 * Saves a quote request. Phase 4 adds Turnstile verification, IP rate limiting,
 * UTM/referrer capture, the Resend notification and the /thank-you redirect.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const lead = parsed.data;
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("leads").insert({
      name: lead.name,
      phone: normalizePhone(lead.phone),
      project_type: lead.projectType,
      plot_size: lead.plotSize,
      location: lead.location,
      budget: lead.budget,
      message: lead.message || null,
      source: "form",
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[leads] insert failed:", err instanceof Error ? err.message : err);
    return {
      ok: false,
      error: "We couldn't send your request right now. Please call or WhatsApp us instead.",
    };
  }

  return { ok: true };
}
