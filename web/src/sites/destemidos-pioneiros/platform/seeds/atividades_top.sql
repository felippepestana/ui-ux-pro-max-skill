-- Seed — checkpoints da TOP 1270 Destemidos Pioneiros (Porto Velho/RO, 02-05 Out 2025)
--
-- NÃO é uma migration. Versionado aqui para reprodutibilidade e revisão; rode via
-- Supabase MCP `execute_sql` ou `psql` quando quiser semear as atividades base.
--
-- Idempotente: usa `on conflict do nothing` apoiado num UNIQUE parcial (cria primeiro
-- se ainda não existir). Como `atividades_top` não tem unique natural, este seed
-- usa um trick com (evento_nome, nome) como guardrail.
--
-- Coordenadas: pontos aproximados da região do evento (Porto Velho/RO). Ajuste com
-- GPS real no painel `/destemidos-pioneiros/painel/trilha` ("Usar GPS") quando estiver
-- em campo — esses valores são marcadores iniciais, não definitivos.
--
-- Para limpar (rollback manual):
--   delete from public.atividades_top where evento_nome = 'TOP 1270 — Destemidos Pioneiros';

create unique index if not exists atividades_top_evento_nome_unique
  on public.atividades_top (evento_nome, nome);

insert into public.atividades_top (nome, tipo, descricao, evento_nome, localizacao_lat, localizacao_lng, hora_planejada)
values
  -- Quinta 02/10 — chegada e acolhida
  ('Recepção e check-in',          'checkpoint',  'Chegada dos senderistas, retirada de kit e credencial NFC.', 'TOP 1270 — Destemidos Pioneiros', -8.7619, -63.9039, '2025-10-02 14:00-04'),
  ('Prédica de abertura',          'predica',     'Mensagem inicial — chamado e propósito.',                    'TOP 1270 — Destemidos Pioneiros', -8.7619, -63.9039, '2025-10-02 19:30-04'),

  -- Sexta 03/10 — primeira jornada
  ('Saída — etapa 1',              'saida',       'Partida do acampamento base para a primeira etapa.',         'TOP 1270 — Destemidos Pioneiros', -8.7619, -63.9039, '2025-10-03 05:30-04'),
  ('Hidratação 1 — Km 7',          'hidratacao',  'Ponto de água e checagem de senderistas.',                   'TOP 1270 — Destemidos Pioneiros', -8.8000, -63.8500, '2025-10-03 08:00-04'),
  ('Hidratação 2 — Km 14',         'hidratacao',  'Ponto de água, frutas e checagem médica leve.',              'TOP 1270 — Destemidos Pioneiros', -8.8400, -63.8000, '2025-10-03 10:30-04'),
  ('Acampamento — bivouac 1',      'acampamento', 'Pernoite em campo. Prédica e comunhão.',                     'TOP 1270 — Destemidos Pioneiros', -8.8800, -63.7600, '2025-10-03 17:00-04'),

  -- Sábado 04/10 — segunda jornada
  ('Saída — etapa 2',              'saida',       'Partida do bivouac 1 para a etapa final.',                   'TOP 1270 — Destemidos Pioneiros', -8.8800, -63.7600, '2025-10-04 05:30-04'),
  ('Hidratação 3 — Km 21',         'hidratacao',  'Ponto de água e ajuste de mochila.',                         'TOP 1270 — Destemidos Pioneiros', -8.9200, -63.7200, '2025-10-04 08:30-04'),
  ('Checkpoint médico — meio',     'checkpoint',  'Aferição rápida (sinais, queixas).',                         'TOP 1270 — Destemidos Pioneiros', -8.9600, -63.6800, '2025-10-04 11:00-04'),
  ('Acampamento — bivouac 2',      'acampamento', 'Pernoite final. Prédica de coroação.',                       'TOP 1270 — Destemidos Pioneiros', -9.0000, -63.6400, '2025-10-04 17:00-04'),

  -- Domingo 05/10 — chegada
  ('Chegada — TOP 1270',           'chegada',     'Linha de chegada e celebração.',                             'TOP 1270 — Destemidos Pioneiros', -9.0400, -63.6000, '2025-10-05 11:00-04'),
  ('Prédica de envio',             'predica',     'Mensagem de envio e oração final.',                          'TOP 1270 — Destemidos Pioneiros', -9.0400, -63.6000, '2025-10-05 13:00-04')
on conflict (evento_nome, nome) do nothing;
