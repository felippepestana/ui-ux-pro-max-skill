# Deploy — Site + Plataforma TOP Destemidos Pioneiros

O frontend (`web/`) é um SPA Vite + React. O **site de marketing** e a **plataforma**
(`/destemidos-pioneiros/*`) falam direto com o Supabase via RLS — **não precisam de
backend próprio**. Por isso um deploy **estático** já entrega a plataforma completa.

> ⚠️ O **editor** legado em `/` chama um backend Flask em `/api/*`. Esse backend NÃO é
> publicado neste deploy estático (a config faz `/api/*` retornar 404 em vez de devolver
> HTML). Se quiser o editor online, hospede o Flask separadamente (Docker/Railway/Render —
> ver `DEPLOYMENT.md`) e troque a 1ª rewrite por um proxy para a URL dele.

## Recomendação: Vercel (você tem Pro)

Melhor encaixe para Vite, com preview deployments por PR. A config já está em
[`vercel.json`](./vercel.json) (monorepo-aware):

- `installCommand`: `npm install` (instala os workspaces)
- `buildCommand`: `npm run build --workspace web`
- `outputDirectory`: `web/dist`
- SPA fallback: tudo (exceto `/api/*`) → `/index.html`
- `assets/*` com cache imutável de 1 ano

### Passos

1. **Importar o repositório** em https://vercel.com/new (conecte o GitHub
   `felippepestana/ui-ux-pro-max-skill`).
2. **Root Directory:** deixe na raiz (`./`) — o `vercel.json` já aponta para `web/`.
   Não defina o root como `web/`, senão o `vercel.json` da raiz é ignorado.
3. **Framework Preset:** Other (a config já define build/output).
4. **Environment Variables** (Production + Preview):
   | Nome | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://cxhiifgfumkdkdghljlr.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | a publishable key `sb_publishable_…` do projeto |
5. **Deploy.** A plataforma fica em `https://<projeto>.vercel.app/destemidos-pioneiros`.
6. **Supabase Auth → URL config:** em Authentication → URL Configuration, adicione o
   domínio da Vercel em *Site URL* e *Redirect URLs* (necessário para o magic link do
   `/painel/login`). Inclua `https://<dominio>/destemidos-pioneiros/painel`.

### Via CLI (opcional)

```bash
npm i -g vercel
vercel link            # associa o diretório ao projeto
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

Node: o build exige Node 18+ (Vite 5). A Vercel usa 20 por padrão — ok.

## Alternativa: Netlify

Equivalente em capacidade. Config mínima (`netlify.toml`):

```toml
[build]
  command = "npm run build --workspace web"
  publish = "web/dist"

[[redirects]]
  from = "/api/*"
  to = "/api/:splat"
  status = 404

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Mesmas variáveis de ambiente. (Há um MCP do Netlify disponível neste ambiente, então
o deploy no Netlify pode ser disparado por aqui se você preferir.)

## Checklist pós-deploy

- [ ] `/destemidos-pioneiros` carrega (marketing) com a paleta correta
- [ ] `/destemidos-pioneiros/inscricao` grava em `senderistas` (IMC + tokens)
- [ ] `/destemidos-pioneiros/exames/:token` e `/mensagens/:token` sobem arquivos
- [ ] `/destemidos-pioneiros/painel/login` autentica um hakuna cadastrado
- [ ] Deep links (ex.: `/destemidos-pioneiros/painel/senderistas`) não dão 404 (SPA fallback)
