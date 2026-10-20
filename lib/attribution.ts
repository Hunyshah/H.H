// First-touch marketing attribution, stored in a cookie by
// components/analytics/AttributionCapture and read by the lead Server Action.

import { z } from "zod/mini";

import type { Attribution } from "./attribution-cookie";

export { ATTRIBUTION_COOKIE } from "./attribution-cookie";

const field = z.optional(z.string().check(z.maxLength(200)));

export const attributionSchema = z.object({
  utm_source: field,
  utm_medium: field,
  utm_campaign: field,
  referrer: field,
});

/** Parses the cookie value; returns {} for anything missing or malformed. */
export function parseAttribution(raw: string | undefined): Attribution {
  if (!raw) return {};
  try {
    const parsed = attributionSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}
