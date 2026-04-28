#!/bin/bash
set -e

# ============================================
# UI/UX Pro Max Editor - Deployment Script
# Para Hostinger VPS
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="${1:-}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="${APP_USER:-appuser}"
APP_HOME="/opt/ui-ux-pro-max"

# Funções
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar pré-requisitos
check_requirements() {
    echo -e "\n${YELLOW}Verificando pré-requisitos...${NC}\n"

    # Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker não está instalado"
        exit 1
    fi
    log_info "Docker encontrado: $(docker --version)"

    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose não está instalado"
        exit 1
    fi
    log_info "Docker Compose encontrado: $(docker-compose --version)"

    # Git
    if ! command -v git &> /dev/null; then
        log_error "Git não está instalado"
        exit 1
    fi
    log_info "Git encontrado: $(git --version)"

    # Curl
    if ! command -v curl &> /dev/null; then
        log_error "Curl não está instalado"
        exit 1
    fi
    log_info "Curl encontrado"
}

# Preparar diretórios
prepare_directories() {
    echo -e "\n${YELLOW}Preparando diretórios...${NC}\n"

    if [ ! -d "$APP_HOME" ]; then
        log_warn "Criando diretório $APP_HOME"
        sudo mkdir -p "$APP_HOME"
    fi

    sudo mkdir -p "$APP_HOME"/{logs,data,ssl}
    sudo chown -R $(whoami):$(whoami) "$APP_HOME"

    log_info "Diretórios preparados"
}

# Clonar/atualizar repositório
setup_repository() {
    echo -e "\n${YELLOW}Configurando repositório...${NC}\n"

    if [ ! -d "$APP_HOME/.git" ]; then
        log_warn "Clonando repositório..."
        # Se for o diretório local
        if [ "$PROJECT_DIR" != "$APP_HOME" ]; then
            cp -r "$PROJECT_DIR"/* "$APP_HOME/"
        fi
    else
        log_warn "Atualizando repositório..."
        cd "$APP_HOME"
        git pull origin main || log_warn "Não foi possível fazer pull"
    fi

    log_info "Repositório configurado"
}

# Configurar variáveis de ambiente
setup_environment() {
    echo -e "\n${YELLOW}Configurando variáveis de ambiente...${NC}\n"

    if [ ! -f "$APP_HOME/.env" ]; then
        log_warn "Criando arquivo .env"
        cp "$APP_HOME/.env.example" "$APP_HOME/.env"
        log_warn "Edite $APP_HOME/.env com seus valores"
        log_warn "Pressione Enter para continuar..."
        read
    else
        log_info ".env já existe"
    fi
}

# Build da imagem Docker
build_image() {
    echo -e "\n${YELLOW}Buildando imagem Docker...${NC}\n"

    cd "$APP_HOME"
    docker-compose build

    log_info "Imagem Docker buildada com sucesso"
}

# Configurar SSL
setup_ssl() {
    echo -e "\n${YELLOW}Configurando SSL...${NC}\n"

    if [ -z "$DOMAIN" ]; then
        log_warn "Nenhum domínio fornecido. Pulando SSL."
        log_warn "Após o deployment, configure SSL manualmente:"
        log_warn "  sudo certbot certonly --standalone -d seu-dominio.com"
        log_warn "  Copie os certificados para $APP_HOME/ssl/"
        return
    fi

    if [ -f "$APP_HOME/ssl/cert.pem" ] && [ -f "$APP_HOME/ssl/key.pem" ]; then
        log_info "Certificados SSL já existem"
        return
    fi

    log_warn "Obtendo certificado SSL para $DOMAIN..."

    # Stop Nginx if running to free port 80 for standalone mode
    cd "$APP_HOME"
    docker-compose stop nginx || true
    sleep 2

    if command -v certbot &> /dev/null; then
        sudo certbot certonly --standalone \
            -d "$DOMAIN" \
            --agree-tos \
            --no-eff-email \
            --email admin@"$DOMAIN"

        # Symlink certificados para garantir auto-renewal
        sudo ln -sf /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem "$APP_HOME/ssl/cert.pem"
        sudo ln -sf /etc/letsencrypt/live/"$DOMAIN"/privkey.pem "$APP_HOME/ssl/key.pem"
        sudo chown -h $(whoami):$(whoami) "$APP_HOME/ssl"/*

        log_info "Certificados SSL configurados"
    else
        log_error "Certbot não encontrado. Instale com: sudo apt-get install certbot"
    fi
}

# Iniciar containers
start_containers() {
    echo -e "\n${YELLOW}Iniciando containers...${NC}\n"

    cd "$APP_HOME"
    docker-compose up -d

    log_info "Containers iniciados"
}

# Health check
health_check() {
    echo -e "\n${YELLOW}Verificando saúde da aplicação...${NC}\n"

    for i in {1..30}; do
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            log_info "Aplicação está saudável"
            return 0
        fi
        echo -n "."
        sleep 1
    done

    log_error "Health check falhou após 30 segundos"
    return 1
}

# Configurar systemd
setup_systemd() {
    echo -e "\n${YELLOW}Configurando systemd auto-restart...${NC}\n"

    SYSTEMD_UNIT="ui-ux-pro-max.service"
    SYSTEMD_PATH="/etc/systemd/system/$SYSTEMD_UNIT"

    cat > /tmp/ui-ux-pro-max.service << 'EOF'
[Unit]
Description=UI/UX Pro Max Editor
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/ui-ux-pro-max
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo cp /tmp/ui-ux-pro-max.service "$SYSTEMD_PATH"
    sudo systemctl daemon-reload
    sudo systemctl enable "$SYSTEMD_UNIT"

    log_info "Systemd service configurado"
    log_info "Para iniciar: sudo systemctl start ui-ux-pro-max"
}

# Exibir informações finais
show_info() {
    echo -e "\n${GREEN}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ DEPLOYMENT CONCLUÍDO COM SUCESSO!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════${NC}\n"

    echo "📍 Localização: $APP_HOME"
    echo ""
    echo "🌐 URLs:"
    echo "   - Backend:  http://localhost:5000"
    echo "   - Frontend: http://localhost:3000 (em desenvolvimento)"
    echo "   - Domínio:  https://$DOMAIN (após DNS apontar)"
    echo ""
    echo "📋 Comandos úteis:"
    echo "   - Status:        docker-compose -f $APP_HOME/docker-compose.yml ps"
    echo "   - Logs:          docker-compose -f $APP_HOME/docker-compose.yml logs -f app"
    echo "   - Restart:       docker-compose -f $APP_HOME/docker-compose.yml restart"
    echo "   - Stop:          docker-compose -f $APP_HOME/docker-compose.yml down"
    echo ""
    echo "🔒 SSL/HTTPS:"
    echo "   - Certificados: $APP_HOME/ssl/"
    echo "   - Auto-renew (configure cron para certbot)"
    echo ""
    echo "📊 Monitoramento:"
    echo "   - Health check: curl https://$DOMAIN/health"
    echo "   - Logs: tail -f $APP_HOME/logs/*.log"
    echo ""
    echo "⚠️  Próximos passos:"
    echo "   1. Atualize os registros DNS para apontar para seu servidor"
    echo "   2. Edite $APP_HOME/.env com seus valores"
    echo "   3. Copie os certificados SSL (se necessário)"
    echo "   4. Reinicie: sudo systemctl restart ui-ux-pro-max"
    echo ""
}

# Main
main() {
    echo -e "${YELLOW}"
    echo "╔════════════════════════════════════════════╗"
    echo "║  UI/UX Pro Max Editor - Deployment Script  ║"
    echo "║        Para Hostinger VPS                   ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_requirements
    prepare_directories
    setup_repository
    setup_environment
    build_image
    setup_ssl
    start_containers

    if health_check; then
        setup_systemd
        show_info
    else
        log_error "Deployment falhou na verificação de saúde"
        log_error "Verifique os logs com: docker-compose logs"
        exit 1
    fi
}

# Executar
main "$@"
