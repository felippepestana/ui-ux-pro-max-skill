# 🎨 UI/UX Pro Max Visual Editor

Editor visual intuitivo e altamente produtivo para criar design systems profissionais com inteligência artificial.

## ✨ Características

- **Interface Intuitiva**: Sem necessidade de códigos complexos
- **Seleção Visual**: Escolha produtos, estilos e cores por clique
- **Preview em Tempo Real**: Veja as mudanças instantaneamente
- **161 Tipos de Produtos**: Desde SaaS até Web3
- **67 Estilos UI**: Glassmorphism, Neumorphism, Brutalism, e mais
- **161 Paletas de Cores**: Pré-curadas por indústria
- **57 Tipografias**: Com Google Fonts integradas
- **15+ Stacks**: React, Vue, Svelte, Flutter, SwiftUI, etc.
- **Dark Mode**: Interface em claro/escuro
- **Exportação**: JSON, CSS Variables, Tailwind Config

## 🚀 Inicialização Rápida

### Opção 1: Script Automático (Recomendado)

```bash
cd /home/user/ui-ux-pro-max-skill
./start-editor.sh
```

Isso inicia automaticamente:
- Backend Python na porta 5000
- Frontend React na porta 3000

### Opção 2: Manual

**Terminal 1 - Backend:**
```bash
cd src/ui-ux-pro-max
python3 server.py
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

## 🌐 Acesso

Abra seu navegador em: **http://localhost:3000**

## 📖 Como Usar

### 1. Selecione um Tipo de Produto
Clique em um dos 161 tipos disponíveis:
- SaaS, E-commerce, Healthcare, Banking, etc.
- Busque por tipo ou keywords
- O sistema mostra as recomendações automáticas

### 2. Escolha um Estilo UI
Explore os 67 estilos disponíveis:
- Glassmorphism, Neumorphism, Brutalism
- Filtros por era, complexidade, performance
- Preview de cada estilo

### 3. Selecione a Paleta de Cores
- 161 paletas pré-curadas por indústria
- Copie cores com 1 clique (hex)
- Valide contraste WCAG automaticamente
- Preview em modo claro/escuro

### 4. Escolha seu Stack Tecnológico
- React, Next.js, Vue, Svelte, etc.
- SwiftUI para iOS, Flutter para mobile
- HTML + Tailwind (padrão)

### 5. Gere o Design System
Clique em **"Gerar Design System"** para:
- Analisar todas as suas seleções
- Gerar recomendações inteligentes
- Criar uma paleta coesiva
- Produzir documentação completa

### 6. Visualize em Diferentes Viewports
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px+)

### 7. Exporte e Reutilize
Exporte em múltiplos formatos:
- **JSON**: Importar em ferramentas externas
- **CSS Variables**: Usar em qualquer projeto web
- **Tailwind Config**: Integrar com Tailwind CSS
- **JavaScript**: Para frameworks modernos

## 🎯 Fluxo de Trabalho Recomendado

```
1. Selecione Produto (SaaS? E-commerce?)
   ↓
2. Revise Estilo Recomendado (altere se necessário)
   ↓
3. Explore Paletas de Cores (copie cores que gosta)
   ↓
4. Escolha seu Stack (React, Vue, etc.)
   ↓
5. Gere Design System (análise automática)
   ↓
6. Visualize em múltiplos tamanhos
   ↓
7. Exporte para seu projeto (JSON, CSS, etc.)
```

## 🏗️ Arquitetura

### Backend (Python)
- **Flask**: HTTP server minimalista
- **CORS**: Suporte cross-origin para desenvolvimento
- **CSV em memória**: Performance otimizada
- **BM25 Search**: Busca híbrida inteligente

Endpoints principais:
```
GET  /api/products           → 161 tipos de produtos
GET  /api/styles             → 67 estilos UI
GET  /api/colors             → 161 paletas de cores
GET  /api/typography         → 57+ tipografias
GET  /api/stacks             → 15+ stacks
POST /api/design-system      → Gera design system completo
POST /api/export             → Exporta em múltiplos formatos
```

### Frontend (React + TypeScript)
- **Vite**: Build tool de próxima geração
- **React 18**: UI moderno
- **Zustand**: State management leve
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Icons minimalistas
- **TypeScript**: Type safety total

Componentes principais:
```
App.tsx
├── ProductSelector       (161 produtos)
├── StyleSelector         (67 estilos)
├── ColorPaletteSelector  (161 paletas)
├── StackSelector         (15+ stacks)
└── DesignSystemPreview   (Visualização)
```

## 🔧 Desenvolvimento

### Editar o Backend

1. Modifique `src/ui-ux-pro-max/server.py`
2. Mude para uma porta diferente: `python3 server.py` (porta 5000)
3. As mudanças aplicam automaticamente com hot-reload

### Editar o Frontend

1. Modifique arquivos em `web/src/`
2. O Vite aplicará hot-reload automático
3. Tipo-check: `npm run type-check`

### Adicionar Novos Dados

1. Edite os CSVs em `src/ui-ux-pro-max/data/`
2. Adicione linhas conforme o formato existente
3. Reinicie o servidor para recarregar os dados

## 📊 Dados Disponíveis

| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| `products.csv` | 161 | Tipos de produtos com recomendações |
| `styles.csv` | 67 | Estilos UI com 22 propriedades |
| `colors.csv` | 161 | Paletas de cores por indústria |
| `typography.csv` | 57 | Tipografias Google Fonts |
| `charts.csv` | 25 | Tipos de gráficos |
| `ux-guidelines.csv` | 99+ | Best practices UX |
| `landing.csv` | 8 | Padrões de landing pages |

## 🚀 Deploy em Produção

### Docker

```bash
docker build -t ui-ux-pro-max-editor .
docker run -p 5000:5000 ui-ux-pro-max-editor
```

### Railway / Render / Heroku

1. Buildado estático em `web/dist/`
2. Servidor Python serve ambos frontend e backend
3. Adicione arquivo `.env` para variáveis de ambiente

```
FLASK_ENV=production
FLASK_DEBUG=0
```

## 🐛 Troubleshooting

### Porta 3000 em uso?
```bash
npm run dev -- --port 3001
```

### Porta 5000 em uso?
Edite `server.py` e mude a última linha:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Frontend não carrega?
Certifique-se de que rodou `npm run build` em `web/`:
```bash
cd web && npm run build
```

### Backend retorna erro?
Verifique que Python 3.11+ está instalado:
```bash
python3 --version
pip list | grep flask
```

## 📚 Recursos

- **Documentação do Skill**: [CLAUDE.md](CLAUDE.md)
- **Skill Marketplace**: https://uupm.cc
- **GitHub**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Homepage**: https://uupm.cc

## 📝 Licença

MIT - Veja [LICENSE](LICENSE) para detalhes.

## 💡 Sugestões & Feedback

Encontrou um bug? Tem uma sugestão? Abra uma issue no GitHub!

---

**Desenvolvido com ❤️ para designers e desenvolvedores**
