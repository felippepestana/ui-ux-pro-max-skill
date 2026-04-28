#!/bin/bash

# ============================================
# Migration Helper - UI/UX Pro Max para Hostinger
# Script interativo para auxiliar na migração
# ============================================

set +e  # Não parar em erros

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variáveis
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VPS_IP=""
VPS_USER=""
DOMAIN=""
ENV_FILE="$PROJECT_DIR/.env"

# ============================================
# Funções
# ============================================

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Migration Helper - UI/UX Pro Max Editor   ║${NC}"
    echo -e "${BLUE}║     Para Hostinger VPS                      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"
}

print_section() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================
# Fase 1: Verificações Iniciais
# ============================================

check_prerequisites() {
    print_section "FASE 1: Verificações Iniciais"

    local all_good=true

    # Verificar Git
    if command -v git &> /dev/null; then
        log_success "Git instalado: $(git --version | cut -d' ' -f3)"
    else
        log_error "Git não instalado"
        all_good=false
    fi

    # Verificar arquivo .env
    if [ -f "$ENV_FILE" ]; then
        log_success "Arquivo .env encontrado"
    else
        log_error "Arquivo .env não encontrado"
        all_good=false
    fi

    # Verificar SSH
    if [ -f ~/.ssh/id_rsa ]; then
        log_success "Chave SSH privada encontrada"
    else
        log_warn "Chave SSH não encontrada - será criada na próxima fase"
    fi

    # Verificar curl
    if command -v curl &> /dev/null; then
        log_success "Curl instalado"
    else
        log_error "Curl não instalado"
        all_good=false
    fi

    if [ "$all_good" = true ]; then
        log_success "Todas as verificações passaram!"
        return 0
    else
        log_error "Algumas verificações falharam"
        return 1
    fi
}

# ============================================
# Fase 2: Configuração Local
# ============================================

setup_ssh() {
    print_section "FASE 2A: Configuração de Chave SSH"

    if [ ! -f ~/.ssh/id_rsa ]; then
        log_info "Gerando chave SSH..."
        mkdir -p ~/.ssh
        ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
        log_success "Chave SSH gerada em ~/.ssh/id_rsa"
    else
        log_success "Chave SSH já existe"
    fi

    echo -e "\n${BLUE}Sua chave pública SSH:${NC}"
    cat ~/.ssh/id_rsa.pub
    echo ""
    log_info "Copie a chave acima e adicione ao seu painel Hostinger (SSH Keys)"
}

setup_env() {
    print_section "FASE 2B: Configuração de Variáveis de Ambiente"

    if [ ! -f "$ENV_FILE" ]; then
        cp "$PROJECT_DIR/.env.example" "$ENV_FILE"
        log_success "Arquivo .env criado de .env.example"
    fi

    echo -e "${YELLOW}Valores encontrados em .env:${NC}\n"

    if grep -q "DOMAIN=" "$ENV_FILE"; then
        DOMAIN=$(grep "^DOMAIN=" "$ENV_FILE" | cut -d'=' -f2)
        log_success "DOMAIN=$DOMAIN"
    fi

    if grep -q "FLASK_ENV=" "$ENV_FILE"; then
        FLASK_ENV=$(grep "^FLASK_ENV=" "$ENV_FILE" | cut -d'=' -f2)
        log_success "FLASK_ENV=$FLASK_ENV"
    fi

    # Verificar SECRET_KEY
    if grep -q "SECRET_KEY=your-super-secret" "$ENV_FILE"; then
        log_warn "SECRET_KEY ainda tem valor padrão - precisa ser alterado!"
        echo -e "\n${YELLOW}Gerando SECRET_KEY segura...${NC}"
        NEW_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
        log_success "Nova SECRET_KEY gerada: $NEW_SECRET"
        log_info "Atualize manualmente em .env ou use: sed -i 's/your-super-secret.*/\$NEW_SECRET/g' .env"
    else
        log_success "SECRET_KEY configurada"
    fi
}

# ============================================
# Fase 3: Conectar à VPS
# ============================================

collect_vps_info() {
    print_section "FASE 3: Coleta de Informações da VPS"

    read -p "Digite o IP da sua VPS Hostinger (ex: 185.123.45.67): " VPS_IP
    if [ -z "$VPS_IP" ]; then
        log_error "IP da VPS não fornecido"
        return 1
    fi

    read -p "Digite o usuário SSH da VPS (ex: admin, root, ubuntu): " VPS_USER
    if [ -z "$VPS_USER" ]; then
        log_error "Usuário SSH não fornecido"
        return 1
    fi

    read -p "Digite seu domínio (ex: seu-dominio.com): " DOMAIN
    if [ -z "$DOMAIN" ]; then
        log_error "Domínio não fornecido"
        return 1
    fi

    log_success "Informações coletadas:"
    log_success "  IP VPS: $VPS_IP"
    log_success "  Usuário: $VPS_USER"
    log_success "  Domínio: $DOMAIN"
}

test_ssh_connection() {
    print_section "FASE 3B: Teste de Conexão SSH"

    log_info "Testando conexão SSH com $VPS_USER@$VPS_IP..."

    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=accept-new "$VPS_USER@$VPS_IP" "uname -a" &> /tmp/ssh_test.log; then
        log_success "Conexão SSH funcionando!"
        log_success "Sistema: $(cat /tmp/ssh_test.log | head -1)"
    else
        log_error "Falha na conexão SSH"
        log_error "Verifique:"
        log_error "  - IP está correto?"
        log_error "  - Usuário está correto?"
        log_error "  - Chave SSH foi adicionada ao painel Hostinger?"
        return 1
    fi
}

# ============================================
# Fase 4: Preparar Para Deployment
# ============================================

prepare_deployment() {
    print_section "FASE 4: Preparação para Deployment"

    log_info "Atualizando arquivo .env com domínio: $DOMAIN"

    # Atualizar domínio no .env
    if grep -q "^DOMAIN=" "$ENV_FILE"; then
        sed -i "s/^DOMAIN=.*/DOMAIN=$DOMAIN/" "$ENV_FILE"
    else
        echo "DOMAIN=$DOMAIN" >> "$ENV_FILE"
    fi

    log_success "Domínio atualizado em .env"

    # Copiar .env para VPS
    log_info "Copiando arquivo .env para VPS..."
    if scp -q "$ENV_FILE" "$VPS_USER@$VPS_IP:/tmp/ui-ux-pro-max.env"; then
        log_success "Arquivo .env copiado com sucesso"
    else
        log_error "Falha ao copiar arquivo .env"
        return 1
    fi
}

# ============================================
# Fase 5: Executar Deployment
# ============================================

run_deployment() {
    print_section "FASE 5: Executar Deployment na VPS"

    cat << 'EOF'
Agora vou executar os seguintes comandos na sua VPS:

1. Atualizar sistema
2. Instalar Docker
3. Instalar Git e Certbot
4. Clonar repositório
5. Copiar arquivo .env
6. Executar script de deployment automático

EOF

    read -p "Deseja continuar? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        log_warn "Deployment cancelado"
        return 1
    fi

    # Comando para executar na VPS
    cat > /tmp/deploy_steps.sh << DEPLOY_SCRIPT
#!/bin/bash
set -e

echo "========== Iniciando deployment =========="

# Passo 1: Atualizar sistema
echo "[1/5] Atualizando sistema..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# Passo 2: Instalar Docker
echo "[2/5] Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh > /dev/null 2>&1
sudo usermod -aG docker \$USER
newgrp docker

# Passo 3: Instalar dependências
echo "[3/5] Instalando Git e Certbot..."
sudo apt-get install -y -qq git certbot

# Passo 4: Clonar repositório
echo "[4/5] Clonando repositório..."
cd /tmp
git clone https://github.com/felippepestana/ui-ux-pro-max-skill ui-ux-pro-max 2>/dev/null || true
cd ui-ux-pro-max

# Passo 5: Copiar .env e executar deployment
echo "[5/5] Executando deployment..."
cp /tmp/ui-ux-pro-max.env .env
chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh $DOMAIN

echo "========== Deployment completado! =========="
DEPLOY_SCRIPT

    log_info "Executando deployment na VPS (isto pode levar ~10 minutos)..."
    ssh "$VPS_USER@$VPS_IP" 'bash -s' < /tmp/deploy_steps.sh

    if [ $? -eq 0 ]; then
        log_success "Deployment executado com sucesso!"
    else
        log_error "Erro durante deployment"
        return 1
    fi
}

# ============================================
# Fase 6: Configurar DNS
# ============================================

show_dns_instructions() {
    print_section "FASE 6: Configuração de DNS"

    cat << EOF
${YELLOW}Próximas etapas:${NC}

1. ${BLUE}Acesse o painel da Hostinger${NC}
   - URL: https://www.hostinger.com.br
   - Faça login com suas credenciais

2. ${BLUE}Vá para Domínios > Gerenciar Domínio${NC}

3. ${BLUE}Clique em "Gerenciador de DNS" ou "Registros DNS"${NC}

4. ${BLUE}Criar um Registro A:${NC}
   Nome:   @
   Tipo:   A
   Valor:  $VPS_IP
   TTL:    3600

5. ${BLUE}Salve as alterações${NC}

6. ${YELLOW}Aguarde 5-30 minutos para propagação DNS${NC}

${GREEN}Para verificar se DNS está propagado:${NC}
   nslookup $DOMAIN

${GREEN}Para testar aplicação (após DNS propagar):${NC}
   curl https://$DOMAIN/api/health

${BLUE}Abrir no navegador:${NC}
   https://$DOMAIN
EOF
}

# ============================================
# Menu Principal
# ============================================

show_menu() {
    print_header

    echo "O que você deseja fazer?"
    echo ""
    echo "1) Executar todo o processo de migration (recomendado)"
    echo "2) Fase 1 - Verificações Iniciais"
    echo "3) Fase 2 - Configuração Local (SSH + .env)"
    echo "4) Fase 3 - Conectar à VPS"
    echo "5) Fase 4 - Preparar Deployment"
    echo "6) Fase 5 - Executar Deployment"
    echo "7) Fase 6 - Instruções de DNS"
    echo "8) Ver guia completo (GUIA_MIGRACAO_HOSTINGER.md)"
    echo "9) Sair"
    echo ""
    read -p "Escolha uma opção (1-9): " -n 1 -r OPTION
    echo ""
}

# ============================================
# Main Loop
# ============================================

main() {
    while true; do
        show_menu

        case $OPTION in
            1)
                check_prerequisites && \
                setup_ssh && \
                setup_env && \
                collect_vps_info && \
                test_ssh_connection && \
                prepare_deployment && \
                run_deployment && \
                show_dns_instructions
                ;;
            2)
                check_prerequisites
                ;;
            3)
                setup_ssh
                setup_env
                ;;
            4)
                collect_vps_info && test_ssh_connection
                ;;
            5)
                collect_vps_info && prepare_deployment
                ;;
            6)
                collect_vps_info && run_deployment
                ;;
            7)
                read -p "Digite seu domínio: " DOMAIN
                show_dns_instructions
                ;;
            8)
                if command -v less &> /dev/null; then
                    less "$PROJECT_DIR/GUIA_MIGRACAO_HOSTINGER.md"
                else
                    cat "$PROJECT_DIR/GUIA_MIGRACAO_HOSTINGER.md"
                fi
                ;;
            9)
                log_success "Até logo!"
                exit 0
                ;;
            *)
                log_error "Opção inválida"
                ;;
        esac

        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar
main "$@"
