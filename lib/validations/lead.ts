// zod/mini: same validation as full Zod at a fraction of the client bundle.
import { z } from "zod/mini";

export const projectTypes = [
  "Home",
  "Commercial",
  "Factory / Industrial",
  "Renovation",
  "Design only",
  "Other",
] as const;

export const plotSizes = [
  "3–5 Marla",
  "6–10 Marla",
  "1 Kanal",
  "2 Kanal+",
  "Commercial / Industrial site",
] as const;

export const budgets = [
  "Not decided",
  "Under 50 Lakh",
  "50 Lakh–1 Crore",
  "1–2 Crore",
  "2 Crore+",
] as const;

/** Strips spaces, dashes and brackets from a phone number. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/** Pakistani mobile numbers: 03xxxxxxxxx, +923xxxxxxxxx, 00923xxxxxxxxx or 923xxxxxxxxx. */
const PK_MOBILE = /^(?:\+92|0092|92|0)3\d{9}$/;

export const leadSchema = z.object({
  projectType: z.enum(projectTypes, { error: "Choose a project type" }),
  plotSize: z.enum(plotSizes, { error: "Choose a plot or site size" }),
  location: z
    .string({ error: "Enter the plot location" })
    .check(
      z.trim(),
      z.minLength(2, "Enter the plot location"),
      z.maxLength(120, "Keep the location under 120 characters"),
    ),
  name: z
    .string({ error: "Enter your name" })
    .check(
      z.trim(),
      z.minLength(2, "Enter your name"),
      z.maxLength(80, "Keep your name under 80 characters"),
    ),
  phone: z.string({ error: "Enter your phone number" }).check(
    z.trim(),
    z.refine(
      (v) => PK_MOBILE.test(normalizePhone(v)),
      "Enter a mobile number like 0300-1234567 or +92 300 1234567",
    ),
  ),
  budget: z.enum(budgets, { error: "Choose a budget range" }),
  message: z.optional(
    z.string().check(z.trim(), z.maxLength(1000, "Keep the details under 1000 characters")),
  ),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Fields shown in each mobile step, used to validate one step at a time. */
export const leadSteps: (keyof LeadInput)[][] = [
  ["projectType"],
  ["plotSize", "location"],
  ["name", "phone", "budget", "message"],
];
