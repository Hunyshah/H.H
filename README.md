# H.H Associate — website

Production website for **H.H Associate**, a construction and civil engineering firm in
Khurrianwala, Faisalabad. Next.js (App Router, Cache Components) + Tailwind CSS + Supabase,
hosted on Vercel.

> Status: **Phase 1 (foundation)** complete. Sections marked _(phase N)_ are filled in as
> the build progresses.

## Stack

| Layer               | Choice                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router, `cacheComponents`) + TypeScript (strict) |
| Styling             | Tailwind CSS 4 — design tokens in `app/globals.css` (`@theme`)   |
| Data / auth / files | Supabase (Postgres + RLS, Auth, Storage)                         |
| Motion              | Motion, Lenis; GSAP only for the process timeline _(phase 2)_    |
| Forms               | React Hook Form + Zod via Server Actions _(phase 4)_             |
| Email / spam        | Resend, Cloudflare Turnstile _(phase 4)_                         |
| Package manager     | pnpm                                                             |

## Getting started

Requirements: Node.js 20.9+ and pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # fill in the values (see below)
pnpm dev                      # http://localhost:3000
```

The public site runs **without** Supabase keys: it falls back to built-in placeholder
contact details so the layout can be developed offline. Project and service pages need
Supabase.

### Scripts

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                  | Development server                                                  |
| `pnpm build` / `pnpm start` | Production build / serve                                            |
| `pnpm lint`                 | ESLint                                                              |
| `pnpm typecheck`            | Generate route types and run `tsc`                                  |
| `pnpm format`               | Prettier (with Tailwind class sorting)                              |
| `pnpm db:push`              | Apply migrations to the linked Supabase project                     |
| `pnpm db:types`             | Regenerate `lib/supabase/database.types.ts` from the linked project |

## Environment variables

Every variable is listed with a comment in [`.env.example`](./.env.example). Summary:

| Variable                                                                          | Where           | Required             |
| --------------------------------------------------------------------------------- | --------------- | -------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                            | public          | yes (production URL) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`                       | public          | yes                  |
| `SUPABASE_SERVICE_ROLE_KEY`                                                       | **server only** | yes (lead inserts)   |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO`                              | server          | for lead emails      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                          | public / server | production           |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_VERCEL_ANALYTICS` | public          | optional             |

Never put a secret in a `NEXT_PUBLIC_` variable — those values are shipped to browsers.

## Database (Supabase)

Schema, RLS policies, the storage bucket and base content live in `supabase/migrations/`:

| File                     | Contents                                                                    |
| ------------------------ | --------------------------------------------------------------------------- |
| `…0100_schema.sql`       | Enums, tables, indexes, `updated_at` trigger                                |
| `…0200_rls.sql`          | `is_admin()` helper, RLS on every table, `project-images` bucket + policies |
| `…0300_base_content.sql` | The 6 services and the `site_settings` row (placeholders)                   |
| `supabase/seed.sql`      | 6 sample `[placeholder]` projects with gallery images                       |

Access rules in short: the public can read published projects (and their media),
services, settings and published testimonials. `leads` has no public access — the
quote form inserts with the service-role key on the server. Admins (rows in `admins`)
can read and write everything.

### Apply the migrations

1. Create a free project at [supabase.com](https://supabase.com) (region: closest to
   Pakistan, e.g. Mumbai or Singapore).
2. Link and push:

   ```bash
   pnpm supabase login
   pnpm supabase link --project-ref <your-project-ref>
   pnpm db:push --include-seed   # omit --include-seed to skip the sample projects
   pnpm db:types                 # optional: regenerate TypeScript types
   ```

   Alternatively paste each migration file, in order, into **SQL Editor** in the dashboard.

3. In **Authentication → Sign In / Providers**, turn **off** “Allow new users to sign up”.
   Admin accounts are created by hand (below), never by public sign-up.

Local development with Docker: `pnpm supabase start` then `pnpm supabase db reset`
(runs migrations and the seed).

### Create the first admin

1. **Authentication → Users → Add user**: enter the admin's email and a strong password,
   tick “Auto confirm user”.
2. **SQL Editor**:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@example.com';
   ```

3. Sign in at `/admin/login` _(admin panel arrives in phase 5)_.

## Project structure

```
app/
  (site)/            public pages (shared header, footer, WhatsApp button, mobile bar)
  admin/             protected admin panel            (phase 5)
  globals.css        design tokens + base styles
components/
  layout/            Header, Footer, Logo, MobileBar, WhatsAppButton, TrackedLink
  ui/                ButtonLink, Eyebrow (+ shadcn primitives for admin, phase 5)
  icons/             inline SVG icon set
  motion/ sections/ media/                            (phase 2–3)
lib/
  content/           site copy + navigation (kept out of components for a future Urdu version)
  data/              cached data loaders ("use cache" + cache tags)
  supabase/          public / server / browser / service-role clients, generated types
  analytics/         event helpers (GA4 + Meta Pixel)
proxy.ts             /admin session gate (Next.js 16 renamed middleware → proxy)
supabase/            migrations, seed, local config
```

### Caching

Public data is read with a cookie-less Supabase client inside `"use cache"` functions
tagged via `lib/data/tags.ts`. Admin saves call `revalidateTag`/`updateTag` with the same
tags, so the public site updates without a redeploy.

## Deploying to Vercel

_(Completed in phase 7.)_ Import the repository in Vercel, add the environment variables
from `.env.example` for Production and Preview, set `NEXT_PUBLIC_SITE_URL` to the live
domain, and deploy.
