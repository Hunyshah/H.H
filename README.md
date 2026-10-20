# H.H Associate — website

Production website for **H.H Associate**, a construction and civil engineering firm in
Khurrianwala, Faisalabad. Next.js (App Router, Cache Components) + Tailwind CSS + Supabase,
hosted on Vercel.

> Status: **Phase 6 (SEO and polish)** complete. Sections marked _(phase N)_ are filled in as
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

| File                           | Contents                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `…0100_schema.sql`             | Enums, tables, indexes, `updated_at` trigger                                            |
| `…0200_rls.sql`                | `is_admin()` helper, RLS on every table, `project-images` bucket + policies             |
| `…022258_base_content.sql`     |
| `…025544_leads_ip_hash.sql`    | `leads.ip_hash` (keyed hash, never the raw IP) for rate limiting                        |
| `…022350_private_is_admin.sql` | Moves `is_admin()` to a non-API `private` schema; users can read their own `admins` row | The 6 services and the `site_settings` row (placeholders) |
| `supabase/seed.sql`            | 6 sample `[placeholder]` projects with gallery images                                   |

Access rules in short: the public can read published projects (and their media),
services, settings and published testimonials. `leads` has no public access — the
quote form inserts with the service-role key on the server. Admins (rows in `admins`)
can read and write everything.

### Hosted project

The production database is the Supabase project **`hh-associate`** (ref
`qsunxqbdgfheyaifbofv`, region `ap-south-1` Mumbai). All migrations and the seed are
already applied there. Its URL is `https://qsunxqbdgfheyaifbofv.supabase.co`; take the
publishable and secret keys from **Project Settings → API keys**.

### Apply the migrations (new project)

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

3. Sign in at `/admin/login`.

## Project structure

```
app/
  (site)/            public pages (shared header, footer, WhatsApp button, mobile bar)
  admin/login        sign-in page
  admin/(panel)/     protected admin: dashboard, leads, projects, testimonials, services, settings
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

### Leads pipeline

`lib/actions/leads.ts` handles every quote form submission:

1. **Validate** with the shared Zod schema (`lib/validations/lead.ts`; Pakistani mobile numbers
   such as `0300-1234567` or `+92 300 1234567`).
2. **Honeypot**: a hidden field; bots that fill it get a normal-looking success, nothing is
   stored and no conversion fires.
3. **Turnstile** (`lib/server/turnstile.ts`): invisible for most visitors. Skipped with a
   warning when `TURNSTILE_SECRET_KEY` is empty — set both keys in production.
4. **Rate limit** (`lib/server/rate-limit.ts`): max 3 leads per 10 minutes and 10 per day per IP,
   counted in Postgres via `leads.ip_hash`. No extra service needed.
5. **Insert** with the service-role key, including first-touch UTM parameters and external
   referrer from the `hh_attr` cookie (`components/analytics/AttributionCapture.tsx`, 90 days).
6. **Email** via the Resend REST API, sent after the response with `after()`. Skipped when
   Resend isn't configured; the lead is saved either way.
7. The browser goes to **`/thank-you`**, which fires GA4 `generate_lead` and Meta Pixel `Lead`
   once per submission and offers WhatsApp with the request pre-filled.

Call and WhatsApp clicks anywhere on the site fire `call_click` / `whatsapp_click` (GA4) and
`Contact` (Pixel). GA4, the Pixel and Vercel Analytics load only when their env vars are set.

**Resend setup:** verify your domain at resend.com → Domains, then set `LEAD_EMAIL_FROM` to an
address on it. Until then, Resend's test sender `onboarding@resend.dev` only delivers to the
Resend account owner's own email.

**Turnstile setup:** Cloudflare dashboard → Turnstile → Add widget → add the production domain
(and `localhost` for testing) → copy the site key and secret key.

### Admin panel (`/admin`)

| Section                | What it does                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard              | Leads this week / month (Pakistan time), leads by source (UTM or referrer), latest 5                                                                                         |
| Leads                  | Filter by status, change status and notes inline, one-tap WhatsApp / call, CSV export (Excel-safe, formula-injection safe)                                                   |
| Projects               | Create / edit every field (slug auto-generated), publish / feature toggles, delete                                                                                           |
| Photos & videos        | Drag-and-drop multi-upload, compressed in the browser to max 2400 px WebP; alt text required before upload; phase, caption, reorder (drag or ↑/↓), set cover, YouTube videos |
| Testimonials, Services | Simple CRUD (services include an FAQ editor that feeds the FAQPage schema)                                                                                                   |
| Settings               | Contact details, Google Maps embed, stats band, social links                                                                                                                 |

**Access control** is layered: `proxy.ts` sends signed-out visitors to the login page; the
`(panel)` layout re-checks the session _and_ `admins` membership on every request; every Server
Action calls `assertAdmin()`; and RLS in Postgres enforces admin-only writes regardless.
Photos live in the `project-images` bucket under `projects/<project-id>/`.

**Publishing without a redeploy:** every save calls `updateTag()` for the affected cache tags
(`lib/data/tags.ts`), so public pages show the change on the next request. The Supabase clients
use `cache: "no-store"` fetches so Next's untagged fetch cache can't serve stale rows.

### SEO and social sharing

- **Metadata**: every page sets a unique title, description and canonical URL; project pages use
  the project's SEO fields when filled in.
- **`/sitemap.xml`** lists every public page, published project (with `lastModified`) and service;
  **`/robots.txt`** disallows `/admin` and `/thank-you`.
- **JSON-LD**: `GeneralContractor` on every public page (fields still in `[brackets]` are left
  out), `BreadcrumbList` on inner pages, `FAQPage` on service pages.
- **Open Graph images** (`app/opengraph-image.tsx`, `app/(site)/projects/[slug]/opengraph-image.tsx`):
  cover photo + wordmark + title at 1200×630, rendered with Satori and re-encoded as JPEG with
  sharp (~40–100 KB, well under WhatsApp's preview limit). Fonts are bundled in `assets/fonts`.
- **Security headers** in `next.config.ts`, including a Content Security Policy. Nonce-based CSP
  needs dynamic rendering, so inline scripts use `'unsafe-inline'` while external hosts are
  allow-listed. **Add a host to the CSP when you add a new third-party service.**

### Motion

Animations follow one easing (`cubic-bezier(0.22, 1, 0.36, 1)`, tokens in `globals.css`):

- **Reveals** (`components/motion/Reveal`, `SplitWords`): CSS transitions armed by a tiny inline
  script in the root layout. Content is in the server HTML and stays visible without JS.
  Above-the-fold content uses transform-only variants (`rise`, `words`, `curtain`) so it is painted
  on the first frame and never delays LCP.
- **Parallax, magnetic CTA, count-up**: small hand-written client components, desktop-only
  where required, transform/opacity only.
- **Process timeline**: GSAP ScrollTrigger, dynamically imported when the section nears the
  viewport.
- **Filter layout animation**: `useFlip` (Web Animations API).
- `prefers-reduced-motion` turns every reveal into a plain fade and disables parallax,
  magnetic buttons, Lenis and the timeline scrub.

The Motion library from the original brief was replaced by these to keep the home page under
the 200 KB JS budget (see phase 2 notes).

### Caching

Public data is read with a cookie-less Supabase client inside `"use cache"` functions
tagged via `lib/data/tags.ts`. Admin saves call `revalidateTag`/`updateTag` with the same
tags, so the public site updates without a redeploy.

## Deploying to Vercel

_(Completed in phase 7.)_ Import the repository in Vercel, add the environment variables
from `.env.example` for Production and Preview, set `NEXT_PUBLIC_SITE_URL` to the live
domain, and deploy.
