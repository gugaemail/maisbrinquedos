# Mais Brinquedos e Presentes — Loja Virtual

Stack: **Next.js 15 · App Router · Tailwind v4 · Prisma · Supabase · Mercado Pago**

---

## Setup local

**Pré-requisitos:** Node 20 (use `nvm use` na pasta do projeto)

```bash
cp .env.example .env.local   # preencha as variáveis
npm install                  # já roda prisma generate via postinstall
npm run dev
```

Acesse: http://localhost:3000

---

## Variáveis de ambiente

Todas as variáveis necessárias estão documentadas em `.env.example`.

| Variável | Onde obter |
|---|---|
| `MP_ACCESS_TOKEN` | mercadopago.com.br/developers/panel |
| `MP_WEBHOOK_SECRET` | MP → Integrações → Webhooks → Criar webhook |
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com/dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | idem |
| `DATABASE_URL` | supabase.com/dashboard → Settings → Database (porta 6543) |
| `DIRECT_URL` | idem (porta 5432) |

---

## Banco de dados

```bash
# Aplicar migrations em desenvolvimento
npm run db:migrate

# Aplicar migrations em produção (sem prompts interativos)
npm run db:migrate:prod

# Popular banco com dados iniciais
npm run db:seed
```

---

## Deploy — Hostinger Business Web Hosting

### 1. Build local

```bash
npm run build
```

Gera `.next/standalone/` com o servidor autônomo.

### 2. Upload para Hostinger

Via **Git** (recomendado) ou upload manual da pasta do projeto para `~/public_html` (ou subdomínio configurado).

### 3. Configurar Node.js App no hPanel

1. hPanel → **Node.js** → **Create Application**
2. **Node.js version:** `20.x`
3. **Application root:** caminho da pasta do projeto (ex: `public_html/loja`)
4. **Application startup file:** `.next/standalone/server.js`
5. Salvar

### 4. Cadastrar variáveis de ambiente

hPanel → Node.js → **Manage** → **Environment Variables**

Cadastrar todas as variáveis do `.env.example` com os valores de **produção**:
- `MP_ACCESS_TOKEN` → token `APP-...` (não `TEST-`)
- `MP_WEBHOOK_SECRET` → secret gerado no painel do MP
- `NEXT_PUBLIC_BASE_URL` → `https://maisbrinquedos.com.br`
- `NODE_ENV` → `production`
- Demais variáveis Supabase e banco de dados

### 5. Instalar dependências e iniciar

No terminal SSH da Hostinger (ou via hPanel → Terminal):

```bash
cd ~/public_html/loja    # ajuste o caminho
npm install              # gera o Prisma Client via postinstall
npm run db:migrate:prod  # aplica migrations no banco de produção
```

Depois, no hPanel → Node.js → **Start** (ou **Restart**).

### 6. Configurar webhook do Mercado Pago

No painel do MP, cadastrar a URL do webhook:
```
https://maisbrinquedos.com.br/api/webhooks/mercadopago
```
Evento: `payment`

---

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (gera `.next/standalone`) |
| `npm run start` | Start padrão Next.js (não usar na Hostinger) |
| `npm run start:prod` | Start via standalone (entry point Hostinger) |
| `npm run db:migrate` | Migrations em desenvolvimento |
| `npm run db:migrate:prod` | Migrations em produção |
| `npm run db:seed` | Popular banco com dados iniciais |
# maisbrinquedos-loja
