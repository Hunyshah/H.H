import "server-only";

import { telHref, whatsappHref } from "@/lib/contact";
import { siteUrl } from "@/lib/env";

export type LeadEmail = {
  name: string;
  phone: string;
  projectType: string;
  plotSize: string;
  location: string;
  budget: string;
  message: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
};

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Emails the new-lead notification through the Resend REST API (no SDK, to
 * keep dependencies small). Skipped when Resend is not configured; the lead is
 * already saved either way.
 */
export async function sendLeadEmail(lead: LeadEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!apiKey || !from || !to?.length) {
    console.warn("[lead-email] Resend not configured — skipping notification.");
    return;
  }

  const rows: [string, string | null][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Project", lead.projectType],
    ["Plot / site", lead.plotSize],
    ["Location", lead.location],
    ["Budget", lead.budget],
    ["Details", lead.message],
    [
      "Source",
      [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || null,
    ],
    ["Referrer", lead.referrer],
  ];
  const wa = whatsappHref(
    lead.phone,
    `Assalam-o-Alaikum ${lead.name}, this is H.H Associate about your ${lead.projectType.toLowerCase()} project enquiry.`,
  );

  const html = `<!doctype html><html><body style="margin:0;background:#F7F4EE;font-family:Arial,Helvetica,sans-serif;color:#15112A">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:24px">
<tr><td style="background:#15112A;padding:20px 24px;color:#F7F4EE;font-size:18px;font-weight:bold">
<span style="background:#4A3F78;padding:4px 8px">H.H</span><span style="background:#C9A24D;color:#15112A;padding:4px 8px">ASSOCIATE</span>
<div style="margin-top:12px">New estimate request</div></td></tr>
<tr><td style="background:#ffffff;padding:8px 24px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rows
  .filter((r): r is [string, string] => Boolean(r[1]))
  .map(
    ([k, v]) =>
      `<tr><td style="padding:10px 0;border-bottom:1px solid #EFEAE0;color:#5E5A6E;font-size:13px;width:110px;vertical-align:top">${k}</td><td style="padding:10px 0;border-bottom:1px solid #EFEAE0;font-size:15px;font-weight:bold">${escape(v).replace(/\n/g, "<br>")}</td></tr>`,
  )
  .join("")}
</table>
<p style="margin:24px 0 0">
<a href="${wa}" style="display:inline-block;background:#25D366;color:#15112A;padding:12px 18px;text-decoration:none;font-weight:bold;margin:0 8px 8px 0">WhatsApp</a>
<a href="${telHref(lead.phone)}" style="display:inline-block;background:#C9A24D;color:#15112A;padding:12px 18px;text-decoration:none;font-weight:bold;margin:0 8px 8px 0">Call</a>
<a href="${siteUrl}/admin/leads" style="display:inline-block;border:1px solid #15112A;color:#15112A;padding:11px 18px;text-decoration:none;font-weight:bold">Open in admin</a>
</p></td></tr></table></body></html>`;

  const text = rows
    .filter((r) => r[1])
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `New lead: ${lead.name} — ${lead.projectType}, ${lead.location}`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("[lead-email] Resend error:", res.status, await res.text());
  } catch (err) {
    console.error("[lead-email] send failed:", err instanceof Error ? err.message : err);
  }
}
