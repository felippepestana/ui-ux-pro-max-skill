# Backend — aiox-squads-ui

## Modos de operação

O app sai de fábrica em **modo stub**: tRPC end-to-end + design system
+ todas as 60 rotas funcionando contra mocks em `lib/{matters,leads,…}.ts`.
Quando você configura Supabase + Postgres no `.env.local`, ele passa para
**modo live** sem alterações de código.

| Capacidade | Stub mode | Live mode |
| --- | :---: | :---: |
| UI completa, navegação, Cmd+K, Squad SSE simulada | ✅ | ✅ |
| `/api/trpc/*` respondendo | ✅ (do mock) | ✅ (do DB) |
| Auth real (Supabase) com cookie de sessão | — | ✅ |
| Persistência (Prisma + Postgres) | — | ✅ |
| RLS por officeId | — | ✅ (após policies) |
| Realtime para HITL push | — | F6.5 |

A flag que decide o modo é `BACKEND_ENABLED` em `lib/env.ts`, derivada de
`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `DATABASE_URL`.

---

# 🚀 Setup Supabase — passo a passo

Tempo estimado: **10-15 minutos**. Só você precisa fazer.

## Passo 1 — Criar projeto no Supabase

1. Abra https://supabase.com/dashboard.
2. Clique em **New Project** (canto superior direito).
3. Preencha:
   - **Name:** `aiox-squads`
   - **Database Password:** clique em "Generate a password" e **copie/salve**.
     Você vai precisar.
   - **Region:** **South America (São Paulo) — sa-east-1**
   - **Plan:** Free (suficiente para dev/MVP)
4. Clique em **Create new project**. Aguarde ~2 min.

## Passo 2 — Habilitar Auth (Email + Password)

Enquanto o projeto provisiona:

1. No painel do projeto: **Authentication → Providers**.
2. Em **Email**, certifique-se que está **Enabled** (vem por padrão).
3. **Confirm email** — desative para dev (você cria usuários e já entra).
4. Clique em **Save**.

## Passo 3 — Capturar as 5 credenciais

Você vai precisar de **5 valores** dentro do painel:

### 3.1 Supabase API (3 valores)

**Project Settings → API**:

| Campo no painel | Variável no `.env.local` |
| --- | --- |
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** (Project API Keys) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** (Project API Keys, _secret_) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **service_role** dá acesso administrativo total. **Nunca** suba para
> Git e nunca exponha no client-side.

### 3.2 Postgres connection strings (2 valores)

**Project Settings → Database → Connection string**:

| Campo no painel | Variável | Característica |
| --- | --- | --- |
| **Transaction pooler** (porta 6543) | `DATABASE_URL` | Runtime — Vercel/Edge friendly |
| **Direct connection** (porta 5432) | `DIRECT_URL` | Migrations — Prisma exige |

Adicione `?pgbouncer=true&connection_limit=1` ao final do **DATABASE_URL**
(não no DIRECT_URL).

### Importante: senha com caracteres especiais

O Supabase coloca o placeholder `[YOUR-PASSWORD]` na string. Substitua
pela senha que você gerou no Passo 1. Se a senha tem `@`, `:`, `/`, `?`,
`#` ou `&`, **URL-encode** esses caracteres:

| Char | Encoded |
| --- | --- |
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `&` | `%26` |

Exemplo: senha `Pa@ss/word#1` → `Pa%40ss%2Fword%231`.

## Passo 4 — Criar `.env.local`

```bash
cd apps/aiox-squads-ui
cp .env.example .env.local
```

Abra `.env.local` e cole os 5 valores. Formato esperado:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR...
DATABASE_URL=postgresql://postgres.abcd1234:SUA-SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.abcd1234:SUA-SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

> 📝 `.env.local` é ignorado pelo git (já está no `.gitignore`).

## Passo 5 — Diagnóstico antes de migrar

```bash
npm run backend:check
```

Esse comando faz 5 verificações:

1. ✓ todas as 5 env vars presentes
2. ✓ Postgres responde via pooler (DATABASE_URL)
3. ✓ Postgres responde via direta (DIRECT_URL — necessário para migrate)
4. ✓ Supabase Auth endpoint reachable
5. ✓ tabelas Prisma existem (vai falhar — esperado antes de migrar)

Se algum dos itens 1-4 falhar, corrija antes de prosseguir.

## Passo 6 — Migrar o schema

```bash
npm run db:generate          # gera o Prisma Client local
npm run db:migrate -- --name init
```

A migration cria as **17 tabelas** + enums no Postgres do Supabase.
Output esperado:

```
✔ Database in sync
Applying migration `20260101_init`
✔ Generated Prisma Client
```

## Passo 7 — Popular com dados dos mocks

```bash
npm run db:seed
```

Insere o escritório Pestana, 5 usuários, 7 clientes, 7 leads, 7 matters,
8 tasks, 7 deadlines, 6 documentos + 8 templates, 7 contratos, 6 faturas
e 3 pagamentos — exatamente os mesmos dos mocks. **Idempotente** (`upsert`).

Output esperado:

```
→ Seeding office, users, squads…
→ Seeding clients & leads…
→ Seeding matters, tasks, deadlines, documents…
→ Seeding billing (contracts, invoices, payments)…
✓ Seed concluído.
```

## Passo 8 — Verificar no Studio

```bash
npm run db:studio
```

Abre Prisma Studio em http://localhost:5555. Confirme que:

- **Office** tem 1 linha (Pestana SIA)
- **User** tem 5 linhas
- **Matter** tem 7 linhas

(Ou abra direto no Supabase: **Table Editor** no painel.)

## Passo 9 — Criar usuário admin para testar login

No painel Supabase: **Authentication → Users → Add user**:

- **Email:** `felippe@pestana.adv.br`
- **Password:** uma senha forte que você lembre
- **Auto Confirm User:** ✓

> ⚠️ Importante: o `id` UUID que o Supabase gera vai ser **diferente** do
> `u-1` do seed. Para a sessão resolver o membership corretamente, rode:

```sql
-- No SQL Editor do Supabase:
UPDATE "User" SET id = (
  SELECT id::text FROM auth.users WHERE email = 'felippe@pestana.adv.br'
) WHERE email = 'felippe@pestana.adv.br';
```

Em F6.5 vamos automatizar isso com um trigger (`auth.users` → `User`).

## Passo 10 — Rodar o app

```bash
npm run dev
```

Abra http://localhost:3000:

1. Você é redirecionado para `/workspace` (sem auth ainda) ou `/login` (auth ativa).
2. Faça login com o usuário criado no passo 9.
3. Navegue para `/matters` — você verá os 7 casos vindo do **Postgres real**
   (não dos mocks).

🎉 Pronto. A partir daí toda mutação vai persistir no DB.

## Passo 11 — Configurar no Vercel (deploy)

Quando for deployar para production, cadastre as **5 variáveis** em:

**Vercel Dashboard → Project → Settings → Environment Variables**.

Marque `SUPABASE_SERVICE_ROLE_KEY` como **Sensitive**.

---

# RLS opcional para multi-tenant

Quando o escritório for multi-tenant, ative Row Level Security:

```sql
-- Run in Supabase SQL Editor

ALTER TABLE "Matter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Helper: returns the officeId of the authenticated user
CREATE OR REPLACE FUNCTION auth.user_office_id()
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT "officeId" FROM "User" WHERE id = auth.uid()::text
$$;

-- Apply to each tenant-scoped table
CREATE POLICY tenant_isolation ON "Matter"
  USING ("officeId" = auth.user_office_id());

CREATE POLICY tenant_isolation ON "Client"
  USING ("officeId" = auth.user_office_id());

-- ... repeat for Lead, Document, Invoice, AuditLog
```

(Opcional v1: rodar single-tenant e adiar RLS para v1.5.)

---

# Comandos disponíveis

```bash
npm run backend:check  # diagnóstico de conexão (rode primeiro)
npm run db:generate    # Prisma Client (após mudar schema)
npm run db:migrate     # nova migration interativa
npm run db:push        # sincroniza schema sem migration (dev rápido)
npm run db:studio      # Prisma Studio em :5555
npm run db:seed        # popula com dados dos mocks (idempotente)
```

---

# Anatomia técnica

```
lib/
├─ env.ts                      # SUPABASE_ENABLED, BACKEND_ENABLED flags
├─ db.ts                       # Prisma client singleton (lazy)
├─ auth.ts                     # getCurrentUser() — dual-mode
├─ supabase/
│  ├─ client.ts                # browser client (login form)
│  ├─ server.ts                # SSR client (Server Components, tRPC)
│  └─ middleware.ts            # session refresh helper
└─ trpc/
   ├─ context.ts               # createContext({ user, db })
   ├─ server.ts                # initTRPC + RBAC middlewares
   ├─ server-caller.ts         # tRPC caller para Server Components
   ├─ client.tsx               # createTRPCReact + Provider
   └─ routers/                 # matters, leads, clients, squads, audit,
                               # documents, tasks, deadlines, billing

middleware.ts                  # root middleware → updateSession()
prisma/
├─ schema.prisma               # 17 models + enums
└─ seed.ts                     # popula com mocks (npm run db:seed)
scripts/
└─ check-backend.mjs           # diagnóstico (npm run backend:check)
```

---

# Próximas sub-fases

| Sub-fase | Escopo |
| --- | --- |
| F6.1 ✅ | Schema Prisma + tRPC scaffold |
| F6.2 ✅ | Supabase Auth + seed (modo dual) |
| F6.3 ✅ | Refator UI → tRPC hooks |
| **F6.4** ⏳ | Substituir mocks pelos calls Prisma reais (após você rodar Passo 7) |
| F6.5 ⏳ | Inngest para SquadRuns + Realtime para HITL push |
| F8 ⏳ | Playwright e2e + Lighthouse + production deploy Vercel |

---

# Troubleshooting

### `npm run backend:check` falha em "Conexão Postgres direta"

Sua `DIRECT_URL` está errada. Confirme no painel Supabase: deve ser
**Direct connection** (porta 5432), não Transaction pooler.

### Migration falha com "P3014: Prisma Migrate could not create the shadow database"

Supabase free tier não permite criar shadow database. Use:

```bash
npm run db:push  # sincroniza sem shadow DB
```

(Alternativamente, em Settings → Database → Network Restrictions, libere
o IP da sua máquina dev.)

### Login funciona mas componentes dão erro 500

Provavelmente Supabase Auth resolveu mas a sessão não conseguiu mapear
para `User` do Postgres. Confira se você rodou o `UPDATE "User"` do
Passo 9.

### `Decimal` aparece como string nas respostas tRPC

É esperado — superjson serializa Decimal como string para preservar
precisão. No client use `Number(matter.caseValueBrl)` ou os helpers `BRL`
de `lib/billing.ts`.

### Build na Vercel falhando com "DATABASE_URL not set"

Adicione todas as 5 env vars em **Project Settings → Environment Variables**.
Lembre-se de marcar `SUPABASE_SERVICE_ROLE_KEY` como _Sensitive_.

### "Type 'undefined' is not assignable to type 'string'"

Provavelmente DATABASE_URL ou DIRECT_URL ficou em branco no `.env.local`.
Verifique se não há espaço antes do `=`.
