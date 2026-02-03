# 🔐 Como Fazer Login no Painel Admin

## ⚠️ Problema Encontrado

O login com "teste/teste" não funciona porque:
1. Esse usuário não existe no **Supabase Auth**
2. Mesmo que existisse, não teria registro na tabela **admin_users**

## ✅ Solução: Criar Usuário Admin

### Passo 1: Acessar Supabase
1. Vá para https://supabase.com
2. Faça login na sua conta
3. Abra o projeto **Loja das Divas**

### Passo 2: Criar Usuário de Teste
1. No menu lateral, vá para **Authentication**
2. Clique em **Users**
3. Clique em **Create user**
4. Preencha:
   - **Email**: `admin@teste.com`
   - **Password**: `Teste123!@#`
   - **Auto confirm user**: ✅ ATIVADO
5. Clique **Create user**

### Passo 3: Copiar o User ID
1. Após criar, você verá a nova linha na tabela
2. **Copie o UUID** (ID do usuário) - algo como: `550e8400-e29b-41d4-a716-446655440000`

### Passo 4: Adicionar à Tabela admin_users
1. No menu lateral, vá para **SQL Editor**
2. Cole este comando (substitua `COLE_O_USER_ID_AQUI` pelo ID copiado):

```sql
INSERT INTO admin_users (id, email, role) 
VALUES ('COLE_O_USER_ID_AQUI', 'admin@teste.com', 'admin');
```

3. Clique **Execute** (ou Ctrl+Enter)
4. Se der um erro de constraint, significa que o registro já existe (sem problema)

### Passo 5: Fazer Login no Painel

Agora acesse o painel admin:
- **URL**: http://localhost:3000/admin
- **Email**: `admin@teste.com`
- **Senha**: `Teste123!@#`

## ❓ Problemas?

### Erro: "Invalid credentials"
- ✅ Verifique se o email está correto em ambos os lugares
- ✅ Verifique se "Auto confirm user" foi ativado
- ✅ Aguarde alguns segundos e tente novamente

### Erro: "Not authorized as admin"
- ✅ Verifique se executou o comando SQL corretamente
- ✅ Verifique se o UUID foi copiado exatamente igual
- ✅ Verifique se o registro foi inserido em admin_users

### Erro: "Não vejo as novas funções"
- ✅ Limpe o cache do navegador (Ctrl+Shift+Delete)
- ✅ Recarregue a página (Ctrl+F5)
- ✅ Se ainda não funcionar, verifique o console do navegador (F12)

## 📋 Resumo

| Campo | Valor |
|-------|-------|
| Email | `admin@teste.com` |
| Senha | `Teste123!@#` |
| URL | `http://localhost:3000/admin` |

---

**Após fazer login, você deverá ver todas as 8 páginas de admin:**
1. Dashboard
2. Produtos
3. Categorias
4. Home (CMS)
5. Páginas
6. Pedidos
7. Inventário
8. Cupons
