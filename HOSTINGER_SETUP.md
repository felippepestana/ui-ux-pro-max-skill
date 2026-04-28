# 🚀 Guia Rápido - Publicar em Hostinger VPS

**Tempo estimado:** 30 minutos

---

## 📌 Resumo Rápido

```
Local (seu computador)
   ↓
Git push
   ↓
VPS Hostinger (Ubuntu 20.04+)
   ↓
./scripts/deploy.sh seu-dominio.com
   ↓
Aplicação rodando em https://seu-dominio.com
```

---

## ⚡ Passos Rápidos

### 1️⃣ Na VPS - Instalar Docker (5 min)

```bash
ssh seu-usuario@seu-ip

# Uma linha de comando para instalar Docker + Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER && newgrp docker

# Instalar Certbot (para SSL)
sudo apt-get install -y certbot
```

### 2️⃣ Na VPS - Clonar Projeto (2 min)

```bash
cd /opt
sudo git clone https://github.com/seu-usuario/ui-ux-pro-max-skill ui-ux-pro-max
cd ui-ux-pro-max
sudo chown -R $USER:$USER .
```

### 3️⃣ Na VPS - Configurar & Deploy (5 min)

```bash
# Copiar e editar variáveis
cp .env.example .env
nano .env  # Editar DOMAIN e SECRET_KEY

# Fazer deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh seu-dominio.com
```

### 4️⃣ No Hostinger - Apontar Domínio (2 min)

1. Painel → Domínios → Seu Domínio
2. DNS → Criar Registro A:
   ```
   Nome: @ (ou seu-dominio.com)
   Tipo: A
   Valor: SEU-IP-VPS
   ```
3. Aguarde 5-30 minutos pela propagação DNS

### 5️⃣ Verificar Funcionamento (1 min)

```bash
# Na VPS
curl https://seu-dominio.com/api/health

# Esperado:
# {"status": "ok"}
```

---

## 🎯 Checklist Pré-Deploy

- [ ] Domínio comprado na Hostinger
- [ ] VPS ativa com Ubuntu 20.04+
- [ ] Acesso SSH testado
- [ ] Docker instalado na VPS
- [ ] Git clone feito em `/opt/ui-ux-pro-max`
- [ ] `.env` configurado com seu domínio
- [ ] `scripts/deploy.sh` executável
- [ ] Firewall aberto para portas 80/443 (Hostinger faz automático)

---

## 📂 Arquivos de Deployment

| Arquivo | Propósito |
|---------|-----------|
| `Dockerfile` | Imagem Docker multi-stage (Node + Python) |
| `docker-compose.yml` | Orquestra Flask + Nginx |
| `docker-entrypoint.sh` | Inicia Gunicorn com workers |
| `.dockerignore` | Excludi arquivos desnecessários |
| `.env.example` | Variáveis de ambiente |
| `nginx/nginx.conf` | Configuração Nginx |
| `nginx/conf.d/app.conf` | Reverse proxy + SSL |
| `requirements.txt` | Dependências Python |
| `scripts/deploy.sh` | Deploy automático com SSL |
| `scripts/healthcheck.sh` | Monitoramento 24/7 |
| `systemd/ui-ux-pro-max.service` | Auto-restart em falhas |

---

## 🔒 Segurança Pré-Pronta

✅ SSL/HTTPS automático (Let's Encrypt)  
✅ Security headers (HSTS, X-Frame-Options, etc.)  
✅ Rate limiting básico  
✅ CORS configurado  
✅ Logging centralizado  
✅ Health checks automáticos  

---

## 📊 Arquitetura no Servidor

```
Hostinger VPS (seu-ip-vps)
│
├─ Nginx (porta 80/443)
│  ├─ Frontend React (estático)
│  └─ Proxy → Flask
│
└─ Flask Backend (porta 5000 interno)
   ├─ API endpoints
   ├─ Design system generator
   └─ CSV data (em memória)
```

---

## 📱 URLs Finais

- **Frontend:** `https://seu-dominio.com`
- **API:** `https://seu-dominio.com/api/`
- **Health:** `https://seu-dominio.com/api/health`
- **Logs:** SSH → `/opt/ui-ux-pro-max/logs/`

---

## 🆘 Problemas Comuns

### "conexão recusada" em https://seu-dominio.com
```bash
# Verifique DNS
nslookup seu-dominio.com
# Deve retornar seu IP da VPS

# Verifique containers
docker-compose ps
# Ambos (app e nginx) devem estar "Up"
```

### "certificado inválido"
```bash
# O script deploy.sh já obtém SSL automático
# Se não funcionar, tente manual:
sudo certbot certonly --standalone -d seu-dominio.com
sudo cp /etc/letsencrypt/live/seu-dominio.com/* ssl/
docker-compose restart nginx
```

### "application timeout"
```bash
# Aumente workers em .env
WORKERS=8

# Reinicie
docker-compose restart app
```

---

## 🚀 Deploy em Produção

### Antes de ir ao ar:

1. Teste localmente: `./start-editor.sh`
2. Build Docker localmente: `docker-compose build`
3. Substitua `seu-dominio.com` por seu domínio real
4. Gere SECRET_KEY segura: `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`
5. Execute deploy na VPS

### Pós-deploy:

1. ✅ Teste todas as funcionalidades
2. ✅ Configure monitoramento (cron healthcheck)
3. ✅ Faça backup regular
4. ✅ Documente customizações

---

## 📞 Suporte Rápido

**Documentação Completa:** `DEPLOYMENT.md`  
**GitHub:** github.com/felippepestana/ui-ux-pro-max-skill  
**Logs em tempo real:** `docker-compose logs -f app`  

---

## ✅ Pronto?

Seguiu todos os passos? Sua aplicação agora está no ar! 🎉

**Próximo:** Configure monitoramento e backups automatizados.

---

**Tempo total de setup:** ~30 minutos ⏱️
