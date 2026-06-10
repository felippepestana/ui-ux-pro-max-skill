# Deploy — TOP Destemidos Pioneiros

Checklist para subir o primeiro release na Vercel. Faça na ordem.

## 1. Variáveis de ambiente na Vercel

Em <https://vercel.com/felippepestana/ui-ux-pro-max-skill/settings/environment-variables>, adicione (escopo **Production + Preview + Development**):

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://cxhiifgfumkdkdghljlr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_y6dN2pybXwUJlRc0QPAgFg_35VVKk_X` |

A publishable key é safe-to-ship — protegida por RLS no banco.

Após salvar, **rebuilde o último deploy** (Deployments → … → Redeploy) para as vars pegarem.

## 2. Supabase Auth — Site URL + Redirect URLs

Sem isso, login por link mágico do painel não funciona (link redireciona pra lugar nenhum).

<https://supabase.com/dashboard/project/cxhiifgfumkdkdghljlr/auth/url-configuration>

- **Site URL:** `https://ui-ux-pro-max-skill.vercel.app` (ou o domínio final quando configurar)
- **Redirect URLs** (uma por linha, com wildcard pros previews):
  ```
  https://ui-ux-pro-max-skill-*-felippepestana.vercel.app/destemidos-pioneiros/painel
  https://ui-ux-pro-max-skill-*.vercel.app/destemidos-pioneiros/painel
  http://localhost:5173/destemidos-pioneiros/painel
  ```

Save. Não precisa redeploy — config é lida em runtime.

## 3. Vercel — remover projeto duplicado

Cada push faz 2 builds (`ui-ux-pro-max-skill` e `ui-ux-pro-max-skill-ke7m`). O `-ke7m` é duplicado autocriado.

<https://vercel.com/felippepestana/ui-ux-pro-max-skill-ke7m/settings> → final da página → **Delete Project**.

## 4. Marcar PR #3 ready for review

Eu marco via MCP (este commit já faz parte do PR), mas você pode confirmar em <https://github.com/felippepestana/ui-ux-pro-max-skill/pull/3>.

## 5. Smoke test pós-deploy

Abra o preview e valide:

| Rota | O que verificar |
|---|---|
| `/destemidos-pioneiros` | Microsite carrega, CTAs apontam para `/inscricao` |
| `/destemidos-pioneiros/inscricao` | Form aparece, IMC calcula ao vivo, termo gravado |
| `/destemidos-pioneiros/exames/<upload_token>` | Pede o token; com inválido mostra "Link inválido ou expirado" |
| `/destemidos-pioneiros/mensagens/<mensagens_token>` | Idem |
| `/destemidos-pioneiros/painel/login` | Form de login + link mágico |
| `/destemidos-pioneiros/painel` (após login) | Dashboard com 3 stats + cards por risco/status |
| `/destemidos-pioneiros/painel/trilha` | Mostra os 12 checkpoints do TOP 1270 |

Se algum portal token-gated der "migração de banco pendente", a função RPC `get_senderista_publico` precisa ser checada via Supabase MCP — mas já confirmamos que está aplicada.

## 6. Primeiro hakuna de teste

Pra logar no painel você precisa de uma conta autenticada **e** uma linha em `hakunas`. Crie via Supabase MCP (ou peça que eu crie quando autorizar):

```sql
-- substitua o email
insert into auth.users (...) -- via dashboard Auth → Add user
-- depois:
insert into public.hakunas (email, nome, role) values ('seu@email.com', 'Seu Nome', 'admin');
```

Mais rápido: vá em <https://supabase.com/dashboard/project/cxhiifgfumkdkdghljlr/auth/users>, "Add user", marque "Auto Confirm User"; depois execute o `insert into hakunas` no SQL Editor.

## Estado atual

- Banco vivo: 12 atividades semeadas, RLS aplicado, função `get_senderista_publico` com ACL explícita
- Frontend: build limpo (`tsc --noEmit` + `vite build`), TypeScript sincronizado com schema
- CodeRabbit: desativado via `.coderabbit.yaml`
- 4 frentes do plano (A→D→C→B) concluídas
