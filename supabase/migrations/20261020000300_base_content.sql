-- H.H Associate: content the site needs to run (services + settings row).
-- Text in [square brackets] is a placeholder that must be confirmed by the client.

insert into public.site_settings (id, phone, whatsapp, email, address, map_embed_url, stats, socials)
values (
  1,
  '[0300-0000000]',
  '[923000000000]',
  '[info@example.com]',
  '[Office address], Khurrianwala, Faisalabad, Punjab, Pakistan',
  null,
  '{"projects": "50+", "years": "10+", "sectors": "4", "delivery": "A–Z"}'::jsonb,
  '{"facebook": null, "instagram": null, "youtube": null, "tiktok": null}'::jsonb
)
on conflict (id) do nothing;

insert into public.services (title, slug, short, body, faq, sort_order) values
(
  'Architectural Design & Naksha',
  'architectural-design-naksha',
  'Floor plans, 3D elevations and complete naksha drawings for homes, plazas and factories.',
  E'## What is included\n\n- Site study and requirement brief\n- Floor plans (naksha) for every level\n- 3D front elevation\n- Working drawings for construction\n- Revisions until the layout fits your plot and budget\n\nWe design for how you will actually live or work in the building: light, ventilation, parking and future extensions are planned from the first sketch.',
  '[
    {"q": "Can I get only the design without construction?", "a": "Yes. Many clients come to us only for the naksha and 3D elevation, and build later."},
    {"q": "Do you design factories and commercial buildings too?", "a": "Yes. We design homes, plazas, factories, warehouses and sheds."},
    {"q": "How long does a house design take?", "a": "[Typical design timeline to be confirmed by H.H Associate]"}
  ]'::jsonb,
  1
),
(
  'Structural Engineering',
  'structural-engineering',
  'Safe, economical structural design for houses, multi-storey buildings and industrial sheds.',
  E'## What is included\n\n- Structural analysis and design\n- Foundation, column, beam and slab design\n- Steel and PEB shed structures\n- Structural drawings and reinforcement details\n- Site supervision of critical structural work\n\nA well-engineered structure is safer and often cheaper: we size every member for the real loads instead of guessing.',
  '[
    {"q": "Do you design steel and PEB sheds?", "a": "Yes. We handle steel and pre-engineered building (PEB) sheds for factories and warehouses."},
    {"q": "Can you check an existing building before adding a floor?", "a": "Yes. We assess the existing structure before recommending any extension."}
  ]'::jsonb,
  2
),
(
  'Planning, Estimation & BOQ',
  'planning-estimation-boq',
  'Clear cost estimates and a detailed bill of quantities before a single brick is laid.',
  E'## What is included\n\n- Detailed bill of quantities (BOQ)\n- Material and labour estimates\n- Grey structure and finishing cost breakdown\n- Construction schedule\n- Stage-wise payment plan\n\nAn honest BOQ protects your budget: you know what you are paying for at every stage.',
  '[
    {"q": "Is the estimate free?", "a": "A basic estimate after the site visit is free. [Confirm what is included in the free estimate]"},
    {"q": "Can I get a BOQ for a design made by someone else?", "a": "Yes. Share the drawings and we will prepare the BOQ."}
  ]'::jsonb,
  3
),
(
  'Construction & Contracting',
  'construction-contracting',
  'Grey structure, finishing or complete turnkey construction, managed by engineers on site.',
  E'## What is included\n\n- Grey structure construction\n- Finishing works\n- Complete turnkey projects, from plot to keys\n- Material procurement and quality checks\n- Regular progress updates with photos\n\nEngineers supervise the work on site so that what is built matches what was designed.',
  '[
    {"q": "Do you offer turnkey construction?", "a": "Yes. We can handle everything from design to handover."},
    {"q": "Can I hire you for grey structure only?", "a": "Yes. Grey structure, finishing and turnkey are all available."},
    {"q": "I live abroad. Can you build my house in Faisalabad?", "a": "Yes. We share regular progress updates so overseas clients can follow the work remotely."}
  ]'::jsonb,
  4
),
(
  'Industrial Construction',
  'industrial-construction',
  'Factories, production halls, warehouses and steel/PEB sheds built for heavy daily use.',
  E'## What is included\n\n- Factory and production hall construction\n- Warehouses and storage buildings\n- Steel and PEB sheds\n- Industrial flooring, boundary walls and site roads\n- Drainage and utility works\n\nIndustrial buildings must work as hard as the business inside them. We plan for machinery loads, truck access and future expansion.',
  '[
    {"q": "Do you build factories in Khurrianwala?", "a": "Yes. Khurrianwala and the wider Faisalabad industrial area is our home ground."},
    {"q": "Can you extend an existing factory?", "a": "Yes. We design and build extensions to running factories and plan the work around production."}
  ]'::jsonb,
  5
),
(
  'Renovation & Extensions',
  'renovation-extensions',
  'Additional floors, extensions, remodelling and structural repairs for existing buildings.',
  E'## What is included\n\n- Additional floors and room extensions\n- Interior and exterior remodelling\n- Structural repairs and strengthening\n- Boundary walls and outdoor works\n- Waterproofing and seepage repairs\n\nEvery renovation starts with checking the existing structure, so new work is safe to add.',
  '[
    {"q": "Can you add a floor to my existing house?", "a": "Usually yes, after we check the existing foundation and structure."},
    {"q": "Do you take small repair jobs?", "a": "[Confirm minimum job size with H.H Associate]"}
  ]'::jsonb,
  6
)
on conflict (slug) do nothing;
