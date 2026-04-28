#!/bin/bash

# ============================================
# Health Check Script
# Monitora a saúde da aplicação
# ============================================

# Configurações
APP_HOME="/opt/ui-ux-pro-max"
LOG_FILE="$APP_HOME/logs/healthcheck.log"
DOMAIN="${1:-localhost}"
URL="https://$DOMAIN/api/health"
TIMEOUT=5
MAX_RETRIES=2

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Função de logging
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Health check
check_health() {
    log "Verificando saúde da aplicação..."

    for ((i=1; i<=MAX_RETRIES; i++)); do
        if curl -sf --max-time $TIMEOUT "$URL" > /dev/null 2>&1; then
            log "✓ Aplicação está saudável"
            return 0
        fi

        if [ $i -lt $MAX_RETRIES ]; then
            log "  Tentativa $i/$MAX_RETRIES falhou, aguardando..."
            sleep 2
        fi
    done

    log "✗ Aplicação falhou no health check"
    return 1
}

# Verificar espaço em disco
check_disk_space() {
    USAGE=$(df "$APP_HOME" | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$USAGE" -gt 90 ]; then
        log "⚠️  Aviso: Espaço em disco em 90% de uso ($USAGE%)"
        return 1
    fi

    log "✓ Espaço em disco OK ($USAGE% usado)"
    return 0
}

# Verificar memória
check_memory() {
    CONTAINER_ID=$(docker-compose -f "$APP_HOME/docker-compose.yml" ps -q app)

    if [ -z "$CONTAINER_ID" ]; then
        log "✗ Container não está rodando"
        return 1
    fi

    MEMORY=$(docker inspect --format='{{.State.Memory}}' "$CONTAINER_ID")
    MEMORY_MB=$((MEMORY / 1048576))

    if [ "$MEMORY_MB" -gt 1024 ]; then
        log "⚠️  Aviso: Uso de memória alto (${MEMORY_MB}MB)"
        return 1
    fi

    log "✓ Memória OK (${MEMORY_MB}MB usado)"
    return 0
}

# Verificar se container está rodando
check_container() {
    if docker-compose -f "$APP_HOME/docker-compose.yml" ps app | grep -q "Up"; then
        log "✓ Container está rodando"
        return 0
    else
        log "✗ Container não está rodando"
        return 1
    fi
}

# Main
main() {
    # Criar diretório de logs se não existir
    mkdir -p "$(dirname "$LOG_FILE")"

    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}UI/UX Pro Max - Health Check${NC}"
    echo -e "${YELLOW}$TIMESTAMP${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    # Executar checks
    FAILED=0

    check_container || FAILED=$((FAILED+1))
    check_health || FAILED=$((FAILED+1))
    check_disk_space || FAILED=$((FAILED+1))
    check_memory || FAILED=$((FAILED+1))

    # Resultado final
    echo ""
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ Todos os checks passaram${NC}"
        exit 0
    else
        echo -e "${RED}✗ $FAILED check(s) falharam${NC}"
        exit 1
    fi
}

# Executar
main "$@"
