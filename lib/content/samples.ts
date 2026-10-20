// Offline sample data, used ONLY when Supabase is not configured (local
// development without keys). Mirrors supabase/seed.sql. Never shown in
// production, where the database is the source of truth.

import type { BeforeAfterPair, ProjectCard } from "@/lib/data/projects";
import type { ServiceSummary } from "@/lib/data/services";

import { images } from "./images";

export const sampleProjects: ProjectCard[] = [
  {
    id: "sample-1",
    slug: "factory-production-hall-khurrianwala",
    title: "[Factory Production Hall]",
    category: "industrial",
    status: "completed",
    location: "Khurrianwala, Faisalabad",
    scope: "Design + Turnkey",
    summary:
      "[Placeholder] A steel-framed production hall built for heavy machinery and truck access.",
    coverUrl: images.factoryHall,
  },
  {
    id: "sample-2",
    slug: "modern-family-house-faisalabad",
    title: "[Modern Family House]",
    category: "residential",
    status: "completed",
    location: "Faisalabad",
    scope: "Design + Turnkey",
    summary: "[Placeholder] A two-storey family home with a contemporary front elevation.",
    coverUrl: images.modernHouse,
  },
  {
    id: "sample-3",
    slug: "commercial-plaza-faisalabad",
    title: "[Commercial Plaza]",
    category: "commercial",
    status: "completed",
    location: "Faisalabad",
    scope: "Structure + Finishing",
    summary: "[Placeholder] A multi-storey plaza with shops below and offices above.",
    coverUrl: images.commercial,
  },
  {
    id: "sample-4",
    slug: "warehouse-steel-shed-khurrianwala",
    title: "[Warehouse & Steel Shed]",
    category: "industrial",
    status: "completed",
    location: "Khurrianwala, Faisalabad",
    scope: "Structure + Turnkey",
    summary: "[Placeholder] A steel/PEB warehouse shed with loading bays.",
    coverUrl: images.warehouse,
  },
  {
    id: "sample-5",
    slug: "villa-residence-faisalabad",
    title: "[Villa Residence]",
    category: "residential",
    status: "ongoing",
    location: "Faisalabad",
    scope: "Grey Structure",
    summary: "[Placeholder] A one-kanal villa currently under construction.",
    coverUrl: images.villa,
  },
  {
    id: "sample-6",
    slug: "road-drainage-works-khurrianwala",
    title: "[Road & Drainage Works]",
    category: "civil",
    status: "completed",
    location: "Khurrianwala, Faisalabad",
    scope: "Civil Works",
    summary: "[Placeholder] Access road, drainage and boundary wall works.",
    coverUrl: images.siteCranes,
  },
];

export const sampleBeforeAfter: BeforeAfterPair = {
  projectSlug: "modern-family-house-faisalabad",
  projectTitle: "[Modern Family House]",
  before: { url: images.greyStructure, alt: "House plot during grey structure work" },
  after: { url: images.modernHouse, alt: "Completed modern family house front elevation" },
};

export const sampleServices: ServiceSummary[] = [
  [
    "architectural-design-naksha",
    "Architectural Design & Naksha",
    "Floor plans, 3D elevations and complete naksha drawings for homes, plazas and factories.",
  ],
  [
    "structural-engineering",
    "Structural Engineering",
    "Safe, economical structural design for houses, multi-storey buildings and industrial sheds.",
  ],
  [
    "planning-estimation-boq",
    "Planning, Estimation & BOQ",
    "Clear cost estimates and a detailed bill of quantities before a single brick is laid.",
  ],
  [
    "construction-contracting",
    "Construction & Contracting",
    "Grey structure, finishing or complete turnkey construction, managed by engineers on site.",
  ],
  [
    "industrial-construction",
    "Industrial Construction",
    "Factories, production halls, warehouses and steel/PEB sheds built for heavy daily use.",
  ],
  [
    "renovation-extensions",
    "Renovation & Extensions",
    "Additional floors, extensions, remodelling and structural repairs for existing buildings.",
  ],
].map(([slug, title, short], i) => ({ id: `sample-service-${i + 1}`, slug, title, short }));
