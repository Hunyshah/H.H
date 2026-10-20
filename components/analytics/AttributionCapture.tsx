"use client";

import { useEffect } from "react";

import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE,
  type Attribution,
} from "@/lib/attribution-cookie";

const clip = (v: string | null) => (v ? v.slice(0, 200) : undefined);

function readCookie(): Attribution | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${ATTRIBUTION_COOKIE}=([^;]*)`));
  if (!match?.[1]) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as Attribution;
  } catch {
    return null;
  }
}

/**
 * Stores first-touch attribution (UTM parameters + external referrer) in a
 * first-party cookie, read by the lead Server Action. A later visit that
 * carries UTM parameters replaces an earlier visit that had none.
 */
export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Attribution = {
      utm_source: clip(params.get("utm_source")),
      utm_medium: clip(params.get("utm_medium")),
      utm_campaign: clip(params.get("utm_campaign")),
    };
    const hasUtm = Boolean(utm.utm_source || utm.utm_medium || utm.utm_campaign);
    const existing = readCookie();
    if (existing && (existing.utm_source || !hasUtm)) return;

    let referrer: string | undefined;
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.host !== window.location.host) referrer = clip(ref.origin + ref.pathname);
    } catch {
      referrer = undefined;
    }
    if (!hasUtm && !referrer && existing) return;

    const value = encodeURIComponent(
      JSON.stringify({ ...utm, referrer: referrer ?? existing?.referrer }),
    );
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTRIBUTION_COOKIE}=${value}; Max-Age=${ATTRIBUTION_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  }, []);

  return null;
}
