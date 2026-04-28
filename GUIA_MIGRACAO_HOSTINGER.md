# 🚀 Guia Completo de Migração para Hostinger VPS

**Data:** 2026-04-28  
**Aplicação:** UI/UX Pro Max Editor  
**Tempo Total:** ~45-60 minutos (incluindo propagação DNS)

---

## 📋 Sumário Executivo

Este guia cobre a migração completa da aplicação UI/UX Pro Max para uma VPS Hostinger em 5 fases principais:

1. **Preparação Local** (5 min) - Chaves SSH e configuração
2. **Acesso à VPS** (2 min) - Conectar via SSH
3. **Instalação de Dependências** (10 min) - Docker, Git, Certbot
4. **Deployment Automático** (10 min) - Executar script de deploy
5. **Configuração DNS + Verificação** (5-30 min) - DNS + testes

---

## 📌 Pré-requisitos

✅ **Antes de começar, você precisa ter:**

- [ ] Uma VPS ativa na Hostinger (Ubuntu 20.04 ou superior)
- [ ] Um domínio registrado na Hostinger
- [ ] O IP da sua VPS (ex: 185.123.45.67)
- [ ] Acesso ao painel de controle da Hostinger
- [ ] Seu usuário SSH e senha (ou chave privada)
- [ ] Este repositório clonado localmente: `git clone https://github.com/felippepestana/ui-ux-pro-max-skill`

---

## FASE 1️⃣: Preparação Local (5 min)

### Passo 1.1: Gerar Chave SSH (se não tiver)

```bash
# Verificar se você já tem uma chave SSH
ls -la ~/.ssh/id_rsa

# Se NÃO tiver, criar uma nova:
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
```

**Resultado esperado:** Uma chave em `~/.ssh/id_rsa` (privada) e `~/.ssh/id_rsa.pub` (pública)

---

### Passo 1.2: Configurar Variáveis de Ambiente

```bash
# 1. Copiar arquivo de exemplo
cp .env.example .env

# 2. Editar com seus dados
nano .env
```

**Valores a preencher:**

```env
# Substitua pelos SEUS valores reais:
DOMAIN=seu-dominio.com                    # Ex: meuapp.com.br
SECRET_KEY=gerar-chave-segura             # Ver próximo passo

# Outros (deixar como padrão ou ajustar conforme necessário):
FLASK_ENV=production
WORKERS=4
WORKER_TIMEOUT=120
```

**Gerar uma SECRET_KEY segura:**

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copie a saída (ex: `dN7x-K_9pL2qR8vM3jX5yZ...`) e cole em `SECRET_KEY=`

---

### Passo 1.3: Verificar Arquivo .env

```bash
# Ver conteúdo do arquivo (SEM exibir a chave completa)
cat .env | grep -E "DOMAIN|FLASK_ENV" 

# Resultado esperado:
# DOMAIN=seu-dominio.com
# FLASK_ENV=production
```

✅ **Fase 1 Completa!** Você tem as chaves SSH e variáveis de ambiente prontas.

---

## FASE 2️⃣: Acesso à VPS (2 min)

### Passo 2.1: Conectar via SSH

```bash
# Substituir:
# - seu-usuario = seu usuário da VPS (ex: admin, root)
# - seu-ip-vps = IP da sua VPS (ex: 185.123.45.67)

ssh seu-usuario@seu-ip-vps

# Exemplo real:
# ssh admin@185.123.45.67
```

**Se pedido senha:** Digite a senha do seu usuário SSH da Hostinger

**Resultado esperado:**
```
Welcome to Ubuntu 20.04 LTS
seu-usuario@seu-vps:~$
```

### Passo 2.2: Verificar Conexão

```bash
# Dentro da VPS, executar:
uname -a
df -h /

# Resultado esperado:
# Linux seu-vps 5.x.x-xxx-generic ...
# /dev/sdaX  50G  2G  48G  4% /
```

✅ **Fase 2 Completa!** Você está conectado à VPS.

---

## FASE 3️⃣: Instalação de Dependências (10 min)

### Passo 3.1: Atualizar Sistema

```bash
# Na VPS, executar:
sudo apt-get update && sudo apt-get upgrade -y
```

**Tempo:** ~2-3 minutos

---

### Passo 3.2: Instalar Docker

```bash
# Executar na VPS:
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

# Adicionar usuário ao grupo docker:
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação:
docker --version
docker-compose --version
```

**Resultado esperado:**
```
Docker version 20.10.x, build xxxxx
Docker Compose version 2.x.x
```

---

### Passo 3.3: Instalar Git e Certbot

```bash
# Na VPS, executar:
sudo apt-get install -y git certbot

# Verificar:
git --version
certbot --version
```

**Resultado esperado:**
```
git version 2.x.x
certbot 1.x.x
```

✅ **Fase 3 Completa!** Docker, Git e Certbot estão instalados.

---

## FASE 4️⃣: Deployment Automático (10 min)

### Passo 4.1: Clonar Repositório

```bash
# Na VPS, executar:
cd /tmp

# Clone o repositório
git clone https://github.com/felippepestana/ui-ux-pro-max-skill ui-ux-pro-max
cd ui-ux-pro-max

# Listar arquivos para verificar:
ls -la scripts/deploy.sh
```

**Resultado esperado:**
```
-rwxr-xr-x 1 seu-usuario seu-usuario 15000 Apr 28 10:00 scripts/deploy.sh
```

---

### Passo 4.2: Copiar Arquivo .env

```bash
# NA SUA MÁQUINA LOCAL (não na VPS):
# Copiar o arquivo .env que você editou para a VPS

# Usando SCP (Substitua seus valores):
scp .env seu-usuario@seu-ip-vps:/tmp/ui-ux-pro-max/

# Exemplo:
# scp .env admin@185.123.45.67:/tmp/ui-ux-pro-max/
```

**Verificar na VPS:**
```bash
cat /tmp/ui-ux-pro-max/.env | head -10
```

---

### Passo 4.3: Executar Script de Deployment

```bash
# De volta NA VPS, no diretório do repositório:
cd /tmp/ui-ux-pro-max

# Dar permissão de execução ao script:
chmod +x scripts/deploy.sh

# Executar o deployment (SUBSTITUA seu domínio):
sudo ./scripts/deploy.sh seu-dominio.com

# Exemplo:
# sudo ./scripts/deploy.sh meuapp.com.br
```

**O script fará automaticamente:**
- ✓ Verificar pré-requisitos (Docker, Git, Curl)
- ✓ Criar diretórios em `/opt/ui-ux-pro-max`
- ✓ Copiar arquivos do repositório
- ✓ Construir imagem Docker
- ✓ Obter certificado SSL via Certbot
- ✓ Iniciar containers (App + Nginx)
- ✓ Executar health checks
- ✓ Configurar systemd auto-restart

**Resultado esperado (ao final):**
```
════════════════════════════════════════════
✓ DEPLOYMENT CONCLUÍDO COM SUCESSO!
════════════════════════════════════════════

📍 Localização: /opt/ui-ux-pro-max
🌐 URLs:
   - Backend:  http://localhost:5000
   - Domínio:  https://seu-dominio.com (após DNS apontar)

📊 Monitoramento:
   - Health check: curl https://seu-dominio.com/api/health
   - Logs: tail -f /opt/ui-ux-pro-max/logs/*.log
```

✅ **Fase 4 Completa!** Aplicação está rodando na VPS.

---

## FASE 5️⃣: Configuração DNS + Verificação (5-30 min)

### Passo 5.1: Configurar DNS no Painel Hostinger

**1. Acesse o painel da Hostinger:**
- Vá para https://www.hostinger.com.br (ou seu país)
- Faça login com suas credenciais
- Clique em "Domínios" ou "Gerenciar Domínios"

**2. Selecione seu domínio**

**3. Vá para "Gerenciador de DNS" ou "Registros DNS"**

**4. Criar um Registro A:**
```
Nome:     @  (ou seu-dominio.com)
Tipo:     A
Valor:    SEU-IP-VPS  (ex: 185.123.45.67)
TTL:      3600
```

**5. Opcional - Para www:**
```
Nome:     www
Tipo:     CNAME
Valor:    seu-dominio.com
TTL:      3600
```

**6. Salvar alterações**

---

### Passo 5.2: Aguardar Propagação DNS

```bash
# Verificar propagação DNS (fazer múltiplas vezes):
nslookup seu-dominio.com

# Resultado esperado (depois de 5-30 minutos):
# Server:  8.8.8.8
# Address: 8.8.8.8#53
#
# Non-authoritative answer:
# Name:   seu-dominio.com
# Address: 185.123.45.67  ← SEU IP VPS
```

**Se ainda não funcionar:**
- Aguarde 10-15 minutos e tente novamente
- Limpe o cache DNS: `sudo systemd-resolve --flush-caches` (Linux)
- Use outro DNS: `dig seu-dominio.com @1.1.1.1` (Cloudflare)

---

### Passo 5.3: Verificar se Aplicação Está Rodando

**Na sua máquina local:**

```bash
# Teste 1: Health check da API
curl https://seu-dominio.com/api/health

# Resultado esperado:
# {"status": "ok"}

# Teste 2: Acessar frontend
# Abra no navegador: https://seu-dominio.com
```

**Na VPS (se não funcionar externamente):**

```bash
# Verifique containers:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml ps

# Resultado esperado:
# NAME                    STATUS
# ui-ux-pro-max-app       Up 2 minutes
# ui-ux-pro-max-nginx     Up 2 minutes

# Verifique logs:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs app
```

✅ **Fase 5 Completa!** Aplicação está acessível via domínio.

---

## 🆘 Troubleshooting

### Problema: "Connection refused"

```bash
# 1. Verificar DNS
nslookup seu-dominio.com

# 2. Se DNS não aponta para seu IP:
# - Aguarde mais tempo (até 24 horas)
# - Verifique configuração DNS no painel Hostinger

# 3. Se DNS está correto, verificar containers:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml ps

# 4. Se containers não estão "Up":
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs
```

---

### Problema: "Certificate error" ou "SSL_ERROR_BAD_CERT"

```bash
# 1. Verificar se certificados existem:
ls -la /opt/ui-ux-pro-max/ssl/

# 2. Se não existem, executar manualmente:
sudo certbot certonly --standalone -d seu-dominio.com

# 3. Copiar certificados:
sudo ln -sf /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /opt/ui-ux-pro-max/ssl/cert.pem
sudo ln -sf /etc/letsencrypt/live/seu-dominio.com/privkey.pem /opt/ui-ux-pro-max/ssl/key.pem

# 4. Reiniciar Nginx:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml restart nginx
```

---

### Problema: "Port 80 or 443 already in use"

```bash
# 1. Encontrar processo usando a porta:
sudo lsof -i :80
sudo lsof -i :443

# 2. Se for Nginx/Apache antigo:
sudo systemctl stop nginx
sudo systemctl stop apache2

# 3. Tentar deployment novamente
```

---

## ✅ Checklist Final de Deployment

- [ ] VPS ativa na Hostinger
- [ ] Domínio registrado
- [ ] SSH configurado e testado
- [ ] .env preenchido corretamente
- [ ] Docker instalado na VPS
- [ ] Script de deployment executado com sucesso
- [ ] Certificado SSL obtido
- [ ] DNS apontando para IP da VPS
- [ ] Health check respondendo ✓
- [ ] Frontend acessível via navegador ✓
- [ ] Aplicação em produção! 🎉

---

## 📞 Próximos Passos (Pós-Deployment)

### 1. Configurar Monitoramento 24/7

```bash
# Adicionar health check automático a cada 5 minutos:
crontab -e

# Adicionar a linha:
*/5 * * * * /opt/ui-ux-pro-max/scripts/healthcheck.sh seu-dominio.com >> /opt/ui-ux-pro-max/logs/cron-healthcheck.log 2>&1
```

### 2. Configurar Auto-Renovação de SSL

```bash
# Verificar se certbot timer está ativo:
sudo systemctl status certbot.timer

# Se não estiver ativo:
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Testar renovação (dry-run):
sudo certbot renew --dry-run
```

### 3. Fazer Backup Regular

```bash
# Backup manual:
sudo tar -czf /opt/ui-ux-pro-max/backups/app-$(date +%Y%m%d).tar.gz /opt/ui-ux-pro-max

# Adicionar a crontab para fazer backup diário às 2 da manhã:
0 2 * * * tar -czf /opt/ui-ux-pro-max/backups/app-$(date +\%Y\%m\%d).tar.gz /opt/ui-ux-pro-max
```

### 4. Configurar Firewall

```bash
# Instalar UFW:
sudo apt-get install -y ufw

# Permitir SSH, HTTP, HTTPS:
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall:
sudo ufw enable

# Verificar:
sudo ufw status
```

---

## 📊 Comandos Úteis Pós-Deployment

```bash
# Ver status dos containers:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml ps

# Ver logs da aplicação:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs -f app

# Ver logs do Nginx:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml logs -f nginx

# Reiniciar aplicação:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml restart

# Parar aplicação:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml down

# Iniciar aplicação:
docker-compose -f /opt/ui-ux-pro-max/docker-compose.yml up -d

# Health check manual:
curl https://seu-dominio.com/api/health
```

---

## 🎉 Parabéns!

Sua aplicação UI/UX Pro Max está agora rodando em produção na Hostinger VPS!

**Resumo do que foi feito:**
- ✅ Aplicação React + Flask containerizada
- ✅ Nginx como reverse proxy com SSL
- ✅ Let's Encrypt com auto-renewal
- ✅ Health checks automáticos
- ✅ Systemd auto-restart
- ✅ Logging centralizado
- ✅ Performance otimizada

**Acesse sua aplicação em:** `https://seu-dominio.com`

---

**Dúvidas ou problemas?** Consulte:
- `DEPLOYMENT.md` - Guia detalhado
- `HOSTINGER_SETUP.md` - Quick start
- `DEPLOYMENT_CHECKLIST.md` - Verificação de prontidão

Boa sorte! 🚀
