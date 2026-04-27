# 🚀 Guia de Início Rápido - UI/UX Pro Max Visual Editor

## Pré-requisitos Instalados ✅

- Python 3.11+
- Node.js 22+ / npm 10+
- Frontend buildado em `web/dist/`
- Todas as dependências instaladas

## 3 Formas de Iniciar

### Opção 1️⃣: Automática (Recomendada)

```bash
cd /home/user/ui-ux-pro-max-skill
./start-editor.sh
```

**Resultado:**
- Backend rodando em `http://localhost:5000`
- Frontend rodando em `http://localhost:3000`
- Abra seu navegador em `http://localhost:3000`

### Opção 2️⃣: Dois Terminais

**Terminal 1 - Backend:**
```bash
cd /home/user/ui-ux-pro-max-skill/src/ui-ux-pro-max
python3 server.py
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/ui-ux-pro-max-skill/web
npm run dev
```

### Opção 3️⃣: Docker (Para Produção)

```bash
cd /home/user/ui-ux-pro-max-skill
docker build -t ui-ux-editor .
docker run -p 5000:5000 -p 3000:3000 ui-ux-editor
```

---

## 🎯 Primeiro Uso - Fluxo de 5 Minutos

### 1. Abra o Editor (http://localhost:3000)

```
┌─────────────────────────────────────────────────┐
│ 🎨 UI/UX Pro Max Editor                     ☀️ 🔄 │
│ Design System Visual Editor                     │
├─────────────────────────────────────────────────┤
│  ⚙️ Configurações                               │
│  ┌──────────────────────────────────────────┐   │
│  │ 1. Tipo de Produto                       │   │
│  │ [Buscar produtos...]                     │   │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│  │ │ SaaS    │ │ Banking │ │ E-comm  │ ... │   │
│  │ └─────────┘ └─────────┘ └─────────┘     │   │
│  │                                          │   │
│  │ 2. Estilo UI                             │   │
│  │ [Buscar estilos...]                      │   │
│  │ ┌─────────┐ ┌─────────┐                  │   │
│  │ │Glassmor │ │Neumorph │ ...              │   │
│  │ └─────────┘ └─────────┘                  │   │
│  │                                          │   │
│  │ 3. Stack Tecnológico                     │   │
│  │ ⚛️ React  ▲ Next.js  💚 Vue  🔴 Svelte  │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  Paletas de Cores | Preview | Exportação       │
└─────────────────────────────────────────────────┘
```

### 2. Selecione um Produto (Clique)

Exemplo: **SaaS** → Aparecerá:
- Recomendação de estilo: "Glassmorphism + Flat Design"
- Considerações-chave da indústria

### 3. Escolha um Estilo

Exemplo: **Glassmorphism**
- Performance: ⚡ Bom
- Acessibilidade: ✓ WCAG AA
- Framework: Tailwind 9/10

### 4. Veja as Cores

Clique em uma paleta:
- 8 cores principais (Primária, Secundária, Acento, etc.)
- **Copie com 1 clique** (hex copiado para clipboard)
- Visualização em claro/escuro

### 5. Escolha o Stack

Exemplo: **React**
- Guias específicas para React
- Componentes exemplo

### 6. Gere o Design System

Clique em **"Gerar Design System"** → Mostra:
```
╔════════════════════════════════════════╗
║ DESIGN SYSTEM GERADO                   ║
╠════════════════════════════════════════╣
║ Paleta Visual Preview                  ║
║ ┌─────────────────────────────────┐    ║
║ │ [Botão Exemplo] [Card Exemplo]  │    ║
║ │ [##FF4D4D] [##4D94FF]             │    ║
║ └─────────────────────────────────┘    ║
║                                        ║
║ Viewport: [📱 Mobile] [📱 Tablet] [🖥️ Desktop] ║
║                                        ║
║ Exportar: [JSON] [CSS] [Tailwind]      ║
╚════════════════════════════════════════╝
```

### 7. Copie/Exporte

Escolha um formato:
- **JSON** - Importar em qualquer ferramenta
- **CSS Variables** - Use em qualquer projeto web
- **Tailwind** - Para projetos Tailwind CSS

---

## 📊 O Que Você Tem Acesso

### Dados Estruturados

| Recurso | Quantidade | Exemplo |
|---------|-----------|---------|
| Tipos de Produtos | 161 | SaaS, Fintech, Healthcare, E-commerce |
| Estilos UI | 67 | Glassmorphism, Neumorphism, Brutalism |
| Paletas de Cores | 161 | Cores curadas por indústria |
| Tipografias | 57 | Google Fonts pairings |
| Stacks | 15+ | React, Vue, Svelte, Flutter, SwiftUI |

### Recursos Inteligentes

✅ **Busca Híbrida BM25** - Encontra o que você procura em milissegundos  
✅ **Detecção Automática** - Identifica tipo de produto da sua query  
✅ **Validação WCAG** - Contraste de cores verificado automaticamente  
✅ **Dark Mode** - Interface em claro/escuro  
✅ **Preview Responsivo** - Mobile, Tablet, Desktop

---

## 🔌 Endpoints da API

Se você quiser usar a API direto (sem UI):

```bash
# Obter todos os produtos
curl http://localhost:5000/api/products | jq .

# Buscar estilo
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "glassmorphism", "domain": "style"}'

# Gerar design system
curl -X POST http://localhost:5000/api/design-system \
  -H "Content-Type: application/json" \
  -d '{"product_name": "MyApp", "product_type": "SaaS"}'

# Exportar em diferentes formatos
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{"design_system": {...}, "format": "css"}'
```

---

## 🎨 Exemplo Completo em 1 Minuto

```bash
# 1. Abra em duas abas (ou use split screen)
# Aba 1: http://localhost:3000

# 2. Clique em "SaaS" na lista de produtos
# ✓ Sistema recomenda "Glassmorphism + Flat Design"

# 3. Clique em "Glassmorphism" nos estilos
# ✓ Vê detalhes: Performance: Excelente

# 4. Clique em uma paleta de cores (ex: azul tech)
# ✓ Vê as 8 cores e copia o hex com 1 clique

# 5. Selecione "React" como stack

# 6. Clique "Gerar Design System"
# ✓ Aparece preview com cores e componentes

# 7. Clique "Exportar" → JSON
# ✓ Configuração pronta para usar!
```

---

## ⌨️ Dicas & Atalhos

### Dentro do Editor

- **🔍 Busca**: Comece a digitar em qualquer seletor para filtrar
- **📋 Copiar**: Clique na cor para copiar hex para clipboard
- **🌙 Dark Mode**: Clique ícone da lua no topo direito
- **🔄 Reset**: Clique seta no topo direito para começar de novo

### Terminal

```bash
# Ver os dados em tempo real
cat src/ui-ux-pro-max/data/products.csv | head

# Testar busca Python direto
python3 -c "from scripts.core import search; print(search('SaaS'))"

# Monitorar logs
tail -f server.log
```

---

## 🚨 Troubleshooting Comum

| Problema | Solução |
|----------|---------|
| Porta 3000 ocupada | `npm run dev -- --port 3001` |
| Porta 5000 ocupada | Edite `server.py` line final, mude port |
| "Cannot GET /" | Rode `npm run build` em `web/` |
| Cores não aparecem | Verifique `web/dist/` existe |
| Busca lenta | Reinicie o servidor (cache será recarregado) |

---

## 📚 Próximos Passos

1. ✅ **Use o editor** para gerar um design system
2. ✅ **Exporte para seu projeto** (JSON/CSS/Tailwind)
3. ✅ **Customize as cores** clicando em cada uma
4. ✅ **Veja em diferentes telas** (Mobile/Tablet/Desktop)
5. ✅ **Compartilhe** o design system gerado com seu time

---

## 📞 Suporte

- 📖 **Documentação Completa**: [EDITOR_README.md](EDITOR_README.md)
- 🐛 **Reportar Bug**: Abra issue no GitHub
- 💬 **Feedback**: Comente com sugestões

---

**Pronto para começar?** 🚀

```bash
./start-editor.sh
```

Após iniciar, abra: **http://localhost:3000**

Bom divertimento! 🎨✨
