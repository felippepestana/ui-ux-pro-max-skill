# Stage 1: Frontend Build (Node)
FROM node:18-alpine AS frontend-builder

WORKDIR /app/web

# Copiar package files
COPY web/package*.json ./

# Instalar dependências
RUN npm ci --prefer-offline --no-audit

# Copiar source
COPY web/src ./src
COPY web/index.html ./
COPY web/tsconfig.json ./
COPY web/tsconfig.node.json ./
COPY web/vite.config.ts ./
COPY web/tailwind.config.ts ./
COPY web/postcss.config.js ./

# Build
RUN npm run build

# Stage 2: Backend Runtime (Python)
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código Python
COPY src/ui-ux-pro-max ./src/ui-ux-pro-max

# Copiar frontend buildado do stage anterior
COPY --from=frontend-builder /app/web/dist ./web/dist

# Criar diretórios para logs
RUN mkdir -p /app/logs

# Definir variáveis de ambiente
ENV FLASK_APP=src/ui-ux-pro-max/server.py
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Expor porta
EXPOSE 5000

# Entry point
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
