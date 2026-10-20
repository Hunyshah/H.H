"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { saveTestimonial } from "@/lib/actions/admin/content";
import type { Tables } from "@/lib/supabase/database.types";

import { FieldError, FormMessage } from "./FieldError";
import { useFormAction } from "./useFormAction";

type Props = {
  testimonial?: Tables<"testimonials">;
  projects: { id: string; title: string }[];
};

export function TestimonialForm({ testimonial: t, projects }: Props) {
  const { state, pending, onSubmit } = useFormAction(saveTestimonial);
  const err = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {t && <input type="hidden" name="id" value={t.id} />}
          <div>
            <Label htmlFor="client_name">Client name</Label>
            <Input
              id="client_name"
              name="client_name"
              defaultValue={t?.client_name ?? ""}
              aria-invalid={err.client_name ? true : undefined}
            />
            <FieldError message={err.client_name} />
          </div>
          <div>
            <Label htmlFor="project_id">Project (optional)</Label>
            <Select id="project_id" name="project_id" defaultValue={t?.project_id ?? ""}>
              <option value="">— None —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              name="quote"
              rows={4}
              defaultValue={t?.quote ?? ""}
              aria-invalid={err.quote ? true : undefined}
            />
            <FieldError message={err.quote} />
          </div>
          <div>
            <Label htmlFor="video_url">Video testimonial (optional YouTube link)</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              defaultValue={t?.video_url ?? ""}
              aria-invalid={err.video_url ? true : undefined}
            />
            <FieldError message={err.video_url} />
          </div>
          <div>
            <Label htmlFor="rating">Rating (optional)</Label>
            <Select id="rating" name="rating" defaultValue={t?.rating?.toString() ?? ""}>
              <option value="">— No rating —</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Switch
              name="is_published"
              label="Published on the site"
              defaultChecked={t?.is_published ?? false}
            />
            <p className="mt-1 text-xs text-muted">
              Only publish real testimonials with the client&apos;s permission.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : t ? "Save changes" : "Add testimonial"}
            </Button>
            <FormMessage state={state} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
