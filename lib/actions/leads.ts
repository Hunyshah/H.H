"use server";

import { cookies, headers } from "next/headers";
import { after } from "next/server";

import { ATTRIBUTION_COOKIE, parseAttribution } from "@/lib/attribution";
import { sendLeadEmail } from "@/lib/server/lead-email";
import { clientIp, hashIp, isRateLimited } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { leadSchema, normalizePhone, type LeadInput } from "@/lib/validations/lead";

export type LeadSubmission = LeadInput & {
  /** Cloudflare Turnstile token from the widget. */
  turnstileToken?: string;
  /** Honeypot: hidden from people, filled in by naive bots. */
  website?: string;
};

export type LeadResult =
  | {
      ok: true;
      /** Set for honeypot hits: show success, but don't count a conversion. */ ignored?: boolean;
    }
  | {
      ok: false;
      error: string;
      code?: "validation" | "captcha" | "rate_limited" | "server";
      fieldErrors?: Partial<Record<keyof LeadInput, string>>;
    };

const FALLBACK_ERROR =
  "We couldn't send your request right now. Please call or WhatsApp us instead.";

/**
 * Quote form submission:
 * validate (Zod) → honeypot → Turnstile → per-IP rate limit → insert lead with
 * UTM/referrer → email notification after the response. The client then
 * navigates to /thank-you, where the conversion is tracked.
 */
export async function submitLead(input: LeadSubmission): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput;
      fieldErrors[key] ??= issue.message;
    }
    return {
      ok: false,
      code: "validation",
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  // Bots that fill every field get a quiet "success" and nothing is stored.
  if (input.website) return { ok: true, ignored: true };

  const [headerList, cookieStore] = await Promise.all([headers(), cookies()]);
  const ip = clientIp(headerList);

  const captcha = await verifyTurnstile(input.turnstileToken, ip);
  if (!captcha.ok) {
    console.warn("[leads] turnstile rejected:", captcha.reason);
    return {
      ok: false,
      code: "captcha",
      error: "We couldn't confirm you're not a robot. Please try again, or contact us on WhatsApp.",
    };
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (err) {
    console.error("[leads]", err instanceof Error ? err.message : err);
    return { ok: false, code: "server", error: FALLBACK_ERROR };
  }

  const ipHash = ip ? hashIp(ip) : null;
  if (ipHash && (await isRateLimited(supabase, ipHash))) {
    return {
      ok: false,
      code: "rate_limited",
      error:
        "We've already received your requests — we'll be in touch soon. For anything urgent, please call or WhatsApp us.",
    };
  }

  const lead = parsed.data;
  const attribution = parseAttribution(cookieStore.get(ATTRIBUTION_COOKIE)?.value);
  const record = {
    name: lead.name,
    phone: normalizePhone(lead.phone),
    project_type: lead.projectType,
    plot_size: lead.plotSize,
    location: lead.location,
    budget: lead.budget,
    message: lead.message || null,
    source: "form",
    utm_source: attribution.utm_source ?? null,
    utm_medium: attribution.utm_medium ?? null,
    utm_campaign: attribution.utm_campaign ?? null,
    referrer: attribution.referrer ?? null,
    ip_hash: ipHash,
  };

  const { error } = await supabase.from("leads").insert(record);
  if (error) {
    console.error("[leads] insert failed:", error.message);
    return { ok: false, code: "server", error: FALLBACK_ERROR };
  }

  after(() =>
    sendLeadEmail({
      name: record.name,
      phone: record.phone,
      projectType: lead.projectType,
      plotSize: lead.plotSize,
      location: lead.location,
      budget: lead.budget,
      message: record.message,
      utmSource: record.utm_source,
      utmMedium: record.utm_medium,
      utmCampaign: record.utm_campaign,
      referrer: record.referrer,
    }),
  );

  return { ok: true };
}
