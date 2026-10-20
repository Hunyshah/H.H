// Analytics event helpers. Safe to call anywhere on the client: each provider
// is only called when its script has loaded (scripts load only when their env
// var is set — see components/analytics in phase 4).

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: GtagParams) => void;
    fbq?: (command: "track" | "trackCustom", name: string, params?: GtagParams) => void;
  }
}

export type AnalyticsEvent = "lead" | "whatsapp_click" | "call_click" | "estimate_click";

const metaNames: Record<AnalyticsEvent, { name: string; custom: boolean }> = {
  lead: { name: "Lead", custom: false },
  whatsapp_click: { name: "Contact", custom: false },
  call_click: { name: "Contact", custom: false },
  estimate_click: { name: "EstimateClick", custom: true },
};

export function trackEvent(event: AnalyticsEvent, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event === "lead" ? "generate_lead" : event, params);
    const meta = metaNames[event];
    window.fbq?.(meta.custom ? "trackCustom" : "track", meta.name, { ...params, method: event });
  } catch {
    // Analytics must never break the page.
  }
}
