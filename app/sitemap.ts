import type { MetadataRoute } from "next";

import { getAllProjects } from "@/lib/data/projects";
import { getServices } from "@/lib/data/services";
import { siteUrl } from "@/lib/env";

/** Every public page, published project and service. Refreshed with the projects/services tags. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services] = await Promise.all([getAllProjects(), getServices()]);

  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/process`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
