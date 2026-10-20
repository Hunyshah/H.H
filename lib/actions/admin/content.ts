"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { TAGS } from "@/lib/data/tags";
import { assertAdmin } from "@/lib/auth/admin";
import {
  formObject,
  serviceSchema,
  settingsSchema,
  testimonialSchema,
} from "@/lib/validations/admin";

import { refresh } from "./revalidate";
import { fieldErrorsFrom, type FormState } from "./state";

const id = z.uuid();
const invalid = (issues: z.core.$ZodIssue[]): FormState => ({
  ok: false,
  message: "Please fix the highlighted fields.",
  fieldErrors: fieldErrorsFrom(issues),
});

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formObject(formData);
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error.issues);
  const { supabase } = await assertAdmin();

  if (raw.id) {
    const { error } = await supabase
      .from("testimonials")
      .update(parsed.data)
      .eq("id", id.parse(raw.id));
    if (error) return { ok: false, message: error.message };
    refresh(TAGS.testimonials, TAGS.projects);
    return { ok: true, message: "Testimonial saved." };
  }
  const { error } = await supabase.from("testimonials").insert(parsed.data);
  if (error) return { ok: false, message: error.message };
  refresh(TAGS.testimonials, TAGS.projects);
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(testimonialId: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id.parse(testimonialId));
  if (error) return { ok: false, message: error.message };
  refresh(TAGS.testimonials, TAGS.projects);
  redirect("/admin/testimonials");
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formObject(formData);
  let faq: unknown = [];
  try {
    faq = JSON.parse(raw.faq || "[]");
  } catch {
    return { ok: false, message: "FAQ data is invalid." };
  }
  const parsed = serviceSchema.safeParse({ ...raw, faq });
  if (!parsed.success) return invalid(parsed.error.issues);
  const { supabase } = await assertAdmin();

  if (raw.id) {
    const { error } = await supabase
      .from("services")
      .update(parsed.data)
      .eq("id", id.parse(raw.id));
    if (error) return serviceError(error);
    refresh(TAGS.services);
    return { ok: true, message: "Service saved." };
  }
  const { data, error } = await supabase.from("services").insert(parsed.data).select("id").single();
  if (error) return serviceError(error);
  refresh(TAGS.services);
  redirect(`/admin/services/${data.id}?created=1`);
}

function serviceError(error: { code?: string; message: string }): FormState {
  return error.code === "23505"
    ? { ok: false, message: "That slug is already used.", fieldErrors: { slug: "Already in use" } }
    : { ok: false, message: error.message };
}

export async function deleteService(serviceId: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id.parse(serviceId));
  if (error) return { ok: false, message: error.message };
  refresh(TAGS.services);
  redirect("/admin/services");
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = settingsSchema.safeParse(formObject(formData));
  if (!parsed.success) return invalid(parsed.error.issues);
  const { supabase } = await assertAdmin();
  const s = parsed.data;

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    address: s.address,
    map_embed_url: s.map_embed_url,
    stats: {
      projects: s.stats_projects,
      years: s.stats_years,
      sectors: s.stats_sectors,
      delivery: s.stats_delivery,
    },
    socials: { facebook: s.facebook, instagram: s.instagram, youtube: s.youtube, tiktok: s.tiktok },
  });
  if (error) return { ok: false, message: error.message };
  refresh(TAGS.settings);
  return { ok: true, message: "Settings saved. The site is updated." };
}
