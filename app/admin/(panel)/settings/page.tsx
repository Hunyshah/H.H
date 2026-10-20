import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader
        title="Settings"
        description="Contact details, stats and social links used across the site."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
