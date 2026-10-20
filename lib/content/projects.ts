// Project taxonomy labels shared by filters, cards and forms.

import type { Enums } from "@/lib/supabase/database.types";

export type ProjectCategory = Enums<"project_category">;

export const categories: { value: ProjectCategory; label: string; short: string }[] = [
  { value: "residential", label: "Residential", short: "Residential" },
  { value: "commercial", label: "Commercial", short: "Commercial" },
  { value: "industrial", label: "Industrial & Factories", short: "Industrial" },
  { value: "civil", label: "Civil Works", short: "Civil Works" },
];

export function categoryLabel(value: ProjectCategory, short = false): string {
  const c = categories.find((c) => c.value === value);
  return c ? (short ? c.short : c.label) : value;
}

export function isCategory(value: unknown): value is ProjectCategory {
  return categories.some((c) => c.value === value);
}
