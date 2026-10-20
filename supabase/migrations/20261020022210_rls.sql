-- H.H Associate: Row Level Security, admin helper and storage bucket.

-- ---------------------------------------------------------------------------
-- is_admin(): true when the current auth user is listed in public.admins.
-- SECURITY DEFINER so it can read `admins`, which has no select policy.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update projects"
  on public.projects for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- project_media (visible only when the parent project is published)
-- ---------------------------------------------------------------------------
create policy "Public can read media of published projects"
  on public.project_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.is_published
    )
    or (select public.is_admin())
  );

create policy "Admins can insert project media"
  on public.project_media for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update project media"
  on public.project_media for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete project media"
  on public.project_media for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create policy "Public can read services"
  on public.services for select
  to anon, authenticated
  using (true);

create policy "Admins can insert services"
  on public.services for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update services"
  on public.services for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete services"
  on public.services for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create policy "Public can read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins can insert testimonials"
  on public.testimonials for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update testimonials"
  on public.testimonials for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete testimonials"
  on public.testimonials for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- leads: no public access at all. The quote-form Server Action inserts with
-- the service role key, which bypasses RLS. Admins can read and update.
-- ---------------------------------------------------------------------------
create policy "Admins can read leads"
  on public.leads for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can update leads"
  on public.leads for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete leads"
  on public.leads for delete to authenticated
  using ((select public.is_admin()));

revoke all on public.leads from anon;

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins can insert site settings"
  on public.site_settings for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update site settings"
  on public.site_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- admins: RLS enabled with no policies = no access via the API.
-- Manage rows from the SQL editor (see README: "Create the first admin").
-- ---------------------------------------------------------------------------
revoke all on public.admins from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public-read bucket for project images, admin-only writes.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  10485760, -- 10 MB
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve files through their public URL without any select
-- policy, so public read needs nothing here. Listing objects through the API
-- is limited to admins (the admin panel needs it for upserts and deletes).
create policy "Admins can list project images"
  on storage.objects for select to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()));

create policy "Admins can upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and (select public.is_admin()));

create policy "Admins can update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()))
  with check (bucket_id = 'project-images' and (select public.is_admin()));

create policy "Admins can delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()));
