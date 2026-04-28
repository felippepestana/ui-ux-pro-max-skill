#!/bin/bash

# ============================================
# AUTO-MIGRATE - Migração Totalmente Automática
# UI/UX Pro Max para Hostinger VPS
# ============================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variáveis
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env"
TEMP_DIR="/tmp/ui-ux-migration-$$"

# ============================================
# Funções de Logging
# ============================================

print_banner() {
    clear
    cat << "EOF"

   ██╗   ██╗██╗██╗   ██╗██╗  ██╗    ██████╗ ██████╗  ██████╗
   ██║   ██║██║██║   ██║╚██╗██╔╝    ██╔══██╗██╔══██╗██╔═══██╗
   ██║   ██║██║██║   ██║ ╚███╔╝     ██████╔╝██████╔╝██║   ██║
   ██║   ██║██║██║   ██║ ██╔██╗     ██╔═══╝ ██╔══██╗██║   ██║
   ╚██████╔╝██║╚██████╔╝██╔╝ ██╗    ██║     ██║  ██║╚██████╔╝
    ╚═════╝ ╚═╝ ╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝

        MAX - MIGRAÇÃO AUTOMÁTICA PARA HOSTINGER VPS

EOF
}

log_step() {
    echo -e "\n${CYAN}▶${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_progress() {
    echo -ne "${YELLOW}...${NC} $1\r"
}

print_section() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

cleanup() {
    rm -rf "$TEMP_DIR" 2>/dev/null || true
}

trap cleanup EXIT

# ============================================
# Validações Iniciais
# ============================================

validate_prerequisites() {
    print_section "FASE 1: Validando Pré-requisitos"

    local errors=0

    # Verificar comandos necessários
    for cmd in git ssh ssh-keygen curl python3 scp; do
        if command -v "$cmd" &> /dev/null; then
            log_success "$(command -v $cmd | xargs basename)"
        else
            log_error "Falta: $cmd"
            errors=$((errors + 1))
        fi
    done

    if [ $errors -gt 0 ]; then
        log_error "Instale os comandos acima e tente novamente"
        return 1
    fi

    log_success "Todos os pré-requisitos atendidos"
}

# ============================================
# Coleta Automática de Dados
# ============================================

get_input() {
    local prompt="$1"
    local var_name="$2"
    local default="$3"

    if [ -z "${!var_name}" ]; then
        if [ -z "$default" ]; then
            read -p "$(echo -e ${YELLOW})$prompt$(echo -e ${NC}): " value
        else
            read -p "$(echo -e ${YELLOW})$prompt${NC} [$default]: " value
            value="${value:-$default}"
        fi
        eval "$var_name='$value'"
    fi
}

collect_info() {
    print_section "FASE 2: Coleta de Informações"

    # Usar variáveis de ambiente se disponíveis
    get_input "IP da VPS Hostinger" "VPS_IP"
    get_input "Usuário SSH da VPS" "VPS_USER"
    get_input "Seu domínio" "DOMAIN"

    # Validações básicas
    if [ -z "$VPS_IP" ] || [ -z "$VPS_USER" ] || [ -z "$DOMAIN" ]; then
        log_error "Informações incompletas"
        return 1
    fi

    # Gerar SECRET_KEY automaticamente
    log_info "Gerando SECRET_KEY segura..."
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    log_success "SECRET_KEY gerada"

    log_success "Informações coletadas:"
    log_success "  IP VPS: $VPS_IP"
    log_success "  Usuário: $VPS_USER"
    log_success "  Domínio: $DOMAIN"
}

# ============================================
# Configuração SSH
# ============================================

setup_ssh_keys() {
    print_section "FASE 3: Configuração SSH"

    mkdir -p ~/.ssh
    chmod 700 ~/.ssh

    if [ -f ~/.ssh/id_rsa ]; then
        log_success "Chave SSH já existe"
    else
        log_info "Gerando nova chave SSH..."
        ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -C "ui-ux-pro-max@hostinger" 2>/dev/null
        log_success "Chave SSH gerada"
    fi

    chmod 600 ~/.ssh/id_rsa
    log_success "Permissões SSH configuradas"
}

test_ssh() {
    print_section "FASE 4: Teste de Conexão SSH"

    log_progress "Testando conexão SSH..."

    if ssh -o ConnectTimeout=5 \
            -o BatchMode=yes \
            -o StrictHostKeyChecking=accept-new \
            "$VPS_USER@$VPS_IP" "echo 'OK'" &> /dev/null; then
        log_success "Conexão SSH funcionando"
        return 0
    else
        log_error "Falha na conexão SSH"
        log_error "Verifique:"
        log_error "  - IP: $VPS_IP"
        log_error "  - Usuário: $VPS_USER"
        log_error "  - Chave SSH adicionada ao painel Hostinger?"
        return 1
    fi
}

# ============================================
# Preparação do Ambiente
# ============================================

prepare_env_file() {
    print_section "FASE 5: Preparação de Variáveis de Ambiente"

    mkdir -p "$TEMP_DIR"

    # Copiar e atualizar .env
    if [ ! -f "$ENV_FILE" ]; then
        log_info "Criando .env de .env.example..."
        cp "$PROJECT_DIR/.env.example" "$ENV_FILE"
    fi

    # Atualizar valores no .env
    sed -i "s/^DOMAIN=.*/DOMAIN=$DOMAIN/" "$ENV_FILE"
    sed -i "s/^SECRET_KEY=.*/SECRET_KEY=$SECRET_KEY/" "$ENV_FILE"
    sed -i "s/^FLASK_ENV=.*/FLASK_ENV=production/" "$ENV_FILE"
    sed -i "s/^ALLOWED_ORIGINS=.*/ALLOWED_ORIGINS=https:\/\/$DOMAIN/" "$ENV_FILE"

    # Copiar para temp e depois para VPS
    cp "$ENV_FILE" "$TEMP_DIR/.env"

    log_success "Arquivo .env preparado"
    log_success "  DOMAIN: $DOMAIN"
    log_success "  FLASK_ENV: production"
}

# ============================================
# Transferência de Arquivos
# ============================================

transfer_files() {
    print_section "FASE 6: Transferência de Arquivos"

    log_progress "Copiando arquivo .env..."
    if scp -q "$TEMP_DIR/.env" "$VPS_USER@$VPS_IP:/tmp/.env.ui-ux"; then
        log_success "Arquivo .env transferido"
    else
        log_error "Falha ao transferir .env"
        return 1
    fi
}

# ============================================
# Execução de Deployment na VPS
# ============================================

run_vps_deployment() {
    print_section "FASE 7: Deployment na VPS"

    log_info "Executando deployment na VPS (isto pode levar ~15 minutos)..."
    echo ""

    # Script a ser executado na VPS
    cat > "$TEMP_DIR/deploy.sh" << 'REMOTE_SCRIPT'
#!/bin/bash
set -e

export DOMAIN="$1"

echo "=== Iniciando Deployment ==="
echo ""

# Função para logging
log_info() { echo "ℹ $1"; }
log_success() { echo "✓ $1"; }
log_error() { echo "✗ $1"; exit 1; }

# ========== PASSO 1: Sistema ==========
log_info "[1/6] Atualizando sistema..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq > /dev/null 2>&1
log_success "Sistema atualizado"

# ========== PASSO 2: Docker ==========
log_info "[2/6] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh > /dev/null 2>&1
    sudo usermod -aG docker $USER
    newgrp docker
fi
docker --version | grep -o "Docker version.*" || true
log_success "Docker instalado"

# ========== PASSO 3: Dependências ==========
log_info "[3/6] Instalando Git e Certbot..."
sudo apt-get install -y -qq git certbot > /dev/null 2>&1
log_success "Dependências instaladas"

# ========== PASSO 4: Repositório ==========
log_info "[4/6] Clonando repositório..."
cd /tmp
rm -rf ui-ux-pro-max 2>/dev/null || true
git clone https://github.com/felippepestana/ui-ux-pro-max-skill ui-ux-pro-max 2>/dev/null
cd ui-ux-pro-max
log_success "Repositório clonado"

# ========== PASSO 5: Configuração ==========
log_info "[5/6] Configurando arquivo .env..."
cp /tmp/.env.ui-ux .env
log_success "Arquivo .env configurado"

# ========== PASSO 6: Deploy Script ==========
log_info "[6/6] Executando script de deployment..."
chmod +x scripts/deploy.sh

# Executar deploy com domínio
sudo ./scripts/deploy.sh "$DOMAIN" 2>&1 | tee /tmp/deployment.log

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    log_success "Deployment completado com sucesso!"
    echo ""
    echo "=== PRÓXIMOS PASSOS ==="
    echo ""
    echo "1. Acesse: https://www.hostinger.com.br/painel"
    echo "2. Vá para: Domínios > Gerenciar Domínio > DNS"
    echo "3. Crie um Registro A:"
    echo "   Nome: @"
    echo "   Tipo: A"
    echo "   Valor: $(hostname -I | awk '{print $1}')"
    echo ""
    echo "4. Aguarde 5-30 minutos pela propagação DNS"
    echo "5. Teste: curl https://$DOMAIN/api/health"
    echo ""
else
    log_error "Deployment falhou"
fi
REMOTE_SCRIPT

    # Executar script na VPS
    chmod +x "$TEMP_DIR/deploy.sh"
    ssh -t "$VPS_USER@$VPS_IP" 'bash -s "$DOMAIN"' < "$TEMP_DIR/deploy.sh" "$DOMAIN"

    if [ $? -eq 0 ]; then
        log_success "Deployment executado com sucesso na VPS"
        return 0
    else
        log_error "Erro durante deployment"
        return 1
    fi
}

# ============================================
# Verificação Final
# ============================================

post_deployment() {
    print_section "FASE 8: Verificação Final"

    log_info "Obtendo informações da VPS..."

    # Obter IP da VPS para confirmação
    VPS_INTERNAL_IP=$(ssh "$VPS_USER@$VPS_IP" "hostname -I | awk '{print \$1}'" 2>/dev/null || echo "N/A")

    cat << EOF

${GREEN}╔════════════════════════════════════════════════════╗${NC}
${GREEN}║          DEPLOYMENT COMPLETADO COM SUCESSO!       ║${NC}
${GREEN}╚════════════════════════════════════════════════════╝${NC}

${CYAN}Informações da Sua Aplicação:${NC}

  🌐 Domínio: ${GREEN}https://$DOMAIN${NC}
  🖥️  VPS IP: ${GREEN}$VPS_IP${NC}
  👤 Usuário: ${GREEN}$VPS_USER${NC}
  📁 Diretório: ${GREEN}/opt/ui-ux-pro-max${NC}

${CYAN}Próximas Ações (IMPORTANTE):${NC}

  1️⃣  ${YELLOW}Configurar DNS (5 minutos)${NC}
     - Painel Hostinger → Domínios
     - Registros DNS → Criar Registro A
     - Nome: @
     - Tipo: A
     - Valor: $VPS_IP

  2️⃣  ${YELLOW}Aguardar Propagação (5-30 minutos)${NC}
     - Verifique: nslookup $DOMAIN

  3️⃣  ${YELLOW}Verificar Aplicação${NC}
     - Health: curl https://$DOMAIN/api/health
     - Frontend: https://$DOMAIN

${CYAN}Comandos Úteis na VPS:${NC}

  # Ver status
  ssh $VPS_USER@$VPS_IP "docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml ps"

  # Ver logs
  ssh $VPS_USER@$VPS_IP "docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs -f app"

  # Health check
  ssh $VPS_USER@$VPS_IP "/opt/ui-ux-pro-max/scripts/healthcheck.sh $DOMAIN"

${GREEN}Documentação:${NC}

  - Guia Completo: cat GUIA_MIGRACAO_HOSTINGER.md
  - Quick Start: cat HOSTINGER_SETUP.md
  - Deployment: cat DEPLOYMENT.md

${CYAN}Status do Arquivo .env:${NC}
  📄 Salvo em: $ENV_FILE
  🔐 Chave segura gerada e configurada
  ✓ Pronto para produção

${GREEN}═══════════════════════════════════════════════════════${NC}

  Parabéns! Sua aplicação está rodando em PRODUÇÃO!

${GREEN}═══════════════════════════════════════════════════════${NC}

EOF
}

# ============================================
# Tratamento de Erros
# ============================================

handle_error() {
    local line_no=$1
    log_error "Erro na linha $line_no"
    echo ""
    log_warn "Dicas para troubleshooting:"
    echo ""
    echo "1. Verifique a conexão SSH:"
    echo "   ssh $VPS_USER@$VPS_IP"
    echo ""
    echo "2. Verifique os logs da VPS:"
    echo "   ssh $VPS_USER@$VPS_IP \"docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs\""
    echo ""
    echo "3. Consulte o guia completo:"
    echo "   cat GUIA_MIGRACAO_HOSTINGER.md"
    echo ""
    exit 1
}

# ============================================
# Main
# ============================================

main() {
    print_banner

    # Configurar trap para erros
    trap 'handle_error $LINENO' ERR

    validate_prerequisites || exit 1
    collect_info || exit 1
    setup_ssh_keys || exit 1
    test_ssh || exit 1
    prepare_env_file || exit 1
    transfer_files || exit 1
    run_vps_deployment || exit 1
    post_deployment

    log_success "Migração completada com sucesso!"
}

# Executar
main "$@"
