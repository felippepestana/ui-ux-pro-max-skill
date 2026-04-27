# aiox-squads-ui

Dashboard operacional **fullservice** para advogados e escritórios de
advocacia, baseado em **squads de agentes de IA**. Stack: Next.js 15 (App
Router) · TypeScript estrito · Tailwind v4 · padrão shadcn/ui · React 19.

> Direção visual: **Authority Navy + Gold** (`#1E3A8A` + `#B45309`) com
> tipografia EB Garamond (heading) + Lato (body).
> Tokens derivados de `src/ui-ux-pro-max/data/colors.csv` linha 40 e
> `typography.csv` linha 29 do skill `ui-ux-pro-max`.

## Comandos

```bash
npm install      # instala dependências
npm run dev      # http://localhost:3000  (Turbopack)
npm run typecheck
npm run lint
npm run build    # build standalone (pronto para Docker/PM2 em VPS)
npm start        # roda o build standalone
```

## Estrutura

```
app/
  (app)/                  # shell autenticado (Sidebar + canvas)
    layout.tsx
    workspace/            # Home: KPIs + agenda + squads ao vivo
  (auth)/                 # login, signup, MFA (a implementar)
  layout.tsx              # root layout com fontes Google
  globals.css             # tailwind + tokens
components/
  ui/                     # primitives (Button, Card, ...)
  app-shell/              # Sidebar, Topbar, CommandMenu
design-system/
  tokens.css              # primitives + semantic CSS vars (light/dark)
  tokens.ts               # mirror TS para uso programático
lib/
  utils.ts                # cn() helper
```

## Status — Fase 0

- [x] Scaffold Next 15 + Tailwind v4 + TS estrito
- [x] Tokens (Authority Navy + Gold) light/dark
- [x] Componentes base: Button, Card, Sidebar
- [x] Workspace demo com KPIs, agenda e squads em execução
- [ ] Topbar + CommandMenu (Cmd+K) — Fase 1
- [ ] Login/MFA — Fase 1
- [ ] Casos + Squads — Fase 2

Próximas fases descritas em `/root/.claude/plans/busque-referencias-relativas-a-snoopy-island.md`.
