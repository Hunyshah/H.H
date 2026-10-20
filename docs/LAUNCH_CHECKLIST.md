# Launch checklist

Everything still in `[square brackets]` on the site is a placeholder. Nothing here was invented:
each item needs real information from H.H Associate. Items are grouped by **where** they are
fixed, so most of the list needs no developer.

## A. Fix in the admin panel (`/admin`) — no code

### Settings (`/admin/settings`)

- [ ] **Phone number** — currently `[0300-0000000]` (header, footer, mobile bar, contact page)
- [ ] **WhatsApp number** — currently `[923000000000]`; international format without `+`
- [ ] **Email** — currently `[info@example.com]`
- [ ] **Office address** — currently `[Office address], Khurrianwala, Faisalabad, Punjab, Pakistan`
- [ ] **Google Maps embed link** — empty; the contact page shows a “find us” card until it is set
- [ ] **Stats band** — `50+` projects and `10+` years are **unconfirmed defaults**; `4` sectors and
      `A–Z` are fine as they are
- [ ] **Social links** — Facebook, Instagram, YouTube, TikTok (icons appear only once set)

### Projects (`/admin/projects`)

- [ ] **Delete the 6 sample projects** (all titled in brackets, e.g. `[Factory Production Hall]`,
      with Unsplash photos and `[Describe …]` stories)
- [ ] **Add real projects** — aim for at least 2 industrial, 2 residential, 1 commercial, 1 civil
      so every sector card and filter has work behind it. For each: photos with alt text (before /
      construction / completed), facts, the client's need and what was done.
- [ ] Mark the best 5+ as **Featured** (home page bento) and use **Ongoing** for sites in
      progress (home “on site now” strip)
- [ ] At least one featured project with both **before** and **after** photos (enables the home
      page before/after slider)

### Testimonials (`/admin/testimonials`)

- [ ] Add real testimonials **with the client's permission** (text or YouTube video). The home
      section stays hidden until one is published.

### Services (`/admin/services`) — FAQ answers to confirm

- [ ] Architectural Design & Naksha: `[Typical design timeline to be confirmed by H.H Associate]`
- [ ] Planning, Estimation & BOQ: `[Confirm what is included in the free estimate]`
- [ ] Renovation & Extensions: `[Confirm minimum job size with H.H Associate]`
- [ ] Read every service description and FAQ: the wording is a reasonable draft, not the firm's
      own words

## B. Fix in code (a developer, small text edits)

| Placeholder / item                                                                            | File                                                                                    |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Founding story `[Founding story: …]`                                                          | `lib/content/pages.ts` → `aboutPage`                                                    |
| Team: 4 × `[Name]` and `[Role]`, plus team photos                                             | `lib/content/pages.ts` → `aboutPage.team`; photos go in `app/(site)/about/page.tsx`     |
| Service areas `[Other areas to confirm]`                                                      | `lib/content/pages.ts` → `aboutPage.areas`                                              |
| Handover `[Handover documents / warranty terms …]`                                            | `lib/content/pages.ts` → `processPage`                                                  |
| **Logo SVG** (text wordmark used until supplied)                                              | `components/layout/Logo.tsx`, `app/icon.svg`, `app/apple-icon.tsx`, `lib/og/render.tsx` |
| **Static photos** — sector fallbacks, services, why-us, about, default share image (Unsplash) | `lib/content/images.ts` — replace with the firm's own photos                            |

**Copy to confirm** (written as reasonable drafts, not facts): the home hero paragraph and sector
descriptions (`lib/content/home.ts`), the four “Why H.H Associate” points (engineers on site,
honest BOQ, on-time delivery, quality material), the process steps and “what you receive” lists
(`lib/content/pages.ts`), and the about page values.

**Fallback values** in `lib/content/defaults.ts` and `lib/content/samples.ts` only show when
Supabase is not configured (local development); they never appear in production.

## C. Decisions for the client

- [ ] **Domain name** (e.g. `hhassociate.pk`) and who owns the registrar account
- [ ] **Lead email recipients** (`LEAD_EMAIL_TO`)
- [ ] **Vercel plan**: the free Hobby plan is for non-commercial use; a business site may need
      Vercel Pro — confirm against Vercel's current terms
- [ ] **Privacy policy page**: recommended before running Meta/Google ads, since the site uses
      GA4, Meta Pixel, a lead form and a first-party attribution cookie (not built — not in the
      brief)
- [ ] **Urdu version**: copy is centralised in `lib/content/` ready for translation (not built)

## D. Go-live tests (the brief's definition of done)

Run these on the production domain after deploying ([DEPLOYMENT.md](DEPLOYMENT.md)).

- [ ] `pnpm build` passes with no errors; `pnpm check` is clean (CI runs both)
- [ ] **Test lead**: submit the quote form from a phone → the lead appears in `/admin/leads`
      with source/UTM, and the notification email arrives. Then delete the test lead.
- [ ] **Spam protection**: the Turnstile check passes invisibly on a normal phone browser
- [ ] **Publish without redeploy**: create a project with photos in the admin, publish it → it
      appears on `/projects`, its own page and (if featured) the home page
- [ ] **WhatsApp preview**: send a project URL in WhatsApp → photo + title preview appears
- [ ] **Mobile check at 360 px**: every page, no sideways scrolling, sticky Call · WhatsApp ·
      Estimate bar works
- [ ] **PageSpeed Insights (mobile)** on Home and a project page: Performance 90+, Accessibility
      and SEO 95+, LCP < 2.5 s, CLS < 0.1 (with real photos — lab tests during the build could
      not load photos)
- [ ] **Search Console**: sitemap submitted, no errors after a few days
- [ ] **Analytics** (if enabled): a test lead shows as `generate_lead` in GA4 Realtime and `Lead`
      in Meta Events Manager
- [ ] **Keep-alive cron** listed under Vercel → Settings → Cron Jobs and returns 200
- [ ] **Admin access**: only the intended people are in `public.admins`; public sign-up is off
