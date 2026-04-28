# 🚀 Guia de Deployment - Hostinger VPS

Publicar o UI/UX Pro Max Editor em uma VPS Hostinger com Docker.

---

## 📋 Pré-requisitos

### No seu computador local
- [ ] Git instalado
- [ ] Acesso SSH à VPS Hostinger

### Na VPS Hostinger
- [ ] Ubuntu 20.04 LTS ou superior
- [ ] SSH access com permissões sudo
- [ ] Domínio apontado (ou pronto para apontar)

---

## 🔧 Instalação de Dependências na VPS

### 1️⃣ Conectar via SSH

```bash
ssh seu-usuario@seu-ip-vps.hostinger.com
```

### 2️⃣ Atualizar o sistema

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 3️⃣ Instalar Docker

```bash
# Instalar dependências
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar repositório Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker-compose --version
```

### 4️⃣ Instalar Git

```bash
sudo apt-get install -y git
```

### 5️⃣ Instalar Certbot (para SSL)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 📦 Fazer Deploy da Aplicação

### 1️⃣ Clonar o repositório

```bash
sudo mkdir -p /opt/ui-ux-pro-max
cd /opt/ui-ux-pro-max

# Se tiver repositório Git
sudo git clone https://github.com/seu-usuario/ui-ux-pro-max-skill .

# Ou copiar arquivos via SCP
# scp -r ./ui-ux-pro-max-skill seu-usuario@seu-vps:/opt/
```

### 2️⃣ Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com seus valores
nano .env
```

**Valores importantes:**
```env
FLASK_ENV=production
FLASK_DEBUG=false
DOMAIN=seu-dominio.com
SECRET_KEY=gere-uma-chave-segura-aqui
```

**Gerar uma chave segura:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3️⃣ Executar script de deploy

```bash
chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh seu-dominio.com
```

O script irá:
- ✅ Verificar pré-requisitos
- ✅ Preparar diretórios
- ✅ Buildear imagem Docker
- ✅ Obter certificado SSL (Let's Encrypt)
- ✅ Iniciar containers
- ✅ Configurar systemd auto-restart
- ✅ Exibir informações finais

---

## 🌐 Configurar Domínio

### Na Hostinger - DNS/Domínios

1. Painel Hostinger → Gerenciar Domínios
2. Selecione seu domínio
3. Vá para "Gerenciador de DNS" ou "Registros DNS"
4. Crie um registro A:
   ```
   Nome: @ (ou seu-dominio.com)
   Tipo: A
   Valor: seu-ip-vps
   TTL: 3600
   ```
5. Se quiser www:
   ```
   Nome: www
   Tipo: CNAME
   Valor: seu-dominio.com
   ```

**Aguarde propagação DNS (até 24 horas)**

---

## 🔒 Certificado SSL

### Automático (durante deploy)

O script `deploy.sh seu-dominio.com` já obtém o certificado automaticamente via Certbot.

### Manual (se necessário)

```bash
# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar para local do Nginx
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /opt/ui-ux-pro-max/ssl/cert.pem
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem /opt/ui-ux-pro-max/ssl/key.pem

# Reiniciar
sudo systemctl restart ui-ux-pro-max
```

### Auto-renovação (Certbot)

```bash
# Testar renovação
sudo certbot renew --dry-run

# Verificar se cron está ativo
sudo systemctl status certbot.timer
```

---

## ✅ Verificar Status

### Health Check Rápido

```bash
curl https://seu-dominio.com/api/health
```

Resposta esperada:
```json
{"status": "ok"}
```

### Verificar Containers

```bash
cd /opt/ui-ux-pro-max
docker-compose ps

# Resultado esperado:
# NAME                COMMAND             STATUS
# ui-ux-pro-max-app   ./docker-entrypoint.sh   Up
# ui-ux-pro-max-nginx /docker-entrypoint.sh   Up
```

### Ver Logs

```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do Nginx
docker-compose logs -f nginx

# Ou via journalctl
sudo journalctl -u ui-ux-pro-max.service -f
```

---

## 🔄 Atualizar a Aplicação

### Método 1: Git Pull

```bash
cd /opt/ui-ux-pro-max

# Pull das atualizações
git pull origin main

# Rebuild
docker-compose build

# Restart
docker-compose up -d
```

### Método 2: Script (se disponível)

```bash
./scripts/update.sh
```

---

## 📊 Monitoramento Contínuo

### Executar Health Check Manualmente

```bash
cd /opt/ui-ux-pro-max
bash scripts/healthcheck.sh seu-dominio.com
```

### Adicionar à Crontab

```bash
# Editar cron
crontab -e

# Adicionar linha (verifica a cada 5 minutos)
*/5 * * * * /opt/ui-ux-pro-max/scripts/healthcheck.sh seu-dominio.com >> /opt/ui-ux-pro-max/logs/cron-healthcheck.log 2>&1
```

---

## 🆘 Troubleshooting

### Problema: Certificado SSL não funciona

**Solução:**
```bash
# Verificar se arquivo existe
ls -la /opt/ui-ux-pro-max/ssl/

# Se não existir, obter novo
sudo certbot certonly --standalone -d seu-dominio.com
sudo cp /etc/letsencrypt/live/seu-dominio.com/* /opt/ui-ux-pro-max/ssl/

# Restart
docker-compose restart nginx
```

### Problema: Port 80 ou 443 em uso

**Solução:**
```bash
# Encontrar processo usando porta
sudo lsof -i :80
sudo lsof -i :443

# Parar serviço
sudo systemctl stop nginx  # Se estiver rodando fora de Docker
sudo systemctl stop apache2  # Se for Apache
```

### Problema: Containers não iniciam

**Solução:**
```bash
# Ver logs detalhados
docker-compose logs

# Rebuild
docker-compose build --no-cache

# Restart
docker-compose down
docker-compose up -d
```

### Problema: "Cannot connect to Docker daemon"

**Solução:**
```bash
# Iniciar Docker
sudo systemctl start docker

# Adicionar usuário ao grupo docker (se necessário)
sudo usermod -aG docker $USER
newgrp docker
```

### Problema: DNS ainda não aponta

**Solução:**
```bash
# Verificar propagação DNS
nslookup seu-dominio.com
dig seu-dominio.com

# Aguarde até 24 horas, ou teste antes com IP:
curl https://seu-ip-vps/api/health
```

---

## 🔐 Segurança Básica

### 1️⃣ Firewall

```bash
# Instalar UFW
sudo apt-get install -y ufw

# Permitir SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar
sudo ufw enable
```

### 2️⃣ SSH Security

```bash
# Editar SSH config
sudo nano /etc/ssh/sshd_config

# Adicionar/modificar:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart ssh
```

### 3️⃣ Logs Regulares

```bash
# Monitorar tentativas de acesso
sudo tail -f /var/log/auth.log

# Monitorar aplicação
docker-compose logs -f app
```

---

## 📈 Performance Tuning

### Aumentar Workers (se necessário)

```bash
# Editar .env
WORKERS=8  # Aumentar conforme CPU cores disponíveis

# Aplicar
docker-compose restart app
```

### Monitorar Recursos

```bash
# Ver uso de CPU/memória dos containers
docker stats

# Ver espaço em disco
df -h /opt/ui-ux-pro-max
```

---

## 📱 Acessar a Aplicação

### URLs

- **Frontend:** https://seu-dominio.com
- **API:** https://seu-dominio.com/api/
- **Health:** https://seu-dominio.com/api/health

### Primeiro Acesso

1. Abra https://seu-dominio.com no navegador
2. Clique em um tipo de produto (SaaS, etc.)
3. Escolha um estilo
4. Selecione cores
5. Clique em "Gerar Design System"
6. Exporte em seu formato preferido

---

## 🔄 Backup e Rollback

### Fazer Backup

```bash
# Backup dos dados
sudo tar -czf /opt/ui-ux-pro-max/backups/app-$(date +%Y%m%d).tar.gz /opt/ui-ux-pro-max

# Ou via Docker
docker-compose exec app tar -cz /app/data > backup-data.tar.gz
```

### Rollback para Versão Anterior

```bash
cd /opt/ui-ux-pro-max

# Voltar commit anterior
git revert HEAD

# Ou checkout de tag
git checkout v2.5.0

# Rebuild
docker-compose build
docker-compose up -d
```

---

## 📞 Suporte

- 📖 Documentação: Veja `README.md` no repositório
- 🐛 Issues: GitHub Issues
- 💬 Discussões: GitHub Discussions

---

## ✨ Próximas Etapas

Após deployment bem-sucedido:

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar monitoramento 24/7
3. ✅ Fazer backup regular
4. ✅ Documentar suas customizações
5. ✅ Usar em produção!

---

**Pronto para produção! 🚀**
