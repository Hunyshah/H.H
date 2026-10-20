/** Cache tags shared by public data loaders and admin revalidation. */
export const TAGS = {
  settings: "settings",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  services: "services",
  testimonials: "testimonials",
} as const;
