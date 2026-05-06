# Deploy — aiox-squads-ui

Dois caminhos de deploy estão configurados, e **você precisa escolher um para
ficar ativo** (manter os dois ligados causa builds duplicados):

| Caminho | O que dispara | Setup | Deploy duplicado se… |
| --- | --- | --- | --- |
| **Vercel nativo** (recomendado) | Push pelo dashboard | 5 min, sem secrets no GH | …workflow `*-deploy.yml` também estiver ligado |
| **GitHub Actions** | Workflow `aiox-squads-ui-deploy.yml` | secrets no GH + token Vercel | …auto-deploy nativo do Vercel também estiver ligado |

A integração nativa é mais simples. Use o GitHub Actions quando você precisar
controlar o pipeline (gates, aprovações, jobs custom antes/depois do deploy).

---

## 1. Caminho A — Vercel nativo (5 min)

1. https://vercel.com/signup → Continue with GitHub.
2. https://vercel.com/new → escolha o repositório
   `felippepestana/ui-ux-pro-max-skill`.
3. Em **Configure Project**:
   - **Root Directory**: clique em "Edit" → selecione
     `apps/aiox-squads-ui`.
   - **Framework Preset**: Next.js (auto-detectado).
   - **Build / Install / Output Directory**: deixar em branco — o
     `vercel.json` no repo já define.
   - **Production Branch**: `main`.
4. Click **Deploy**. Em ~2 min uma URL fica disponível.

A partir daí:

- Cada push em `main` gera **production deploy** em
  `https://aiox-squads-ui.vercel.app` (URL exata depende do nome do projeto).
- Cada push em qualquer outra branch gera **preview deploy** com URL única
  por commit, comentada automaticamente no PR pelo bot Vercel.

> Para evitar duplicação, **desabilite o workflow Actions de deploy**:
> em `.github/workflows/aiox-squads-ui-deploy.yml`, troque os triggers de
> `on: push` para `on: workflow_dispatch:` (manual apenas).

---

## 2. Caminho B — GitHub Actions (controle total)

### 2.1 Obter credenciais Vercel

Mesmo usando o Actions, você precisa de um projeto Vercel criado (gratuito).
Faça os passos 1-3 do **Caminho A** primeiro, **mas remova a integração Git**
em **Project → Settings → Git → Disconnect** depois do projeto criado.

Em seguida, capture as três credenciais:

| Secret | Onde obter |
| --- | --- |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → Create. Escopo "Full Account". |
| `VERCEL_ORG_ID` | Em qualquer projeto Vercel: **Settings → General → Team ID** (ou rode `vercel link` localmente em `apps/aiox-squads-ui/` e abra `.vercel/project.json`). |
| `VERCEL_PROJECT_ID` | **Project Settings → General → Project ID** (mesmo `.vercel/project.json` se usar `vercel link`). |

### 2.2 Configurar secrets no GitHub

`https://github.com/felippepestana/ui-ux-pro-max-skill/settings/secrets/actions`
→ **New repository secret** três vezes:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

(Opcional) Crie environments `production` e `preview` em **Settings →
Environments** se quiser exigir aprovação manual antes de production deploys.

### 2.3 Como o workflow se comporta

```
push em main                           → vercel deploy --prod
push em qualquer outra branch          → vercel deploy (preview)
                                         comenta a URL no PR aberto
workflow_dispatch (manual no Actions)  → escolhe preview ou production
```

O workflow é executado apenas quando arquivos em `apps/aiox-squads-ui/**`
mudam, então edits no resto do repo (CLI, src/, docs/) não disparam deploy.

---

## 3. Workflow de CI (independente do deploy)

`aiox-squads-ui-ci.yml` roda em todo PR e push para `main`:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Esse workflow é seguro de manter ligado em paralelo com qualquer um dos dois
caminhos de deploy — ele não publica nada, só valida.

---

## 4. Smoke test pós-deploy

Independentemente do caminho:

```bash
URL=https://aiox-squads-ui.vercel.app  # ajuste para sua URL real

curl -s -o /dev/null -w "/ -> %{http_code}\n"            $URL/
curl -s -o /dev/null -w "/workspace -> %{http_code}\n"   $URL/workspace
curl -s -o /dev/null -w "/login -> %{http_code}\n"       $URL/login
curl -s -o /dev/null -w "/inbox -> %{http_code}\n"       $URL/inbox
```

Esperado: `307` em `/` (redirect para `/workspace`) e `200` nas demais.

---

## 5. Migração para VPS Hostinger (Fase 5)

Quando o projeto sair do Vercel preview e for para a VPS Hostinger
contratada, vamos preparar:

- `Dockerfile` (Next standalone build)
- `docker-compose.yml` (web + postgres + redis + nginx + certbot)
- `ecosystem.config.cjs` (PM2 alternativa sem Docker)
- `nginx.conf` (reverse proxy + SSL termination)

Está fora do escopo das fases iniciais, mas o `next.config.ts` já está com
`output: "standalone"` para tornar essa migração trivial.
