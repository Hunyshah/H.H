// Home page copy. Facts that need the client's confirmation are in [brackets]
// or come from site_settings (stats), never hard-coded here.

export const hero = {
  eyebrow: "Faisalabad · Khurrianwala",
  titleLead: "Homes, factories & landmarks,",
  titleAccent: "built to last.",
  intro:
    "H.H Associate designs, engineers and builds family homes, commercial plazas, factories, warehouses and civil works across Faisalabad — one accountable team from the first naksha to the day we hand over the keys.",
  primaryCta: "Get a Free Site Visit",
  secondaryCta: "View Our Work",
  captionLabel: "Featured project",
};

export const statLabels = {
  projects: "Projects completed",
  years: "Years of experience",
  sectors: "Sectors served",
  delivery: "Design to handover",
} as const;

export const sectorsSection = {
  eyebrow: "What we build",
  title: "One firm for every kind of building.",
  intro:
    "From a 5 marla home to a full production hall, every project gets the same engineering discipline.",
  cta: "View projects",
  items: {
    residential: "Houses and villas, 5 marla to 2 kanal, designed around how your family lives.",
    commercial: "Plazas, shops and offices built for footfall, rent and long service life.",
    industrial: "Factories, production halls, warehouses and steel/PEB sheds for heavy daily use.",
    civil: "Roads, drainage, boundary walls, extensions and structural repairs.",
  },
} as const;

export const servicesSection = {
  eyebrow: "Services",
  title: "Everything from naksha to handover.",
  intro:
    "Take one service or hand us the whole project. Design, engineering, costing and construction sit under one roof, so nothing falls between contractors.",
  imageAlt: "Engineers reviewing construction progress on site",
  cta: "All services",
};

export const featuredSection = {
  eyebrow: "Our work",
  title: "Built across Faisalabad.",
  intro: "A selection of homes, commercial buildings, factories and civil works.",
  all: "All",
  viewAll: "View all projects",
  empty: "No projects in this category yet.",
};

export const beforeAfterSection = {
  eyebrow: "Before & after",
  title: "From bare plot to finished building.",
  before: "Before",
  after: "After",
  sliderLabel: "Drag to compare before and after",
  viewProject: "View project",
};

export const processSection = {
  eyebrow: "How we work",
  title: "From plot to keys in five steps.",
  intro: "A clear process, so you always know what happens next and what it costs.",
  cta: "See the full process",
  steps: [
    {
      title: "Site Visit",
      text: "We visit your plot, listen to your needs and check the site conditions.",
    },
    { title: "Design", text: "Naksha, 3D elevation and structural design, revised until it fits." },
    {
      title: "Estimate",
      text: "A detailed BOQ and cost estimate, so the budget is clear up front.",
    },
    {
      title: "Construction",
      text: "Engineers on site, quality material and regular progress updates.",
    },
    {
      title: "Handover",
      text: "Final inspection, snag fixing and the keys to your finished building.",
    },
  ],
} as const;

export const whyUsSection = {
  eyebrow: "Why H.H Associate",
  title: "Engineers who build what they design.",
  badgeLabel: "years of experience",
  imageAlt: "Completed modern house built to a high finish",
  points: [
    {
      title: "Engineers on site",
      text: "Qualified engineers supervise the work, so what is built matches what was designed.",
    },
    {
      title: "Honest BOQ",
      text: "Itemised quantities and rates before work starts. No surprise bills halfway through.",
    },
    {
      title: "On-time delivery",
      text: "A realistic schedule agreed up front, with progress updates at every stage.",
    },
    {
      title: "Quality material",
      text: "Approved brands and tested material, checked on delivery and recorded.",
    },
  ],
} as const;

export const testimonialsSection = {
  eyebrow: "Client stories",
  title: "What our clients say.",
  previous: "Previous testimonial",
  next: "Next testimonial",
};

export const ongoingSection = {
  eyebrow: "On site now",
  title: "Currently under construction.",
  status: "In progress",
};

export const quoteSection = {
  eyebrow: "Free estimate",
  title: "Planning to build? Let's talk.",
  intro:
    "Tell us about your plot and project. An engineer will call you back to arrange a free site visit and estimate.",
  call: "Call us",
  whatsapp: "WhatsApp",
  email: "Email",
  office: "Office",
};
