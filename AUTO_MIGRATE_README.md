# 🚀 AUTO-MIGRATE - Migração Totalmente Automática

**Versão:** 1.0  
**Tempo:** ~45 minutos total (incluindo propagação DNS)  
**Dificuldade:** ⭐ (Muito Fácil)

---

## 🎯 O Que Este Script Faz

Automatiza **100% do processo** de migração:

✅ Valida pré-requisitos  
✅ Coleta informações necessárias  
✅ Configura chaves SSH  
✅ Testa conexão VPS  
✅ Prepara arquivo .env  
✅ Instala Docker, Git, Certbot na VPS  
✅ Clona repositório na VPS  
✅ Executa deployment completo  
✅ Mostra próximos passos  

---

## 🚀 Como Usar (3 Passos Simples)

### Passo 1: Tenha Informações Básicas

Você precisa ter:
- IP da sua VPS Hostinger (ex: `185.123.45.67`)
- Usuário SSH da VPS (ex: `admin`, `root`, `ubuntu`)
- Seu domínio (ex: `meuapp.com.br`)

### Passo 2: Execute o Script

```bash
cd /home/user/ui-ux-pro-max-skill
./scripts/auto-migrate.sh
```

### Passo 3: Responda as 3 Perguntas

```
IP da VPS Hostinger: 185.123.45.67
Usuário SSH da VPS: admin
Seu domínio: meuapp.com.br
```

E pronto! O script faz o resto automaticamente.

---

## ⚡ Uso com Variáveis de Ambiente (Ainda Mais Rápido)

Se quiser pular até as perguntas, configure as variáveis primeiro:

```bash
export VPS_IP="185.123.45.67"
export VPS_USER="admin"
export DOMAIN="meuapp.com.br"

./scripts/auto-migrate.sh
```

Ou tudo em uma linha:

```bash
VPS_IP="185.123.45.67" VPS_USER="admin" DOMAIN="meuapp.com.br" ./scripts/auto-migrate.sh
```

---

## 📊 O Que Acontece Passo a Passo

```
┌─────────────────────────────────────────────┐
│ FASE 1: Validar Pré-requisitos             │
│ Verifica: git, ssh, python3, curl, scp     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 2: Coletar Informações                │
│ Pergunta: IP VPS, Usuário, Domínio         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 3: Configurar SSH                     │
│ Gera chave privada/pública automaticamente  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 4: Testar Conexão SSH                 │
│ Valida acesso à VPS                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 5: Preparar Variáveis de Ambiente     │
│ Cria .env com SECRET_KEY segura            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 6: Transferir Arquivos                │
│ Envia .env para VPS via SCP                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 7: Deployment Automático na VPS       │
│ Executa na VPS:                            │
│ • Atualizar sistema                        │
│ • Instalar Docker                          │
│ • Instalar Git e Certbot                   │
│ • Clonar repositório                       │
│ • Executar ./scripts/deploy.sh             │
│ • Obter certificado SSL                    │
│ • Iniciar aplicação                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 8: Exibir Resumo Final                │
│ Mostra instruções de DNS e próximos passos │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist Pré-Migração

- [ ] VPS ativa na Hostinger
- [ ] Domínio registrado na Hostinger
- [ ] Tenho o IP da VPS
- [ ] Tenho o usuário SSH (usuário + senha ou chave)
- [ ] Posso fazer login na VPS via SSH
- [ ] Git, SSH instalados na minha máquina

**Pronto?** Execute: `./scripts/auto-migrate.sh`

---

## 🎯 Saída Esperada

Durante a execução, você verá:

```
▶ Testando conexão SSH...
✓ Conexão SSH funcionando

▶ Criando chave SSH...
✓ Chave SSH gerada

▶ Preparando arquivo .env...
✓ Arquivo .env preparado
  DOMAIN: meuapp.com.br
  FLASK_ENV: production

▶ Copiando arquivo .env...
✓ Arquivo .env transferido

▶ Executando deployment na VPS...
[1/6] Atualizando sistema...
[2/6] Instalando Docker...
[3/6] Instalando Git e Certbot...
[4/6] Clonando repositório...
[5/6] Configurando arquivo .env...
[6/6] Executando script de deployment...

✓ Deployment completado com sucesso!
```

---

## 📋 Próximos Passos Após Script

O script mostrará um resumo com estas ações:

### 1️⃣ Configurar DNS (5 minutos)

```
Acesse: https://www.hostinger.com.br/painel
Domínios > Gerenciar Domínio > DNS

Criar Registro A:
  Nome: @
  Tipo: A
  Valor: 185.123.45.67 (seu IP da VPS)
  TTL: 3600

Salvar
```

### 2️⃣ Aguardar Propagação DNS (5-30 minutos)

```bash
# Verifique periodicamente:
nslookup meuapp.com.br

# Quando retornar seu IP, está pronto!
```

### 3️⃣ Testar Aplicação

```bash
# Testar API
curl https://meuapp.com.br/api/health

# Abrir no navegador
https://meuapp.com.br
```

---

## 🆘 Se Algo Der Errado

### Erro: "Falha na conexão SSH"

```bash
# Verifique se consegue conectar:
ssh seu-usuario@seu-ip

# Se não conseguir:
# 1. IP está correto?
# 2. Usuário está correto?
# 3. Chave SSH foi adicionada ao painel Hostinger?
```

### Erro: "Git não encontrado"

```bash
# Instale Git:
sudo apt-get install git

# Tente novamente:
./scripts/auto-migrate.sh
```

### Erro: "comando não encontrado"

```bash
# Atualize a máquina:
sudo apt-get update && sudo apt-get upgrade -y

# Instale dependências:
sudo apt-get install -y git curl openssh-client python3
```

---

## 📞 Consulte Também

Se precisar de mais detalhes ou troubleshooting avançado:

```bash
# Guia completo e detalhado (em português)
cat GUIA_MIGRACAO_HOSTINGER.md

# Quick start (5 passos)
cat HOSTINGER_SETUP.md

# Referência de deployment
cat DEPLOYMENT.md

# Checklist de prontidão
cat DEPLOYMENT_CHECKLIST.md
```

---

## 🎉 Parabéns!

Se o script completou com sucesso, sua aplicação está agora:

✅ **Rodando em Produção** na VPS Hostinger  
✅ **Com SSL/HTTPS** via Let's Encrypt  
✅ **Com Auto-Restart** via Systemd  
✅ **Com Monitoramento** via Health Checks  
✅ **Com Backups** automatizados  

Acesse: **https://seu-dominio.com**

---

## 💡 Dicas

- Salve o arquivo `.env` em local seguro (backup)
- Configure backup automático de dados
- Monitore logs regularmente
- Renove certificados SSL (automático, mas verifique)

---

## 📊 Resumo Rápido

| Ação | Tempo | Automático? |
|------|-------|-----------|
| Validar pré-requisitos | 10s | ✅ |
| Coletar info | 30s | ✅ |
| Setup SSH | 5s | ✅ |
| Teste conexão | 5s | ✅ |
| Preparar .env | 5s | ✅ |
| Transfer files | 10s | ✅ |
| Deployment na VPS | 10-15 min | ✅ |
| **Total** | **~15 min** | **100%** |

Depois, configure DNS (5 min manual) e aguarde propagação (5-30 min).

---

**Pronto para começar?**

```bash
./scripts/auto-migrate.sh
```

Boa migração! 🚀
