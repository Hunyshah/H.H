"use client";

import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics/events";
import { LEAD_SUMMARY_KEY, type LeadSummary } from "@/lib/analytics/lead";
import { whatsappHref } from "@/lib/contact";
import { thankYou as copy } from "@/lib/content/forms";

/**
 * Fires the Lead conversion exactly once per submission (the summary is
 * removed after reading, so refreshes and direct visits don't count) and
 * offers WhatsApp with the request pre-filled.
 */
export function ThankYouActions({ whatsapp }: { whatsapp: string }) {
  const [summary, setSummary] = useState<LeadSummary | null>(null);

  useEffect(() => {
    let lead: LeadSummary | null = null;
    try {
      const raw = sessionStorage.getItem(LEAD_SUMMARY_KEY);
      if (raw) {
        sessionStorage.removeItem(LEAD_SUMMARY_KEY);
        lead = JSON.parse(raw) as LeadSummary;
      }
    } catch {
      lead = null;
    }
    if (!lead) return;
    trackEvent("lead", { project_type: lead.projectType });
    // Reading sessionStorage is only possible after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSummary(lead);
  }, []);

  const message = summary
    ? `${copy.whatsappIntro}\nName: ${summary.name}\nProject: ${summary.projectType}\nPlot: ${summary.plotSize}, ${summary.location}\nBudget: ${summary.budget}`
    : copy.whatsappIntro;

  return (
    <a
      href={whatsappHref(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { placement: "thank_you" })}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xs bg-whatsapp px-7 text-[15px] font-bold tracking-wide text-ink-950 transition hover:brightness-95"
    >
      <WhatsAppIcon size={20} />
      {copy.continueWhatsapp}
    </a>
  );
}
