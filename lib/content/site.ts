// Site-wide copy and navigation. Kept out of components so an Urdu version
// can be added later by providing a second dictionary with the same shape.

export const site = {
  name: "H.H Associate",
  shortName: "H.H",
  tagline: "Engineer, Designer, Planner & Contractors",
  subTagline: "Deal in all kinds of civil work projects",
  description:
    "Construction and civil engineering firm in Khurrianwala, Faisalabad. Homes, commercial buildings, factories and civil works — designed, engineered and built from plot to keys.",
  locality: "Khurrianwala",
  city: "Faisalabad",
  region: "Punjab",
  country: "Pakistan",
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Sectors", href: "/#sectors" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];

export const sectorLinks: NavItem[] = [
  { label: "Residential", href: "/projects?category=residential" },
  { label: "Commercial", href: "/projects?category=commercial" },
  { label: "Industrial & Factories", href: "/projects?category=industrial" },
  { label: "Civil Works", href: "/projects?category=civil" },
];

export const companyLinks: NavItem[] = [
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our process", href: "/process" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const ui = {
  freeEstimate: "Free Estimate",
  call: "Call",
  whatsapp: "WhatsApp",
  estimate: "Estimate",
  menu: "Menu",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  skipToContent: "Skip to content",
  chatOnWhatsapp: "Chat with us on WhatsApp",
  whatsappGreeting:
    "Assalam-o-Alaikum H.H Associate, I would like to discuss a construction project.",
  footerAbout:
    "Design, structural engineering, estimation and construction for homes, commercial buildings, factories and civil works across Faisalabad.",
  footerSectors: "Sectors",
  footerCompany: "Company",
  footerContact: "Contact",
  followUs: "Follow us",
  rights: "All rights reserved.",
} as const;
