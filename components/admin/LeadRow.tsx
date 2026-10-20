"use client";

import { useState, useTransition } from "react";

import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";
import { Td } from "@/components/ui/table";
import { leadStatuses } from "@/lib/admin/leads";
import { updateLead } from "@/lib/actions/admin/leads";
import { telHref, whatsappHref } from "@/lib/contact";
import type { Enums } from "@/lib/supabase/database.types";

type LeadRowProps = {
  lead: {
    id: string;
    name: string;
    phone: string;
    project_type: string | null;
    plot_size: string | null;
    location: string | null;
    budget: string | null;
    message: string | null;
    status: Enums<"lead_status">;
    notes: string | null;
  };
  createdLabel: string;
  sourceLabel: string;
};

export function LeadRow({ lead, createdLabel, sourceLabel }: LeadRowProps) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saved, setSaved] = useState(lead.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const save = (changes: { status?: Enums<"lead_status">; notes?: string }) =>
    start(async () => {
      const res = await updateLead({ id: lead.id, ...changes });
      setMessage(res.ok ? "Saved" : (res.message ?? "Error"));
      if (res.ok && changes.notes !== undefined) setSaved(changes.notes);
      setTimeout(() => setMessage(null), 2000);
    });

  const greeting = `Assalam-o-Alaikum ${lead.name}, this is H.H Associate regarding your ${lead.project_type?.toLowerCase() ?? "construction"} enquiry.`;

  return (
    <tr>
      <Td className="text-xs whitespace-nowrap text-muted">{createdLabel}</Td>
      <Td>
        <p className="font-bold">{lead.name}</p>
        <p className="text-xs text-muted tabular-nums">{lead.phone}</p>
        <div className="mt-2 flex gap-1.5">
          <a
            href={whatsappHref(lead.phone, greeting)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${lead.name}`}
            className="inline-flex size-8 items-center justify-center rounded-xs bg-whatsapp text-ink-950"
          >
            <WhatsAppIcon size={16} />
          </a>
          <a
            href={telHref(lead.phone)}
            aria-label={`Call ${lead.name}`}
            className="inline-flex size-8 items-center justify-center rounded-xs bg-gold text-ink-950"
          >
            <PhoneIcon size={16} />
          </a>
        </div>
      </Td>
      <Td>
        <p className="font-semibold">{lead.project_type}</p>
        <p className="text-xs text-muted">
          {[lead.plot_size, lead.location, lead.budget].filter(Boolean).join(" · ")}
        </p>
        {lead.message && (
          <p className="mt-1 max-w-xs text-xs whitespace-pre-line text-muted">{lead.message}</p>
        )}
      </Td>
      <Td className="text-xs">{sourceLabel}</Td>
      <Td>
        <Select
          aria-label={`Status for ${lead.name}`}
          value={status}
          disabled={pending}
          onChange={(e) => {
            const value = e.target.value as Enums<"lead_status">;
            setStatus(value);
            save({ status: value });
          }}
          className="min-w-32"
        >
          {leadStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Td>
      <Td className="min-w-56">
        <Textarea
          aria-label={`Notes for ${lead.name}`}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-sm"
        />
        <div className="mt-1.5 flex items-center gap-2">
          {notes !== saved && (
            <Button size="sm" variant="outline" disabled={pending} onClick={() => save({ notes })}>
              Save notes
            </Button>
          )}
          <span aria-live="polite" className="text-xs text-muted">
            {message}
          </span>
        </div>
      </Td>
    </tr>
  );
}
