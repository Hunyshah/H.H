// Server-side validation for admin forms (full Zod: never shipped to browsers).

import { z } from "zod";

import { youTubeId } from "@/lib/video";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** "" → null for optional text fields. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

const optionalInt = (min: number, max: number) =>
  z
    .union([z.literal(""), z.coerce.number().int("Whole numbers only").min(min).max(max)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const youTubeUrl = z
  .string()
  .trim()
  .refine((v) => youTubeId(v) !== null, "Paste a YouTube link, e.g. https://youtu.be/…");

const optionalYouTube = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine(
    (v) => v === null || youTubeId(v) !== null,
    "Paste a YouTube link, e.g. https://youtu.be/…",
  );

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Enter a title").max(140),
  slug: z.string().trim().regex(SLUG, "Lowercase letters, numbers and hyphens only"),
  category: z.enum(["residential", "commercial", "industrial", "civil"]),
  status: z.enum(["completed", "ongoing"]),
  location: optionalText(120),
  plot_size: optionalText(60),
  covered_area_sqft: optionalInt(1, 10_000_000),
  floors: optionalInt(0, 200),
  scope: optionalText(120),
  year: optionalInt(1950, 2100),
  summary: optionalText(400),
  story: optionalText(20_000),
  hero_video_url: optionalYouTube,
  is_featured: checkbox,
  is_published: checkbox,
  sort_order: optionalInt(-10_000, 10_000).transform((v) => v ?? 0),
  seo_title: optionalText(70),
  seo_description: optionalText(170),
});

export const mediaPhase = z.enum(["before", "progress", "after"]);

export const newImagesSchema = z
  .array(
    z.object({
      storage_path: z
        .string()
        .regex(/^projects\/[0-9a-f-]{36}\/[\w-]+\.(webp|jpe?g|png|avif)$/, "Invalid path"),
      alt: z.string().trim().min(3, "Alt text is required").max(200),
      caption: optionalText(200),
      phase: mediaPhase,
    }),
  )
  .min(1)
  .max(40);

export const mediaUpdateSchema = z.object({
  alt: z.string().trim().min(3, "Alt text is required").max(200).optional(),
  caption: optionalText(200),
  phase: mediaPhase.optional(),
});

export const newVideoSchema = z.object({
  video_url: youTubeUrl,
  caption: optionalText(200),
  phase: mediaPhase,
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Enter a title").max(120),
  slug: z.string().trim().regex(SLUG, "Lowercase letters, numbers and hyphens only"),
  short: optionalText(300),
  body: optionalText(20_000),
  faq: z
    .array(
      z.object({ q: z.string().trim().min(3).max(300), a: z.string().trim().min(2).max(2000) }),
    )
    .max(30),
  sort_order: optionalInt(-10_000, 10_000).transform((v) => v ?? 0),
});

export const testimonialSchema = z
  .object({
    client_name: z.string().trim().min(2, "Enter the client's name").max(100),
    project_id: z
      .string()
      .optional()
      .transform((v) => (v ? v : null))
      .pipe(z.uuid().nullable()),
    quote: optionalText(1500),
    video_url: optionalYouTube,
    rating: optionalInt(1, 5),
    is_published: checkbox,
  })
  .refine((t) => t.quote || t.video_url, { message: "Add a quote or a video", path: ["quote"] });

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https:\/\/[^\s]+$/.test(v), "Must be a full https:// link");

export const settingsSchema = z.object({
  phone: z.string().trim().min(5, "Enter a phone number").max(40),
  whatsapp: z.string().trim().min(5, "Enter a WhatsApp number").max(40),
  email: z.string().trim().max(120),
  address: z.string().trim().min(5).max(300),
  map_embed_url: optionalUrl.refine(
    (v) => v === null || v.startsWith("https://www.google.com/maps/embed"),
    "Use the “Embed a map” link from Google Maps (starts with https://www.google.com/maps/embed)",
  ),
  stats_projects: z.string().trim().min(1).max(12),
  stats_years: z.string().trim().min(1).max(12),
  stats_sectors: z.string().trim().min(1).max(12),
  stats_delivery: z.string().trim().min(1).max(12),
  facebook: optionalUrl,
  instagram: optionalUrl,
  youtube: optionalUrl,
  tiktok: optionalUrl,
});

/** FormData → plain object of strings (last value wins). */
export function formObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) out[key] = value;
  }
  return out;
}
