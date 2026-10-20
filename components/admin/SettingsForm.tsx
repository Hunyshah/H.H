"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { saveSettings } from "@/lib/actions/admin/content";
import type { SiteSettings } from "@/lib/data/settings";

import { FieldError, FormMessage } from "./FieldError";
import { useFormAction } from "./useFormAction";

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const { state, pending, onSubmit } = useFormAction(saveSettings);
  const err = state.fieldErrors ?? {};
  const text = (
    name: string,
    label: string,
    value: string | null,
    hint?: string,
    type = "text",
  ) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={value ?? ""}
        aria-invalid={err[name] ? true : undefined}
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <FieldError message={err[name]} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {text("phone", "Phone (shown on the site)", s.phone, "e.g. 0300-1234567")}
          {text(
            "whatsapp",
            "WhatsApp number",
            s.whatsapp,
            "International format without +, e.g. 923001234567",
          )}
          {text("email", "Email", s.email, undefined, "email")}
          <div className="md:col-span-2">
            <Label htmlFor="address">Office address</Label>
            <Textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={s.address}
              aria-invalid={err.address ? true : undefined}
            />
            <FieldError message={err.address} />
          </div>
          <div className="md:col-span-2">
            {text(
              "map_embed_url",
              "Google Maps embed link",
              s.mapEmbedUrl,
              'Google Maps → Share → Embed a map → copy only the src="…" link (starts with https://www.google.com/maps/embed)',
              "url",
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats band</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {text("stats_projects", "Projects completed", s.stats.projects, "e.g. 50+")}
          {text("stats_years", "Years of experience", s.stats.years, "e.g. 10+")}
          {text("stats_sectors", "Sectors served", s.stats.sectors)}
          {text("stats_delivery", "Design to handover", s.stats.delivery)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {text("facebook", "Facebook page", s.socials.facebook, undefined, "url")}
          {text("instagram", "Instagram", s.socials.instagram, undefined, "url")}
          {text("youtube", "YouTube channel", s.socials.youtube, undefined, "url")}
          {text("tiktok", "TikTok", s.socials.tiktok, undefined, "url")}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
