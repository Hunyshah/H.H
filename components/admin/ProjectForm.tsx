"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { saveProject } from "@/lib/actions/admin/projects";
import { categories } from "@/lib/content/projects";
import { slugify } from "@/lib/slug";
import type { Tables } from "@/lib/supabase/database.types";

import { FieldError, FormMessage } from "./FieldError";
import { useFormAction } from "./useFormAction";

type ProjectFormProps = { project?: Tables<"projects"> };

export function ProjectForm({ project }: ProjectFormProps) {
  const { state, pending, onSubmit } = useFormAction(saveProject);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  // New projects follow the title until the slug is edited by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const err = state.fieldErrors ?? {};

  const field = (name: string) => ({
    id: name,
    name,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${name}-error` : undefined,
  });
  const v = (value: string | number | null | undefined) => (value == null ? "" : String(value));

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              {...field("title")}
              value={title}
              required
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
            <FieldError id="title-error" message={err.title} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm text-muted">/projects/</span>
              <Input
                {...field("slug")}
                value={slug}
                required
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value) || e.target.value.toLowerCase());
                }}
              />
            </div>
            {project && slug !== project.slug && (
              <p className="mt-1.5 text-sm text-amber-800">
                Changing the slug breaks links already shared on WhatsApp or social media.
              </p>
            )}
            <FieldError id="slug-error" message={err.slug} />
          </div>
          <div>
            <Label htmlFor="category">Sector</Label>
            <Select {...field("category")} defaultValue={project?.category ?? "residential"}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select {...field("status")} defaultValue={project?.status ?? "completed"}>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing / under construction</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="summary">
              Summary (one or two sentences, shown on cards and previews)
            </Label>
            <Textarea {...field("summary")} rows={2} defaultValue={v(project?.summary)} />
            <FieldError id="summary-error" message={err.summary} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project facts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["location", "Location", "e.g. Khurrianwala, Faisalabad", "text"],
              ["plot_size", "Plot / site size", "e.g. 10 Marla, 4 Kanal", "text"],
              ["covered_area_sqft", "Covered area (sq ft)", "e.g. 4500", "number"],
              ["floors", "Floors", "e.g. 2", "number"],
              ["scope", "Scope", "e.g. Design + Turnkey", "text"],
              ["year", "Year completed", "e.g. 2024", "number"],
            ] as const
          ).map(([name, label, placeholder, type]) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                {...field(name)}
                type={type}
                inputMode={type === "number" ? "numeric" : undefined}
                placeholder={placeholder}
                defaultValue={v(project?.[name])}
              />
              <FieldError id={`${name}-error`} message={err[name]} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Story</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div>
            <Label htmlFor="story">Client need and what we did</Label>
            <Textarea
              {...field("story")}
              rows={10}
              defaultValue={v(project?.story)}
              className="font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-muted">
              Markdown: <code>## Heading</code>, <code>- bullet</code>, <code>**bold**</code>,{" "}
              <code>[link](https://…)</code>. Leave a blank line between paragraphs.
            </p>
            <FieldError id="story-error" message={err.story} />
          </div>
          <div>
            <Label htmlFor="hero_video_url">
              Hero video (optional YouTube link, shown instead of the cover image)
            </Label>
            <Input
              {...field("hero_video_url")}
              type="url"
              placeholder="https://youtu.be/…"
              defaultValue={v(project?.hero_video_url)}
            />
            <FieldError id="hero_video_url-error" message={err.hero_video_url} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility & search</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-wrap gap-6 md:col-span-2">
            <Switch
              name="is_published"
              label="Published (visible on the site)"
              defaultChecked={project?.is_published ?? false}
            />
            <Switch
              name="is_featured"
              label="Featured on the home page"
              defaultChecked={project?.is_featured ?? false}
            />
          </div>
          <div>
            <Label htmlFor="sort_order">Sort order (lower shows first)</Label>
            <Input
              {...field("sort_order")}
              type="number"
              defaultValue={v(project?.sort_order ?? 0)}
            />
          </div>
          <div />
          <div>
            <Label htmlFor="seo_title">SEO title (optional, max 70)</Label>
            <Input {...field("seo_title")} maxLength={70} defaultValue={v(project?.seo_title)} />
            <FieldError id="seo_title-error" message={err.seo_title} />
          </div>
          <div>
            <Label htmlFor="seo_description">SEO description (optional, max 170)</Label>
            <Input
              {...field("seo_description")}
              maxLength={170}
              defaultValue={v(project?.seo_description)}
            />
            <FieldError id="seo_description-error" message={err.seo_description} />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-4 border-t border-line bg-ivory/95 px-5 py-4 lg:-mx-8 lg:px-8">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending ? "Saving…" : project ? "Save changes" : "Create project"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
