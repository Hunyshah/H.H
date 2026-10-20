import type { Metadata } from "next";

import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { OngoingProjects } from "@/components/sections/OngoingProjects";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ServicesList } from "@/components/sections/ServicesList";
import { Sectors } from "@/components/sections/Sectors";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";
import {
  getFeaturedBeforeAfter,
  getFeaturedProjects,
  getOngoingProjects,
} from "@/lib/data/projects";
import { getServices } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";
import { getTestimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: { absolute: "H.H Associate — Construction Company in Faisalabad & Khurrianwala" },
  description:
    "Design, structural engineering and construction of homes, commercial buildings, factories and civil works in Faisalabad and Khurrianwala. Free site visit and estimate.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, featured, ongoing, beforeAfter, services, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getOngoingProjects(),
    getFeaturedBeforeAfter(),
    getServices(),
    getTestimonials(),
  ]);

  // The hero shows the first completed featured project.
  const heroProject =
    featured.find((p) => p.status === "completed" && p.coverUrl) ?? featured[0] ?? null;

  return (
    <>
      <Hero project={heroProject} />
      <StatsBand stats={settings.stats} />
      <Sectors projects={featured} />
      <ServicesList services={services} />
      <FeaturedProjects projects={featured} />
      <BeforeAfterSection pair={beforeAfter} />
      <Process />
      <WhyUs years={settings.stats.years} />
      <Testimonials items={testimonials} />
      <OngoingProjects projects={ongoing} />
      <QuoteSection settings={settings} />
    </>
  );
}
