-- Migration 008 — public portal access
-- Applied to Supabase project legendarios-top-destemidos-pioneiros (cxhiifgfumkdkdghljlr).
-- Additive: continues the manus migration sequence (001..007). Enables the token-gated
-- public portals (exam upload, family messages, status) used by the React platform.
--
-- Security notes (surfaced by `get_advisors`, all expected):
--   * get_senderista_publico is SECURITY DEFINER and callable by anon. This is the point:
--     the unguessable upload_token / mensagens_token IS the capability. It returns only a
--     minimal, non-sensitive slice (no CPF, phone, medical detail).
--   * anon may INSERT into the private buckets exames/mensagens but cannot SELECT them
--     (no anon SELECT policy) — staff (authenticated) reads via signed URLs.

create or replace function public.get_senderista_publico(p_token uuid)
returns table (
  id uuid,
  nome text,
  status text,
  classificacao_risco text,
  exames_exigidos text[],
  orientacoes text,
  motivo_reprovacao text,
  evento_nome text
)
language sql
security definer
set search_path = public
as $$
  select s.id, s.nome, s.status, s.classificacao_risco, s.exames_exigidos,
         s.orientacoes, s.motivo_reprovacao, s.evento_nome
  from public.senderistas s
  where s.upload_token = p_token or s.mensagens_token = p_token
  limit 1;
$$;

revoke all on function public.get_senderista_publico(uuid) from public;
grant execute on function public.get_senderista_publico(uuid) to anon, authenticated;

create policy "exames_insert_anon" on storage.objects
  for insert to anon
  with check (bucket_id = 'exames');

create policy "mensagens_insert_anon" on storage.objects
  for insert to anon
  with check (bucket_id = 'mensagens');
