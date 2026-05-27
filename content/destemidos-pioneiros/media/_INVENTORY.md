# Inventário de Mídia — TOP 1270 / Destemidos Pioneiros

> Estado: **aguardando credenciais do Instagram** para download automatizado via `scripts/collect-instagram.cjs`. Por enquanto, lista de fontes públicas identificadas para baixar manualmente ou via API autenticada.

## Perfis Instagram

| Perfil | Handle | URL | Relevância |
|---|---|---|---|
| Legendários Porto Velho | `@legendariosportovelho` | https://www.instagram.com/legendariosportovelho/ | **PRIMÁRIO** — perfil oficial do TOP 1270 em PVH |
| Legendários Brasil | `@legendariosbrasil` | https://www.instagram.com/legendariosbrasil/ | Conteúdo nacional do movimento |
| Rodoviária Porto Velho | `@rodoviariaportovelho` | https://www.instagram.com/rodoviariaportovelho/ | Posts do Terminal Destemidos Pioneiros |

## Posts identificados (alta prioridade)

| URL | Tipo | Conteúdo |
|---|---|---|
| https://www.instagram.com/reel/DPcDFmyDg39/ | Reel | "E assim concluímos o TOP 1270 — Destemidos Pioneiros…" — encerramento oficial |
| https://www.instagram.com/p/DAbFs5kuWFt/ | Post | 🌟 DESTEMIDOS PIONEIROS 🌟 — anúncio/branding |
| https://www.instagram.com/p/C-nuIUPRr5y/ | Post | Sesc Rondônia — Destemidos Pioneiros (parceria) |
| https://www.instagram.com/p/DE7Zz1FRbFs/ | Post | Novo Terminal Rodoviário Destemidos Pioneiros |
| https://www.instagram.com/rodoviariaportovelho/p/DGWU3Zjz03e/ | Post | Terminal — institucional |
| https://www.instagram.com/rodoviariaportovelho/reel/DGnqjHMRStW/ | Reel | Terminal — vídeo |

## YouTube

| URL | Conteúdo |
|---|---|
| https://www.youtube.com/watch?v=bua09j3l_98 | "Movimento Legendários desembarca em Porto Velho com tema Destemidos Pioneiros" |
| https://www.youtube.com/watch?v=YnCipoVNknQ | Ursula Malone — origem do nome "Destemidos Pioneiros" |
| https://www.youtube.com/@legendariosbrasil | Canal oficial — material institucional |

## Sites com mídia para mineração

| URL | Conteúdo |
|---|---|
| https://brayan.top/legendario/ | (mencionado pelo usuário — fetch bloqueado 403 deste container) |
| https://legendarios.org.br/ | Site oficial — imagens institucionais |
| https://legendariosbrasil.com.br/ | "Histórias dignas de serem contadas" |

## Quando habilitar download automatizado

Quando o usuário fornecer `INSTAGRAM_SESSION_ID` (cookie da sessão web), rodar:

```bash
INSTAGRAM_SESSION_ID="…" node scripts/collect-instagram.cjs @legendariosportovelho
```

Os arquivos cairão em `media/photos/` e `media/videos/` e este inventário será atualizado com paths locais.

## Checklist do que falta

- [ ] Fotos oficiais do TOP 1270 em campo (subida, cerimônias, formação)
- [ ] Logo / brasão oficial do Pioneiros Porto Velho (alta resolução)
- [ ] Manual de marca do Movimento Legendários (se disponível)
- [ ] Vídeos de depoimento de Legendários #1270
- [ ] Foto/render do Monumento Destemido Pioneiro (Bruno Souza) — licença a verificar
- [ ] Foto do Terminal Rodoviário Destemidos Pioneiros
- [ ] Trecho audiovisual oficial do Hino de Rondônia (verso "somos destemidos pioneiros")
