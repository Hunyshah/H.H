// Copy for the inner pages. Placeholders in [brackets] need the client's input.

import type { ProjectCategory } from "./projects";

export const projectsPage = {
  eyebrow: "Our work",
  title: "Projects",
  intro:
    "Homes, commercial buildings, factories and civil works we have designed and built across Faisalabad and Khurrianwala.",
  filterLabel: "Filter projects by sector",
  all: "All",
  empty: "No projects in this category yet. Check back soon.",
  metaDescription:
    "Completed and ongoing construction projects by H.H Associate in Faisalabad and Khurrianwala: houses, plazas, factories, warehouses and civil works.",
};

export const projectDetail = {
  breadcrumb: "Projects",
  facts: "Project facts",
  location: "Location",
  category: "Sector",
  plotSize: "Plot / site size",
  coveredArea: "Covered area",
  floors: "Floors",
  scope: "Scope",
  year: "Year completed",
  status: "Status",
  statusLabels: { completed: "Completed", ongoing: "Under construction" },
  story: "The project",
  gallery: "Gallery",
  phases: { before: "Before", progress: "Construction", after: "Completed" },
  videos: "Videos",
  beforeAfter: "Before & after",
  testimonial: "What the client said",
  similarTitle: "Want something similar?",
  similarText:
    "Tell us about your plot. We'll visit the site, discuss your needs and give you a free estimate.",
  similarCta: "Get a Free Estimate",
  related: "Related projects",
  share: "Share this project",
  copyLink: "Copy link",
  copied: "Link copied",
  viewImage: (n: number, total: number) => `View image ${n} of ${total}`,
};

/** Maps a project category to the quote form's project type (pre-selection). */
export const categoryToProjectType: Record<ProjectCategory, string> = {
  residential: "Home",
  commercial: "Commercial",
  industrial: "Factory / Industrial",
  civil: "Other",
};

export const servicesPage = {
  eyebrow: "Services",
  title: "Design, engineering and construction under one roof.",
  intro:
    "Hire us for a single service, such as a naksha or a BOQ, or for the complete project from plot to keys.",
  metaDescription:
    "Architectural design and naksha, structural engineering, estimation and BOQ, construction, industrial construction and renovation in Faisalabad.",
  included: "What is included",
  process: "How it works",
  related: "Related projects",
  faq: "Frequently asked questions",
  learnMore: "Learn more",
};

/** Which project categories illustrate each service (related projects). */
export const serviceCategories: Record<string, ProjectCategory[]> = {
  "architectural-design-naksha": ["residential", "commercial"],
  "structural-engineering": ["industrial", "commercial"],
  "planning-estimation-boq": ["residential", "industrial"],
  "construction-contracting": ["residential", "commercial"],
  "industrial-construction": ["industrial"],
  "renovation-extensions": ["residential", "civil"],
};

export const aboutPage = {
  eyebrow: "About us",
  title: "Engineers, designers, planners and contractors.",
  intro:
    "H.H Associate is a construction and civil engineering firm based in Khurrianwala, Faisalabad. We design and build homes, commercial buildings, factories and civil works.",
  metaDescription:
    "About H.H Associate: a construction and civil engineering firm in Khurrianwala, Faisalabad, building homes, plazas, factories and civil works.",
  storyEyebrow: "Our story",
  storyTitle: "Built on engineering, not guesswork.",
  story: [
    "[Founding story: when and by whom H.H Associate was started, and how the firm grew. To be supplied by the client.]",
    "Today we work across every kind of building — family homes from 5 marla to 2 kanal, commercial plazas, factories, warehouses and steel sheds — with the same approach: design it properly, cost it honestly and build it with engineers on site.",
  ],
  valuesEyebrow: "Our values",
  valuesTitle: "What we stand for.",
  values: [
    { title: "Honesty", text: "Clear estimates, itemised BOQs and no hidden costs." },
    { title: "Engineering first", text: "Every structure is designed and checked by engineers." },
    { title: "Quality", text: "Material and workmanship checked at every stage." },
    { title: "Accountability", text: "One team responsible from the first sketch to handover." },
  ],
  teamEyebrow: "Our team",
  teamTitle: "The people behind your project.",
  team: [
    { name: "[Name]", role: "[Founder / Principal Engineer]" },
    { name: "[Name]", role: "[Architect / Designer]" },
    { name: "[Name]", role: "[Structural Engineer]" },
    { name: "[Name]", role: "[Site / Project Manager]" },
  ],
  areaEyebrow: "Service area",
  areaTitle: "Building across Faisalabad.",
  areaText:
    "Our office is in Khurrianwala and we work across Faisalabad and the surrounding areas. For sites further away, ask us — we take on selected projects outside the city.",
  areas: ["Khurrianwala", "Faisalabad city", "[Other areas to confirm]"],
};

export const processPage = {
  eyebrow: "Our process",
  title: "From plot to keys, step by step.",
  intro:
    "Five clear stages. At each one you know what we are doing, what it costs and what you receive.",
  metaDescription:
    "How H.H Associate works: site visit, design, estimate, construction and handover — and what you receive at every step.",
  receive: "What you receive",
  steps: [
    {
      title: "Site Visit",
      text: "An engineer visits your plot or building, listens to what you need and checks site conditions such as access, levels and neighbouring structures.",
      receive: [
        "Site assessment and advice",
        "A first idea of scope and budget",
        "Answers to your questions, on the spot",
      ],
    },
    {
      title: "Design",
      text: "We prepare the naksha and 3D elevation, then the structural design. You review and we revise until the layout fits your plot, needs and budget.",
      receive: [
        "Floor plans (naksha) for every level",
        "3D front elevation",
        "Structural and working drawings",
      ],
    },
    {
      title: "Estimate",
      text: "We quantify every item in a detailed bill of quantities and agree a schedule and stage-wise payment plan before work starts.",
      receive: [
        "Detailed BOQ",
        "Grey structure and finishing cost breakdown",
        "Construction schedule and payment plan",
      ],
    },
    {
      title: "Construction",
      text: "Engineers supervise the work on site. Material is checked on delivery and you get regular updates — ideal for overseas clients.",
      receive: [
        "Regular progress updates with photos",
        "Quality checks at critical stages",
        "A single point of contact",
      ],
    },
    {
      title: "Handover",
      text: "A final inspection with you, snag fixing, and the keys to your finished building.",
      receive: [
        "Joint final inspection",
        "Completed snag list",
        "[Handover documents / warranty terms to confirm]",
      ],
    },
  ],
};

export const contactPage = {
  eyebrow: "Contact",
  title: "Let's talk about your project.",
  intro:
    "Request a free estimate, call us, or message us on WhatsApp. An engineer will get back to you to arrange a site visit.",
  metaDescription:
    "Contact H.H Associate in Khurrianwala, Faisalabad for a free site visit and construction estimate. Call, WhatsApp or send the quote form.",
  mapTitle: "Find our office",
  mapLoad: "Show map",
  mapNotice: "Loads Google Maps",
  openInMaps: "Open in Google Maps",
  mapPlaceholder: "[Google Maps embed URL to be added in Settings]",
};

export const ctaBand = {
  title: "Planning to build? Let's talk.",
  text: "Free site visit and estimate across Faisalabad and Khurrianwala.",
  estimate: "Get a Free Estimate",
  whatsapp: "WhatsApp us",
};
