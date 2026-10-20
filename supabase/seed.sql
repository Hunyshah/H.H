-- H.H Associate: sample projects for development and the first deploy.
-- Every title is a [placeholder]. Replace or delete these from the admin panel
-- once real projects are added. Images are royalty-free Unsplash photos.
--
-- Local:  `pnpm supabase db reset` runs this automatically.
-- Remote: `pnpm supabase db push --include-seed`, or paste into the SQL editor.

insert into public.projects
  (title, slug, category, status, location, plot_size, covered_area_sqft, floors, scope, year,
   summary, story, cover_image_path, is_featured, is_published, sort_order)
values
(
  '[Factory Production Hall]', 'factory-production-hall-khurrianwala', 'industrial', 'completed',
  'Khurrianwala, Faisalabad', '[Industrial site]', null, 1, 'Design + Turnkey', null,
  '[Placeholder] A steel-framed production hall with a clear-span roof, built for heavy machinery and truck access.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]',
  'https://images.unsplash.com/photo-1565008447742-97f6f38c985c', true, true, 1
),
(
  '[Modern Family House]', 'modern-family-house-faisalabad', 'residential', 'completed',
  'Faisalabad', '[10 Marla]', null, 2, 'Design + Turnkey', null,
  '[Placeholder] A two-storey family home with a contemporary front elevation and open-plan living.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', true, true, 2
),
(
  '[Commercial Plaza]', 'commercial-plaza-faisalabad', 'commercial', 'completed',
  'Faisalabad', '[Commercial plot]', null, 4, 'Structure + Finishing', null,
  '[Placeholder] A multi-storey commercial plaza with shops on the ground floor and offices above.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', true, true, 3
),
(
  '[Warehouse & Steel Shed]', 'warehouse-steel-shed-khurrianwala', 'industrial', 'completed',
  'Khurrianwala, Faisalabad', '[Industrial site]', null, 1, 'Structure + Turnkey', null,
  '[Placeholder] A steel/PEB warehouse shed with loading bays and industrial flooring.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d', true, true, 4
),
(
  '[Villa Residence]', 'villa-residence-faisalabad', 'residential', 'ongoing',
  'Faisalabad', '[1 Kanal]', null, 2, 'Grey Structure', null,
  '[Placeholder] A one-kanal villa currently under construction.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe design, structure and construction work.]',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811', true, true, 5
),
(
  '[Road & Drainage Works]', 'road-drainage-works-khurrianwala', 'civil', 'completed',
  'Khurrianwala, Faisalabad', null, null, null, 'Civil Works', null,
  '[Placeholder] Access road, drainage and boundary wall works for an industrial estate.',
  E'## The client''s need\n\n[Describe what the client needed.]\n\n## What we did\n\n[Describe the civil works carried out.]',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5', true, true, 6
)
on conflict (slug) do nothing;

-- Gallery images (before / progress / after) for two sample projects.
insert into public.project_media (project_id, type, storage_path, alt, caption, phase, sort_order)
select p.id, 'image', m.path, m.alt, m.caption, m.phase::public.media_phase, m.sort_order
from public.projects p
join (values
  ('factory-production-hall-khurrianwala', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd', 'Site preparation before construction of the production hall', '[Placeholder] Site before work started', 'before', 1),
  ('factory-production-hall-khurrianwala', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e', 'Steel structure being erected for the production hall', '[Placeholder] Steel frame going up', 'progress', 2),
  ('factory-production-hall-khurrianwala', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c', 'Completed production hall interior', '[Placeholder] Completed hall', 'after', 3),
  ('factory-production-hall-khurrianwala', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', 'Engineer inspecting work inside the factory', '[Placeholder] Final inspection', 'after', 4),
  ('modern-family-house-faisalabad', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e', 'House plot during grey structure work', '[Placeholder] Grey structure stage', 'before', 1),
  ('modern-family-house-faisalabad', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5', 'House under construction with scaffolding', '[Placeholder] Construction in progress', 'progress', 2),
  ('modern-family-house-faisalabad', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'Completed modern family house front elevation', '[Placeholder] Completed front elevation', 'after', 3),
  ('modern-family-house-faisalabad', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Completed house exterior at dusk', '[Placeholder] Exterior at dusk', 'after', 4)
) as m(slug, path, alt, caption, phase, sort_order) on m.slug = p.slug
where not exists (select 1 from public.project_media pm where pm.project_id = p.id);
