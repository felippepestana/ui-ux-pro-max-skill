#!/bin/bash
set -e

echo "🚀 Iniciando UI/UX Pro Max Visual Editor..."
echo ""

# Mudar para o diretório do projeto
cd "$(dirname "$0")"

# Iniciar o servidor Python em background
echo "📊 Iniciando servidor backend (Python)..."
cd src/ui-ux-pro-max
python3 server.py &
BACKEND_PID=$!

# Esperar o servidor iniciar
sleep 2

# Volta ao diretório raiz
cd ../..

# Iniciar o servidor de desenvolvimento frontend
echo "🎨 Iniciando servidor frontend (Vite)..."
cd web
npm run dev &
FRONTEND_PID=$!

# Função para limpar ao sair
cleanup() {
  echo ""
  echo "🛑 Encerrando servidores..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  echo "✓ Servidores encerrados"
}

# Registra a função cleanup para executar ao sair
trap cleanup EXIT

# Aguardar Ctrl+C
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ UI/UX Pro Max Editor está pronto!"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "📊 Backend:   http://localhost:5000"
echo "🌐 Editor:    http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Mantém os processos rodando
wait
