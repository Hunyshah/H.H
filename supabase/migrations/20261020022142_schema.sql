-- H.H Associate: core schema
-- Enums, tables, indexes and the updated_at trigger.

create extension if not exists pgcrypto;

create type public.project_category as enum ('residential', 'commercial', 'industrial', 'civil');
create type public.project_status as enum ('completed', 'ongoing');
create type public.media_type as enum ('image', 'video');
create type public.media_phase as enum ('before', 'progress', 'after');
create type public.lead_status as enum ('new', 'contacted', 'site_visit', 'quoted', 'won', 'lost');

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category public.project_category not null,
  status public.project_status not null default 'completed',
  location text,
  plot_size text,
  covered_area_sqft int check (covered_area_sqft is null or covered_area_sqft > 0),
  floors int check (floors is null or floors >= 0),
  scope text,                 -- e.g. 'Design + Turnkey'
  year int check (year is null or year between 1950 and 2100),
  summary text,
  story text,                 -- markdown
  cover_image_path text,      -- storage path in `project-images`, or an absolute URL
  hero_video_url text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_idx on public.projects (is_published, sort_order, created_at desc);
create index projects_category_idx on public.projects (category) where is_published;
create index projects_featured_idx on public.projects (is_featured) where is_published;

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type public.media_type not null,
  storage_path text,          -- for images (storage path or absolute URL)
  video_url text,             -- for videos (YouTube for now)
  alt text,
  caption text,
  phase public.media_phase not null default 'after',
  sort_order int not null default 0,
  constraint project_media_source check (
    (type = 'image' and storage_path is not null) or
    (type = 'video' and video_url is not null)
  )
);

create index project_media_project_idx on public.project_media (project_id, sort_order);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  short text,
  body text,                  -- markdown
  faq jsonb not null default '[]'::jsonb check (jsonb_typeof(faq) = 'array'),
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_id uuid references public.projects (id) on delete set null,
  quote text,
  video_url text,
  rating int check (rating between 1 and 5),
  is_published boolean not null default false,
  constraint testimonials_has_content check (quote is not null or video_url is not null)
);

create index testimonials_project_idx on public.testimonials (project_id);

-- ---------------------------------------------------------------------------
-- Leads (no public access; inserted server-side with the service role)
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  project_type text,
  plot_size text,
  location text,
  budget text,
  message text,
  source text not null default 'form' check (source in ('form', 'whatsapp')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status public.lead_status not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

create index leads_created_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text,
  whatsapp text,
  email text,
  address text,
  map_embed_url text,
  stats jsonb,                -- { projects: "50+", years: "10+" }
  socials jsonb               -- { facebook, instagram, youtube, tiktok }
);

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();
