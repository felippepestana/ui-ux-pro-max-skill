# Backend — aiox-squads-ui

## Estado atual (F6.1)

- ✅ **tRPC** server + client configurados (`lib/trpc/`).
- ✅ **5 routers** publicados em `/api/trpc`: `matters`, `leads`,
  `clients`, `squads`, `audit`.
- ✅ **Schema Prisma completo** em `prisma/schema.prisma` com 17 models +
  enums tipados (UserRole, MatterStatus, DeadlineKind, etc).
- ✅ **Auth stub** em `lib/auth.ts` retornando o sócio (Felippe Pestana).
- ✅ **Middleware de papéis**: `protectedProcedure`, `partnerProcedure`,
  `lawyerProcedure`, `financialProcedure`.
- 🟡 **Procedures delegam aos mocks** em `lib/{matters,leads,...}.ts`.
  Substituir por chamadas Prisma é o trabalho da F6.2.
- ⛔ **Sem Postgres rodando**, sem Supabase Auth, sem Inngest. Esta sub-fase
  é apenas o scaffold; nenhum componente da UI ainda chama tRPC (todos
  continuam importando os mocks diretamente).

## Como rodar tRPC localmente (sem Postgres)

Já está rodando. O dev server expõe `POST /api/trpc/<router>.<procedure>`
e os routers retornam dados dos mocks. Você pode testar com:

```bash
npm run dev
# Em outro terminal
curl -s -X POST http://localhost:3000/api/trpc/matters.list \
  -H 'content-type: application/json' \
  -d '{"json":{}}' | jq
```

## Ativar Postgres real (F6.2 — checklist)

### 1. Provisionar banco

Escolha uma das opções (custo zero em free tier):

| Opção | Vantagem |
| --- | --- |
| **Supabase** (recomendado) | Postgres + Auth + Realtime + RLS no mesmo painel |
| **Neon** | Postgres serverless, branching, integração nativa Vercel |
| **Postgres local** (Docker) | `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16` |

### 2. Configurar `.env`

Crie `apps/aiox-squads-ui/.env` (não commit) com:

```
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/aiox?schema=public"
DIRECT_URL="postgresql://USUARIO:SENHA@HOST:5432/aiox?schema=public"  # supabase: pooled vs direct

# Supabase Auth (opcional ainda em F6.1)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."  # server-only
```

### 3. Gerar o Prisma Client + migration

```bash
cd apps/aiox-squads-ui
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed   # quando criarmos prisma/seed.ts em F6.2
```

### 4. Substituir mocks pelos calls Prisma

Cada `// TODO F6.2` nos routers (`lib/trpc/routers/*.ts`) marca o lugar
onde o mock vira chamada Prisma. Exemplo:

```ts
// Hoje (F6.1):
return MATTERS.filter((m) => m.status === input?.status);

// Amanhã (F6.2):
return ctx.db.matter.findMany({
  where: {
    officeId: ctx.user.officeId,
    status: input?.status,
  },
  orderBy: { openedAt: "desc" },
});
```

### 5. Substituir imports diretos nos componentes

Hoje os componentes importam `import { MATTERS } from "@/lib/matters"`
direto. Em F6.3 trocamos por:

```ts
const { data: matters } = trpc.matters.list.useQuery({ status: "ativo" });
```

Cada página vira client-component (ou usa hidratação SSR via
`createServerSideHelpers`).

### 6. Habilitar RLS server-side

Para multi-tenant com Supabase:

```sql
ALTER TABLE "Matter" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Matter"
  USING (office_id = auth.uid_office_id());
```

(função custom mapeando `auth.uid()` → `officeId` via `User`)

### 7. SquadRuns assíncronos via Inngest (F6.2.x)

Vercel timeout de 60s mata Squad Runs reais (>1min). Antes de chamar LLM
real, configurar Inngest:

```bash
npm install inngest
```

E os `squads.start` mutations enfileiram `inngest.send({ name: "squad/run" })`
em vez de rodar inline.

## Anatomia do tRPC neste projeto

```
lib/
├─ db.ts                       # Prisma client singleton (lazy)
├─ auth.ts                     # getCurrentUser() — stub agora, Supabase em F6.2
└─ trpc/
   ├─ context.ts               # createContext() injeta { user, db } em cada request
   ├─ server.ts                # initTRPC + middlewares de papel (RBAC)
   ├─ client.tsx               # createTRPCReact + Provider (client component)
   └─ routers/
      ├─ _app.ts               # appRouter + AppRouter type
      ├─ matters.ts
      ├─ leads.ts
      ├─ clients.ts
      ├─ squads.ts
      └─ audit.ts

app/
├─ api/trpc/[trpc]/route.ts    # fetch handler (Next App Router)
└─ (app)/
   ├─ providers.tsx            # <TRPCProvider> client wrapper
   └─ layout.tsx               # envolve children com <Providers>
```

## Próximos passos (F6.2 → F8)

| Sub-fase | Escopo |
| --- | --- |
| **F6.1** ✅ | Schema + tRPC scaffold (você está aqui) |
| **F6.2** | Postgres real + Prisma calls nos routers + Supabase Auth + seed |
| **F6.3** | Migrar componentes UI dos mocks para `trpc.*.useQuery` |
| **F6.4** | Inngest para SquadRuns + Realtime para HITL push |
| **F7** | Já entregue como UI; backend cobre faturamento + RBAC enforcement |
| **F8** | Playwright e2e + Lighthouse + deploy production Vercel |
