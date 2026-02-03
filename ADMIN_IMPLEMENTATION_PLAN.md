# PLANO DE IMPLEMENTAÇÃO - ADMIN SYSTEM

## 📋 RESUMO EXECUTIVO

Sistema de admin completo dividido em 3 níveis de implementação:
- **NÍVEL 1 (MVP)**: Autenticação, Produtos CRUD, Categorias, Home CMS, Páginas, Pedidos (read-only)
- **NÍVEL 2 (Operacional)**: Estoque, Cupons/Promoções, SEO
- **NÍVEL 3 (Futuro)**: Usuários, Tags, Relatórios, Multi-admin

---

## ✅ JÁ FEITO

### Backend
- [x] Schema SQL completo com tabelas e RLS
- [x] `products` function para fetch dinâmico
- [x] Webhook `webhook-corvex` para sincronizar pedidos

### Frontend
- [x] Hook `useProducts` para consumir API
- [x] Home integrada ao backend

### DevOps
- [x] Git repo sincronizado
- [x] Netlify CLI instalado
- [x] Supabase CLI vinculado

---

## 🚀 PRÓXIMAS AÇÕES (Ordem Recomendada)

### FASE 1: Autenticação & Fundação (2-3 horas)
1. [ ] Executar migrations SQL no Supabase
2. [ ] Criar Netlify Function `auth/login`
3. [ ] Criar Netlify Function `auth/logout`
4. [ ] Criar contexto React para `AuthContext`
5. [ ] Página `/admin/login`
6. [ ] Proteger rotas com `PrivateRoute` component

### FASE 2: Admin CRUD (4-5 horas)
1. [ ] Funções para **Produtos**:
   - `GET /products` (lista com filtros)
   - `GET /products/:id`
   - `POST /products` (criar)
   - `PUT /products/:id` (editar)
   - `DELETE /products/:id`

2. [ ] Funções para **Categorias**:
   - `GET /categories`
   - `POST /categories`
   - `PUT /categories/:id`
   - `DELETE /categories/:id`

3. [ ] Funções para **Páginas CMS**:
   - CRUD completo

4. [ ] Funções para **Home Sections**:
   - CRUD completo

### FASE 3: Interface Admin (3-4 horas)
1. [ ] Componente `AdminSidebar`
2. [ ] Componente `AdminLayout`
3. [ ] Página `/admin/dashboard`
4. [ ] Página `/admin/products` (tabela com filtros)
5. [ ] Página `/admin/products/new` (form)
6. [ ] Página `/admin/products/:id` (editar)
7. [ ] Páginas para categorias, pages, home sections
8. [ ] Componente `Table` reutilizável

### FASE 4: Pedidos (Read-Only) (1-2 horas)
1. [ ] Função `GET /orders`
2. [ ] Página `/admin/orders`
3. [ ] Modal de detalhes do pedido

### FASE 5: Nível 2 (Estoque & Cupons) (3-4 horas)
1. [ ] Funções para **Estoque**
2. [ ] Funções para **Cupons**
3. [ ] Páginas correspondentes

---

## 🗂️ ESTRUTURA DE PASTAS (Proposta)

```
netlify/functions/
├── auth/
│   ├── login.ts
│   └── logout.ts
├── products/
│   ├── list.ts
│   ├── get.ts
│   ├── create.ts
│   ├── update.ts
│   └── delete.ts
├── categories/
│   ├── list.ts
│   ├── create.ts
│   ├── update.ts
│   └── delete.ts
├── pages/
│   ├── list.ts
│   ├── create.ts
│   ├── update.ts
│   └── delete.ts
├── home/
│   └── update-section.ts
├── orders/
│   ├── list.ts
│   └── get.ts
└── coupons/
    ├── list.ts
    ├── create.ts
    └── update.ts

pages/
├── Admin.tsx (Dashboard)
├── AdminLogin.tsx
└── AdminPanel/ (subcomponentes)

components/
└── admin/
    ├── AdminLayout.tsx
    ├── AdminSidebar.tsx
    ├── Table.tsx
    ├── Form.tsx
    └── Modal.tsx
```

---

## 🔐 SEGURANÇA

### RLS (Row Level Security) - JÁ CONFIGURADO
```
✅ Products: Público lê (status=active), Admin escreve
✅ Categories: Público lê (active=true), Admin escreve
✅ Pages: Público lê (published=true), Admin escreve
✅ Orders: Apenas Admin lê
✅ Coupons: Apenas Admin gerencia
```

### Autenticação
```
- Login → JWT token via Supabase Auth
- Token armazenado em sessionStorage
- Requests incluem `Authorization: Bearer <token>`
- Functions validam admin_users.id = auth.uid()
```

### Webhook (Recebe, não envia)
```
- Corvex → netlify/functions/webhook-corvex
- Usa SUPABASE_SERVICE_ROLE_KEY (bypass RLS)
- Valida assinatura (quando implementado)
```

---

## 📊 FLUXO DE DADOS

```
Frontend (Admin Panel)
    ↓ fetch(..., { Authorization: Bearer <token> })
Netlify Functions
    ↓ Valida auth com Supabase
Supabase (com RLS)
    ↓ Retorna dados filtrando por role
Frontend
```

---

## ⚙️ VARIÁVEIS DE AMBIENTE NECESSÁRIAS

No Netlify, adicione:
```
REACT_APP_SUPABASE_URL=https://ovdwsrlkwwfisbpxruct.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<sua_chave>
SUPABASE_SERVICE_ROLE_KEY=<sua_chave_service_role>
```

---

## 📝 PRÓXIMO PASSO

**Execute as migrations SQL no Supabase:**

1. Abra https://app.supabase.com/project/ovdwsrlkwwfisbpxruct/sql
2. Cole o conteúdo de `supabase_schema.sql`
3. Clique em "Run"

OU use CLI:
```bash
$env:SUPABASE_ACCESS_TOKEN = 'sbp_...'
npx supabase db push
```

Após executar, confirme que as tabelas foram criadas antes de prosseguir.
