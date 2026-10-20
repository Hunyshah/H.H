import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { buttonStyles } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("services")
    .select("id, title, slug, short, faq, sort_order")
    .order("sort_order");

  return (
    <>
      <PageHeader
        title="Services"
        actions={
          <Link href="/admin/services/new" className={buttonStyles({ variant: "gold" })}>
            New service
          </Link>
        }
      />
      <Table>
        <thead>
          <tr>
            <Th className="w-16">Order</Th>
            <Th>Service</Th>
            <Th>Short description</Th>
            <Th className="w-20">FAQs</Th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((s) => (
            <tr key={s.id}>
              <Td className="tabular-nums">{s.sort_order}</Td>
              <Td>
                <Link href={`/admin/services/${s.id}`} className="font-bold hover:underline">
                  {s.title}
                </Link>
                <p className="text-xs text-muted">/services/{s.slug}</p>
              </Td>
              <Td className="text-muted">{s.short}</Td>
              <Td className="tabular-nums">{Array.isArray(s.faq) ? s.faq.length : 0}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
