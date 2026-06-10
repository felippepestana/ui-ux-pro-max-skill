# Plataforma — TOP Destemidos Pioneiros

App React (`web/`) que opera o TOP em cima do backend Supabase
`legendarios-top-destemidos-pioneiros` (`cxhiifgfumkdkdghljlr`), consumido direto
do front com a publishable key + RLS. Convive com o editor legado: a rota `/`
segue sendo o editor; tudo de `/destemidos-pioneiros/*` é o site + plataforma.

## Superfícies

### Público (sem login)
| Rota | O quê |
|---|---|
| `/destemidos-pioneiros` | Site de marketing (hero, história, metodologia, programação, FAQ) |
| `/destemidos-pioneiros/inscricao` | Formulário do senderista → INSERT em `senderistas` (IMC + risco + tokens) |
| `/destemidos-pioneiros/exames/:upload_token` | Portal de upload de atestados |
| `/destemidos-pioneiros/mensagens/:mensagens_token` | Mensagens da família (carta/foto/vídeo/áudio) |
| `/destemidos-pioneiros/status/:upload_token` | Status da inscrição + exames |

Os portais por token leem o senderista via RPC `get_senderista_publico(uuid)`
(SECURITY DEFINER, fatia mínima — sem CPF/telefone/dado médico). O token UUID,
não-adivinhável, é a credencial.

### Painel do staff (hakunas autenticados)
| Rota | O quê |
|---|---|
| `/destemidos-pioneiros/painel/login` | Supabase Auth (senha ou magic link) |
| `…/painel` | Dashboard: contagens por status/risco/presença, exames pendentes |
| `…/painel/senderistas` | Lista + ficha; editar status, risco, exames exigidos, orientações |
| `…/painel/exames` | Fila de validação (aprovar/reprovar, preview por signed URL) |
| `…/painel/prontuarios/:senderista_id` | Prontuário (queixas/condutas/fotos) |
| `…/painel/trilha` | Checkpoints com GPS + check-in/out (busca por nome/CPF/NFC) |
| `…/painel/mensagens` | Entrega de mensagens (marcar visualizado) |

O acesso é guardado por `RequireHakuna`: exige sessão autenticada **e** um registro
em `public.hakunas` com o mesmo e-mail.

## Onboarding de staff (necessário para acessar o painel)

O painel fica inacessível enquanto não houver um `hakuna`. Para liberar um e-mail:

```sql
insert into public.hakunas (email, nome, role)
values ('pessoa@exemplo.com', 'Nome da Pessoa', 'admin')
on conflict (email) do update set nome = excluded.nome;
```

Depois é só logar em `…/painel/login` por **magic link** com esse e-mail — o usuário
do Supabase Auth é criado no primeiro acesso e o e-mail casa com `hakunas`. (Pré-criar
usuário no Auth não é necessário.)

> Em **Supabase → Authentication → URL Configuration**, inclua o domínio publicado
> (ex.: `https://legendarios-top.netlify.app`) em *Site URL* e *Redirect URLs*
> (`…/destemidos-pioneiros/painel`) para o magic link redirecionar certo.

## Modelo de dados (resumo)

`senderistas` (participantes, com IMC gerado e `classificacao_risco`) ·
`hakunas` (staff) · `exames` (atestados, validação) · `prontuarios` ·
`mensagens_apoio` · `atividades_top` (checkpoints) · `participacoes` (check-in/out).
Buckets privados de Storage: `exames`, `mensagens`, `prontuarios`.

Migrations versionadas em `platform/migrations/` (008 = acesso dos portais públicos).
Tipos em `platform/database.types.ts` (gerados do schema real).

## Classificação de risco (preliminar, client-side)

`platform/lib/risco.ts` deriva risco de idade + IMC + comorbidades + condição física
e mapeia para os exames exigidos (CG / + cardio / + esteira). O staff pode sobrescrever
risco e exames na ficha do senderista.

## Seed opcional de checkpoints (para demonstrar a Trilha)

```sql
insert into public.atividades_top (nome, tipo, descricao, evento_nome, hora_planejada) values
  ('Largada', 'saida', 'Concentração e saída', 'TOP 1270 — Destemidos Pioneiros', now()),
  ('Hidratação 1', 'hidratacao', 'Primeiro ponto de água', 'TOP 1270 — Destemidos Pioneiros', now()),
  ('Acampamento', 'acampamento', 'Pernoite', 'TOP 1270 — Destemidos Pioneiros', now()),
  ('Cume', 'checkpoint', 'Ponto mais alto', 'TOP 1270 — Destemidos Pioneiros', now()),
  ('Chegada', 'chegada', 'Cerimônia de entrega', 'TOP 1270 — Destemidos Pioneiros', now());
```

## Deploy

Ver `DEPLOY_VERCEL.md` (Vercel, alvo principal) e `netlify.toml` (Netlify).
Build: `npm run build --workspace web` → `web/dist`. Variáveis: `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` (embutidas no bundle pelo Vite; a publishable key é pública
por design, protegida por RLS).
