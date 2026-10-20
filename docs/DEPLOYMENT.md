# Deploying to Vercel

Everything here fits the free tiers: Vercel Hobby, Supabase Free, Resend Free (3,000 emails a
month), Cloudflare Turnstile Free. Allow about an hour for the first deploy, most of it DNS.

## 1. Accounts and keys to collect

| Service    | Where                                                  | You need                                         |
| ---------- | ------------------------------------------------------ | ------------------------------------------------ |
| Supabase   | Project `hh-associate` → Project Settings → API keys   | Project URL, publishable (anon) key, secret key  |
| Resend     | resend.com → API keys, then Domains                    | API key; a verified sending domain               |
| Cloudflare | dash.cloudflare.com → Turnstile → Add widget           | Site key + secret key (widget mode: **Managed**) |
| GA4        | analytics.google.com → Admin → Data streams (optional) | Measurement ID `G-…`                             |
| Meta       | Events Manager → Data sources → Pixel (optional)       | Pixel ID (digits)                                |

Generate the cron secret locally: `openssl rand -hex 32`.

## 2. Import the project

1. vercel.com → **Add New → Project** → import the GitHub repository.
2. Framework preset: **Next.js** (detected). Install/build commands: leave the defaults —
   Vercel reads `packageManager` and uses pnpm.
3. Before the first deploy, open **Environment Variables** and add every variable from
   `.env.example`, for **Production** and **Preview**:

   | Variable                         | Production value                                |
   | -------------------------------- | ----------------------------------------------- |
   | `NEXT_PUBLIC_SITE_URL`           | `https://<your-domain>` (no trailing slash)     |
   | `NEXT_PUBLIC_SUPABASE_URL`       | `https://qsunxqbdgfheyaifbofv.supabase.co`      |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | publishable key (`sb_publishable_…`)            |
   | `SUPABASE_SERVICE_ROLE_KEY`      | secret key — mark as **Sensitive**              |
   | `RESEND_API_KEY`                 | Resend API key — Sensitive                      |
   | `LEAD_EMAIL_FROM`                | `H.H Associate <leads@<your-domain>>`           |
   | `LEAD_EMAIL_TO`                  | owner's email(s), comma-separated               |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key                              |
   | `TURNSTILE_SECRET_KEY`           | Turnstile secret key — Sensitive                |
   | `CRON_SECRET`                    | the generated secret — Sensitive                |
   | `NEXT_PUBLIC_GA4_ID`             | optional                                        |
   | `NEXT_PUBLIC_META_PIXEL_ID`      | optional                                        |
   | `NEXT_PUBLIC_VERCEL_ANALYTICS`   | `1` to enable (also enable Analytics in Vercel) |

   For **Preview**, set `NEXT_PUBLIC_SITE_URL` to the preview domain or leave it as production;
   previews share the production database, so test leads from previews land in the real admin.

4. **Deploy.** `vercel.json` already pins functions to `bom1` (Mumbai, next to the database) and
   registers the daily keep-alive cron.

## 3. Domain

1. Vercel project → **Settings → Domains** → add `yourdomain.pk` and `www.yourdomain.pk`;
   choose one as primary (the other redirects).
2. At your domain registrar, create the DNS records Vercel shows (an `A` record for the apex,
   a `CNAME` for `www`). HTTPS is issued automatically.
3. Make sure `NEXT_PUBLIC_SITE_URL` matches the primary domain exactly, then **Redeploy**
   (public variables are baked in at build time). Canonical URLs, the sitemap, share images and
   the email “Open in admin” link all use it.

## 4. Service settings that depend on the domain

- **Supabase → Authentication → URL Configuration:** Site URL = `https://<your-domain>`.
  **Sign In / Providers:** “Allow new users to sign up” = **off**.
- **Resend → Domains → Add domain:** add the DNS records it lists (SPF, DKIM, optionally DMARC) at
  your registrar and wait for “Verified”. Until then emails only reach the Resend account owner.
- **Cloudflare Turnstile → your widget → Hostnames:** add the domain (and the `*.vercel.app`
  preview domain if you test on previews).
- **Google Search Console:** add the domain property, verify via DNS, submit
  `https://<your-domain>/sitemap.xml`.
- **Google Business Profile:** set the website to the new domain — the strongest signal for
  “construction company Faisalabad”-type searches.

## 5. First admin

Follow “Admin accounts” in the README: add the user in Supabase Auth, insert their row into
`public.admins`, sign in at `/admin/login`.

## 6. Verify the deployment

Run through “Go-live tests” in [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md). The short version:

1. Submit the quote form on a phone → the lead appears in `/admin/leads` and the email arrives.
2. Publish a project in the admin → it appears on `/projects` without a redeploy.
3. Paste a project URL into WhatsApp → the preview shows its photo and title
   (use developers.facebook.com/tools/debug to refresh a cached preview).
4. Run PageSpeed Insights (mobile) on the home page and a project page.
5. Vercel → Settings → Cron Jobs shows `/api/keepalive`; trigger it once and check it returns 200.

## Ongoing

- **Content** is edited in `/admin`; no deploys needed. Code changes deploy on push to `main`
  (previews for other branches).
- **Database changes:** new migration file → `pnpm db:push` → `pnpm db:types` → commit.
- **Backups:** the Supabase free plan has no point-in-time recovery. Export leads from the admin
  (CSV) regularly, and download project photos from Storage occasionally.
- **Limits worth knowing:** Supabase Free — 500 MB database, 1 GB storage (≈1,500–2,500
  compressed project photos), paused after a week without activity (prevented by the cron);
  Vercel Hobby — non-commercial terms, so the client's business site may need **Vercel Pro**;
  check the current terms before launch.
