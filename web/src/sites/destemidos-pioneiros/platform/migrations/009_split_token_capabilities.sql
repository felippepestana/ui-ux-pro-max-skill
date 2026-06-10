-- Migration 009 — split token capabilities + gate anonymous uploads
-- Hardening prompted by Codex review of migration 008 (P1 + P2). RESTRICTS access.
--
-- P1: get_senderista_publico previously matched upload_token OR mensagens_token and
--     returned exam/status data. The mensagens_token is meant to be shared broadly with
--     family, so it must NOT unlock the exam/status portal. It now matches ONLY
--     upload_token; a separate, minimal RPC serves the messages portal.
-- P2: the anon storage INSERT policies only checked the bucket name, letting any anon
--     client write arbitrary objects into the private buckets. They now require the
--     object's first path segment to be a real senderista id (a UUID only obtainable by
--     possessing a valid token), preventing arbitrary-prefix spam.

-- P1 — exam/status portal: upload_token only.
create or replace function public.get_senderista_publico(p_token uuid)
returns table (
  id uuid, nome text, status text, classificacao_risco text,
  exames_exigidos text[], orientacoes text, motivo_reprovacao text, evento_nome text
)
language sql security definer set search_path = public stable
as $$
  select s.id, s.nome, s.status, s.classificacao_risco, s.exames_exigidos,
         s.orientacoes, s.motivo_reprovacao, s.evento_nome
  from public.senderistas s
  where s.upload_token = p_token
  limit 1;
$$;
revoke all on function public.get_senderista_publico(uuid) from public;
grant execute on function public.get_senderista_publico(uuid) to anon, authenticated;

-- P1 — family-messages portal: mensagens_token only, minimal columns (who to address).
create or replace function public.get_senderista_mensagens(p_token uuid)
returns table (id uuid, nome text, evento_nome text)
language sql security definer set search_path = public stable
as $$
  select s.id, s.nome, s.evento_nome
  from public.senderistas s
  where s.mensagens_token = p_token
  limit 1;
$$;
revoke all on function public.get_senderista_mensagens(uuid) from public;
grant execute on function public.get_senderista_mensagens(uuid) to anon, authenticated;

-- P2 — capability check for anon uploads.
create or replace function public.is_senderista_id(p_id text)
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (select 1 from public.senderistas where id::text = p_id);
$$;
revoke all on function public.is_senderista_id(text) from public;
grant execute on function public.is_senderista_id(text) to anon, authenticated;

drop policy if exists "exames_insert_anon" on storage.objects;
create policy "exames_insert_anon" on storage.objects
  for insert to anon
  with check (bucket_id = 'exames' and public.is_senderista_id((storage.foldername(name))[1]));

drop policy if exists "mensagens_insert_anon" on storage.objects;
create policy "mensagens_insert_anon" on storage.objects
  for insert to anon
  with check (bucket_id = 'mensagens' and public.is_senderista_id((storage.foldername(name))[1]));

-- Residual (documented): a holder of EITHER token learns the senderista UUID and could
-- write to either bucket's folder. Fully separating per-bucket capability requires a
-- token-validated signed-upload flow (edge function) — tracked as a follow-up.
