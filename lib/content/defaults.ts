// Fallback content used when Supabase is not configured or a query fails,
// so the public site never renders empty. Values in [brackets] are placeholders.

import type { SiteSettings } from "@/lib/data/settings";

export const defaultSettings: SiteSettings = {
  phone: "[0300-0000000]",
  whatsapp: "[923000000000]",
  email: "[info@example.com]",
  address: "[Office address], Khurrianwala, Faisalabad, Punjab, Pakistan",
  mapEmbedUrl: null,
  stats: { projects: "50+", years: "10+", sectors: "4", delivery: "A–Z" },
  socials: { facebook: null, instagram: null, youtube: null, tiktok: null },
};
