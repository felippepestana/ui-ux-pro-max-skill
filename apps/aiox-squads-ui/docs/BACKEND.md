# Backend — aiox-squads-ui

## Modos de operação

O app sai de fábrica em **modo stub**: tRPC end-to-end + design system
+ todas as 60 rotas funcionando contra mocks em `lib/{matters,leads,…}.ts`.
Quando você configura Supabase + Postgres no `.env`, ele passa para
**modo live** sem alterações de código:

| Capacidade | Stub mode | Live mode |
| --- | :---: | :---: |
| UI completa, navegação, Cmd+K, Squad SSE simulada | ✅ | ✅ |
| `/api/trpc/*` respondendo dos mocks | ✅ | ✅ |
| Auth real (Supabase) com cookie de sessão | — | ✅ |
| Persistência (Prisma + Postgres) | — | F6.3 |
| RLS por officeId | — | ✅ (após policies) |
| Realtime para HITL push | — | F6.4 |

A flag que decide o modo é `BACKEND_ENABLED` em `lib/env.ts`, derivada de
`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `DATABASE_URL`.

## Setup Supabase + Postgres (passo a passo)

### 1. Criar projeto Supabase (5 min)

1. https://supabase.com/dashboard → **New Project**.
2. Nome: `aiox-squads`. Região: **South America (São Paulo)** —
   `sa-east-1`. Plano Free para dev.
3. Anote a senha do banco (você vai precisar para `DATABASE_URL`).

### 2. Capturar credenciais

No painel do projeto:

| Onde | Variável |
| --- | --- |
| **Settings → API → Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Settings → API → anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Settings → API → service_role** (secret!) | `SUPABASE_SERVICE_ROLE_KEY` |
| **Settings → Database → Connection string → Transaction pooler** | `DATABASE_URL` (adicione `?pgbouncer=true&connection_limit=1`) |
| **Settings → Database → Connection string → Direct connection** | `DIRECT_URL` |

Copie `.env.example` para `.env.local` em `apps/aiox-squads-ui/` e cole
os valores.

### 3. Migrar o schema

```bash
cd apps/aiox-squads-ui
npm run db:generate          # gera o Prisma Client
npm run db:migrate -- --name init
```

A migration cria as 17 tabelas no Postgres do Supabase (Office, User,
Client, Matter, Document, Squad, AuditLog, etc).

### 4. Seed (popular com os dados dos mocks)

```bash
npm run db:seed
```

Insere o escritório Pestana, 5 usuários, 7 clientes, 7 leads, 7 matters,
8 tasks, 7 deadlines, 6 documentos + 8 templates, 7 contratos, 6 faturas
e 3 pagamentos — exatamente os mesmos dos mocks. **Idempotente** (usa
`upsert`), pode rodar múltiplas vezes.

### 5. (Opcional) habilitar Auth real

No painel Supabase → **Authentication → Providers → Email**, habilite
"Email + Password" (ou Magic Link). Crie usuários com os mesmos `id`
do seed para a sessão resolver o membership do escritório:

```sql
-- Run in Supabase SQL editor; trigger the email signup with a known UUID.
-- (Or use the Auth API admin endpoint to create users with `id = 'u-1'`.)
```

Após isso, o `/login` passa a chamar `signInWithPassword` real e o
`lib/auth.ts` retorna a sessão verdadeira em vez do stub.

### 6. (Opcional) RLS para multi-tenant

Quando o escritório for multi-tenant, ative Row Level Security:

```sql
ALTER TABLE "Matter" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON "Matter"
  USING (
    "officeId" IN (
      SELECT "officeId" FROM "User"
      WHERE id::text = auth.uid()::text
    )
  );

-- Repita para Client, Lead, Document, Invoice, AuditLog, etc.
```

(Opcional v1: rodar single-tenant e adiar RLS para v1.5.)

## Comandos disponíveis

```bash
npm run db:generate    # Prisma Client
npm run db:migrate     # nova migration interativa
npm run db:push        # sincroniza schema sem migration (dev rápido)
npm run db:studio      # Prisma Studio (GUI no localhost:5555)
npm run db:seed        # popula com dados dos mocks
```

## Anatomia técnica

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
   ├─ client.tsx               # createTRPCReact + Provider
   └─ routers/                 # matters, leads, clients, squads, audit

middleware.ts                  # root middleware → updateSession()
prisma/
├─ schema.prisma               # 17 models + enums
└─ seed.ts                     # popula com mocks (npm run db:seed)
```

## Próximas sub-fases

| Sub-fase | Escopo |
| --- | --- |
| **F6.1** ✅ | Schema + tRPC scaffold + dual-mode env |
| **F6.2** ✅ | Supabase Auth integrado + seed pronto + middleware de sessão |
| **F6.3** | Substituir os imports diretos de mocks nas páginas por `trpc.*.useQuery()` (~7 páginas) |
| **F6.4** | Inngest para SquadRuns + Supabase Realtime para HITL push |
| **F8** | Playwright e2e + Lighthouse + production deploy Vercel |

## Troubleshooting

### "Database is not available"

Confirme que `DATABASE_URL` está em `.env.local` (não `.env.example`) e
que a senha está URL-encoded (`@` → `%40`, etc).

### Login funciona mas componentes dão erro 500

Provavelmente Supabase Auth resolveu mas `DATABASE_URL` ainda não está
configurada — `lib/auth.ts` retorna uma sessão "magra" sem buscar perfil
do Postgres. Configure `DATABASE_URL` ou desative Supabase temporariamente
removendo `NEXT_PUBLIC_SUPABASE_URL` para voltar ao stub.

### Build na Vercel falhando com "DATABASE_URL not set"

Adicione todas as env vars em **Project Settings → Environment Variables**.
Lembre-se de marcar `SUPABASE_SERVICE_ROLE_KEY` como _Sensitive_.
