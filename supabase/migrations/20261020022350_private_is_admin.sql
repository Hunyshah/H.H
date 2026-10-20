-- Move is_admin() out of the API-exposed `public` schema (Supabase advisor
-- 0028/0029): it stays callable from RLS policies but not via /rest/v1/rpc.
-- Policies reference the function by OID, so they follow the move.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

alter function public.is_admin() set schema private;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Let a signed-in user see whether they are an admin (their own row only).
-- Used by the admin panel's server-side gate.
grant select on public.admins to authenticated;

create policy "Users can read their own admin row"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));
