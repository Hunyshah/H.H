import type { Enums } from "@/lib/supabase/database.types";

export const leadStatuses: {
  value: Enums<"lead_status">;
  label: string;
  badge: "info" | "warning" | "default" | "gold" | "success" | "danger";
}[] = [
  { value: "new", label: "New", badge: "info" },
  { value: "contacted", label: "Contacted", badge: "warning" },
  { value: "site_visit", label: "Site visit", badge: "default" },
  { value: "quoted", label: "Quoted", badge: "gold" },
  { value: "won", label: "Won", badge: "success" },
  { value: "lost", label: "Lost", badge: "danger" },
];

export function isLeadStatus(v: unknown): v is Enums<"lead_status"> {
  return leadStatuses.some((s) => s.value === v);
}

export function statusMeta(v: Enums<"lead_status">) {
  return leadStatuses.find((s) => s.value === v) ?? leadStatuses[0]!;
}

/** "facebook / paid_social" style label for a lead's attribution. */
export function sourceLabel(lead: {
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  referrer: string | null;
}): string {
  if (lead.utm_source) return [lead.utm_source, lead.utm_medium].filter(Boolean).join(" / ");
  if (lead.referrer) {
    try {
      return new URL(lead.referrer).hostname.replace(/^www\./, "");
    } catch {
      return "referral";
    }
  }
  return lead.source === "whatsapp" ? "WhatsApp" : "Direct";
}
