#!/bin/bash
set -e

echo "🚀 UI/UX Pro Max Editor - Starting..."

# Configurações
WORKERS=${WORKERS:-4}
WORKER_CLASS=${WORKER_CLASS:-sync}
WORKER_TIMEOUT=${WORKER_TIMEOUT:-120}
PORT=${PORT:-5000}

echo "📊 Starting Gunicorn with:"
echo "   - Workers: $WORKERS"
echo "   - Worker class: $WORKER_CLASS"
echo "   - Port: $PORT"

# Iniciar Gunicorn com graceful shutdown
exec gunicorn \
    --workers=$WORKERS \
    --worker-class=$WORKER_CLASS \
    --worker-tmp-dir=/dev/shm \
    --timeout=$WORKER_TIMEOUT \
    --bind=0.0.0.0:$PORT \
    --access-logfile=- \
    --error-logfile=- \
    --log-level=info \
    --forwarded-allow-ips="*" \
    "src.ui_ux_pro_max.server:app"
