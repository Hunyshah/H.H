import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { buttonStyles } from "@/components/ui/button";
import { deleteService } from "@/lib/actions/admin/content";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Service" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ServicePage({
  params,
  searchParams,
}: PageProps<"/admin/services/[id]">) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === "new";
  if (!isNew && !UUID.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const service = isNew
    ? null
    : (await supabase.from("services").select("*").eq("id", id).maybeSingle()).data;
  if (!isNew && !service) notFound();

  const faq = Array.isArray(service?.faq)
    ? service.faq.flatMap((f) =>
        f &&
        typeof f === "object" &&
        !Array.isArray(f) &&
        typeof f.q === "string" &&
        typeof f.a === "string"
          ? [{ q: f.q, a: f.a }]
          : [],
      )
    : [];

  return (
    <>
      <PageHeader
        title={service?.title ?? "New service"}
        actions={
          service ? (
            <Link
              href={`/services/${service.slug}`}
              target="_blank"
              className={buttonStyles({ variant: "outline" })}
            >
              View on site ↗
            </Link>
          ) : undefined
        }
      />
      {created && (
        <p
          role="status"
          className="mb-6 rounded-xs bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Service created.
        </p>
      )}
      <ServiceForm service={service ? { ...service, faq } : undefined} />
      {service && (
        <div className="mt-6">
          <DeleteButton
            action={deleteService.bind(null, service.id)}
            label="Delete service"
            confirmText={`Delete “${service.title}”? Its page will stop working.`}
          />
        </div>
      )}
    </>
  );
}
