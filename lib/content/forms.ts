export const quoteForm = {
  stepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
  stepTitles: ["Project", "Plot", "Your details"],
  projectType: "What are you planning?",
  plotSize: "Plot / site size",
  location: "Plot location",
  locationPlaceholder: "e.g. Khurrianwala, Faisalabad",
  name: "Your name",
  phone: "Phone / WhatsApp",
  budget: "Budget range",
  message: "Anything else we should know?",
  optional: "(optional)",
  select: "Select…",
  next: "Next",
  back: "Back",
  submit: "Request Free Estimate",
  sending: "Sending…",
  loading: "Loading the estimate form…",
  privacy: "We only use your details to contact you about this project.",
} as const;

export const thankYou = {
  eyebrow: "Request received",
  title: "Thank you — we'll be in touch soon.",
  text: "An engineer will call you to arrange a free site visit. For a faster reply, continue the conversation on WhatsApp.",
  continueWhatsapp: "Continue on WhatsApp",
  whatsappIntro:
    "Assalam-o-Alaikum H.H Associate, I just requested a free estimate on your website.",
  viewProjects: "Browse our projects",
  metaTitle: "Thank you",
} as const;
