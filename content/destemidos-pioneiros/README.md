# Conteúdo — TOP 1270 / DESTEMIDOS PIONEIROS

Kit editorial para o site do evento Legendários **TOP 1270 — Destemidos Pioneiros** (Porto Velho/RO, 2-5 de outubro de 2025).

## Estrutura

```
content/destemidos-pioneiros/
├── manifest.json          ← metadados do evento
├── copy/                  ← textos prontos para o site (Markdown)
│   ├── hero.md
│   ├── sobre-legendarios.md
│   ├── destemidos-pioneiros.md
│   ├── metodologia.md
│   ├── programacao.md
│   ├── inscricao.md
│   ├── faq.md
│   └── depoimentos.md
├── brand/                 ← identidade
│   ├── palette.json
│   ├── typography.json
│   └── tone-of-voice.md
├── media/                 ← fotos/vídeos (aguarda upload)
│   ├── _INVENTORY.md
│   ├── photos/
│   └── videos/
└── sources/               ← proveniência das informações
    ├── _PROVENIENCIA.md
    └── snippets/
```

## Para o site

O microsite em `web/src/sites/destemidos-pioneiros/` consome diretamente o `copy/` (mesma redação) e os `brand/` tokens. Alterações no Markdown DEVEM ser refletidas no TSX da página (ou rodar o utilitário de import quando habilitado).

## Estratégia de adaptação

Quando o conteúdo é genérico do Movimento Legendários (origem em Guatemala, primeiro TOP no Brasil em 2018, metodologia geral), terminamos a seção com uma **âncora regional**: hino de Rondônia ("somos destemidos pioneiros"), Estrada de Ferro Madeira-Mamoré, monumento Destemido Pioneiro, fundadores de Porto Velho. Isso costura o conteúdo global ao posicionamento específico do TOP 1270.

## Pendências de mídia

Aguardando credencial Instagram para baixar fotos/vídeos de `@legendariosportovelho` e perfis correlatos. Ver `media/_INVENTORY.md` para checklist.
