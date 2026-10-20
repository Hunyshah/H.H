import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { deleteTestimonial } from "@/lib/actions/admin/content";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Testimonial" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function TestimonialPage({ params }: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  if (!isNew && !UUID.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: projects }, testimonial] = await Promise.all([
    supabase.from("projects").select("id, title").order("title"),
    isNew
      ? Promise.resolve(null)
      : supabase
          .from("testimonials")
          .select("*")
          .eq("id", id)
          .maybeSingle()
          .then((r) => r.data),
  ]);
  if (!isNew && !testimonial) notFound();

  return (
    <>
      <PageHeader title={testimonial ? testimonial.client_name : "New testimonial"} />
      <TestimonialForm testimonial={testimonial ?? undefined} projects={projects ?? []} />
      {testimonial && (
        <div className="mt-6">
          <DeleteButton
            action={deleteTestimonial.bind(null, testimonial.id)}
            label="Delete testimonial"
            confirmText="Delete this testimonial?"
          />
        </div>
      )}
    </>
  );
}
