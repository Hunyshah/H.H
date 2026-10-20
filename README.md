# H.H Associate — website

Production website for **H.H Associate**, a construction and civil engineering firm in
Khurrianwala, Faisalabad: public marketing site, free-estimate lead pipeline and an admin panel
for projects, leads and content.

- **Deploying:** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- **Before launch:** [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md) — every placeholder
  that needs real content, and the go-live tests

## Stack

| Layer               | Choice                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router, Cache Components, Partial Prefetching) + TypeScript strict  |
| Styling             | Tailwind CSS 4 — design tokens in `app/globals.css` (`@theme`)                      |
| Data / auth / files | Supabase (Postgres + RLS, Auth, Storage)                                            |
| Forms               | React Hook Form + Zod (`zod/mini` in the browser) via Server Actions                |
| Motion              | CSS reveals, Lenis, GSAP ScrollTrigger (process timeline only), Web Animations FLIP |
| Email / spam        | Resend (REST), Cloudflare Turnstile, honeypot, Postgres-backed rate limit           |
| Analytics           | GA4, Meta Pixel, Vercel Analytics — each only when its env var is set               |
| Hosting             | Vercel (functions in `bom1` Mumbai, next to the database)                           |
| Package manager     | pnpm 10, Node.js 20.9+                                                              |

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in the values — every variable is documented there
pnpm dev                      # http://localhost:3000
```

Without Supabase keys the public site still runs, using built-in sample projects and placeholder
contact details (`lib/content/samples.ts`, `lib/content/defaults.ts`), so layout work needs no
backend. The admin panel and the quote form need Supabase.

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                  | Development server                                                  |
| `pnpm build` / `pnpm start` | Production build / serve                                            |
| `pnpm check`                | Prettier check + ESLint + typecheck (what CI runs before the build) |
| `pnpm format`               | Prettier with Tailwind class sorting                                |
| `pnpm db:push`              | Apply new migrations to the linked Supabase project                 |
| `pnpm db:types`             | Regenerate `lib/supabase/database.types.ts` from the hosted project |

CI (`.github/workflows/ci.yml`) runs `pnpm check` and `pnpm build` on every push to `main` and
on pull requests. The build needs no secrets.

## Environment variables

All of them are listed with comments in [`.env.example`](./.env.example).

| Variable                                                                          | Exposed to | Needed                          |
| --------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                            | browser    | yes — the live `https://` URL   |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`                       | browser    | yes                             |
| `SUPABASE_SERVICE_ROLE_KEY`                                                       | **server** | yes — inserts leads, keep-alive |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO`                              | server     | for lead notification emails    |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                          | both       | yes in production               |
| `CRON_SECRET`                                                                     | server     | yes on Vercel (keep-alive cron) |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_VERCEL_ANALYTICS` | browser    | optional                        |

Never put a secret in a `NEXT_PUBLIC_` variable: those values are shipped to every browser.
`NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing them**.

## Database (Supabase)

The production database is the Supabase project **`hh-associate`** (ref `qsunxqbdgfheyaifbofv`,
region `ap-south-1` Mumbai, URL `https://qsunxqbdgfheyaifbofv.supabase.co`). Every migration and
the sample seed are already applied there.

| Migration (`supabase/migrations/`) | Contents                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `…022142_schema.sql`               | Enums, tables, indexes, `updated_at` trigger                                    |
| `…022210_rls.sql`                  | `is_admin()`, RLS on every table, `project-images` bucket and its policies      |
| `…022258_base_content.sql`         | The 6 services and the `site_settings` row (with placeholders)                  |
| `…022350_private_is_admin.sql`     | Moves `is_admin()` out of the API schema; users can read their own `admins` row |
| `…025544_leads_ip_hash.sql`        | `leads.ip_hash` (keyed hash, never the raw IP) for rate limiting                |
| `supabase/seed.sql`                | 6 sample `[placeholder]` projects with gallery images — delete before launch    |

**Access rules:** visitors can read published projects and their media, services, settings and
published testimonials. `leads` has no public access; the quote form inserts with the service-role
key on the server. Admins (rows in `public.admins`) can read and write everything.

**Changing the schema:** add a new file in `supabase/migrations/`, run `pnpm db:push`, then
`pnpm db:types`. Never edit a migration that has already been applied.

**A fresh project** (e.g. a staging copy): create it, then `pnpm supabase link --project-ref <ref>`
and `pnpm db:push --include-seed` (omit `--include-seed` to skip the sample projects), or paste the
migration files in order into the SQL editor.

### Admin accounts

Public sign-up must stay **off** (Authentication → Sign In / Providers → “Allow new users to
sign up”). To add an admin:

1. **Authentication → Users → Add user**: email + strong password, tick “Auto confirm user”.
2. **SQL Editor**:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'owner@example.com';
   ```

3. They sign in at `/admin/login`. To remove access, delete their row from `public.admins`
   (and the user, if they should not log in at all). Password resets: Authentication → Users →
   the user's menu → “Send password recovery”, or set a new password there.

## How it works

### Project structure

```
app/
  (site)/            public pages; shared header, footer, WhatsApp button, mobile bar
  admin/login        sign-in page
  admin/(panel)/     protected admin: dashboard, leads, projects, testimonials, services, settings
  api/keepalive      daily cron ping that keeps the free Supabase project awake
  sitemap.ts robots.ts opengraph-image.tsx apple-icon.tsx
components/
  layout/ sections/ projects/ media/ forms/ motion/ seo/ admin/ icons/
  ui/                shadcn-style primitives (button, input, select, switch, card, badge, table)
lib/
  content/           all site copy (kept out of components so an Urdu version can be added)
  data/              cached public data loaders ("use cache" + cache tags)
  actions/           Server Actions (quote form, admin)
  auth/ server/ validations/ analytics/ og/ supabase/
proxy.ts             first gate for /admin (Next.js 16 renamed middleware → proxy)
supabase/            migrations, seed, local CLI config
docs/                deployment guide and launch checklist
```

### Caching and publishing without a redeploy

Public data is read with a cookie-less Supabase client inside `"use cache"` functions tagged via
`lib/data/tags.ts`; pages are prerendered from them. Every admin save calls `updateTag()` for the
affected tags, so the next visitor sees the change. The Supabase clients use `no-store` fetches,
so Next's untagged fetch cache can never serve stale rows. Project and service detail pages await
their `params` inside `<Suspense>`, which lets new projects render on their first visit.

### Leads pipeline (`lib/actions/leads.ts`)

1. **Validate** with the shared Zod schema (Pakistani mobiles: `0300-1234567`, `+92 300 1234567`).
2. **Honeypot**: bots that fill the hidden field see “success”; nothing is stored or tracked.
3. **Turnstile**: invisible for most visitors. Skipped with a warning only when
   `TURNSTILE_SECRET_KEY` is empty.
4. **Rate limit**: 3 leads per 10 minutes and 10 per day per IP, counted in Postgres.
5. **Insert** with first-touch UTM parameters and external referrer (`hh_attr` cookie, 90 days).
6. **Email** via Resend after the response (`after()`); a failed email never loses a lead.
7. **`/thank-you`** fires GA4 `generate_lead` and Meta Pixel `Lead` once, and offers WhatsApp with
   the request pre-filled. Call and WhatsApp clicks site-wide fire `call_click` / `whatsapp_click`
   (GA4) and `Contact` (Pixel).

### Admin panel (`/admin`)

| Section         | What it does                                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dashboard       | Leads this week / month (Pakistan time), leads by source, latest 5                                                          |
| Leads           | Status filter, inline status and notes, one-tap WhatsApp / call, CSV export (Excel-safe)                                    |
| Projects        | Every field, auto slug, publish / feature toggles, delete                                                                   |
| Photos & videos | Drag-and-drop upload compressed to ≤2400 px WebP in the browser, required alt text, phase, caption, reorder, cover, YouTube |
| Testimonials    | Create, edit, publish, delete                                                                                               |
| Services        | Text, “what is included” (Markdown) and an FAQ editor that feeds Google's FAQ rich results                                  |
| Settings        | Phone, WhatsApp, email, address, Google Maps embed, stats band, social links                                                |

Access is checked four times: `proxy.ts`, the panel layout (session **and** `admins` row, every
request), `assertAdmin()` in every Server Action, and RLS in Postgres.

### SEO and sharing

Unique metadata and canonical URLs on every page; `/sitemap.xml` (pages, projects with
`lastModified`, services) and `/robots.txt` (blocks `/admin`, `/thank-you`); JSON-LD
`GeneralContractor` (bracketed placeholders are left out), `BreadcrumbList` and `FAQPage`; share
images at 1200×630 with the project photo, rendered with Satori and re-encoded to JPEG by sharp
(~40–100 KB, safe for WhatsApp). Fonts for the images are bundled in `assets/fonts` (OFL).

### Security

Secrets only in server env vars; Zod validation on the server; RLS on every table; Turnstile,
honeypot and rate limiting on the public form; CSV export neutralises spreadsheet formulas;
security headers and a Content Security Policy in `next.config.ts`. The CSP uses the no-nonce
variant (nonces would disable static prerendering), with every external host allow-listed —
**add a host there when you add a new third-party service**, or the browser will block it.

### Motion and performance

One easing everywhere (`cubic-bezier(0.22, 1, 0.36, 1)`). Reveals are CSS transitions armed by a
tiny inline script, so content is in the HTML and visible without JavaScript; above-the-fold
content uses transform-only variants so it paints on the first frame. Parallax, magnetic buttons
and count-ups are small hand-written components; GSAP and Lenis load lazily; reduced motion turns
everything into simple fades. The brief's Motion library was replaced by these to keep every page
under the **200 KB initial JavaScript** budget (home ≈199 KB gzipped, most of it Next.js and React
themselves) — check this before adding client-side libraries.

### Replacing the logo

`components/layout/Logo.tsx` renders a text wordmark. When the SVG arrives, replace the wordmark
spans inside `mark` and keep the component's props; update `app/icon.svg`, `app/apple-icon.tsx`
and the wordmark in `lib/og/render.tsx` to match.
