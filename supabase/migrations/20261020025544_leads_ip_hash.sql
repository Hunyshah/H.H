-- Rate limiting for the quote form without an extra service: each lead stores
-- a keyed hash of the sender's IP (never the raw IP), and the Server Action
-- counts recent leads per hash before inserting.

alter table public.leads add column if not exists ip_hash text;

create index if not exists leads_ip_hash_created_idx
  on public.leads (ip_hash, created_at desc)
  where ip_hash is not null;

comment on column public.leads.ip_hash is
  'HMAC-SHA256 of the submitter IP (server-side key). Used only for rate limiting.';
