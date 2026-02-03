#!/bin/bash
# Script para criar admin user no Supabase

echo "🔐 Criando usuário admin de teste no Supabase..."
echo ""
echo "⚠️  Você precisa:"
echo "1. Acessar: https://supabase.com"
echo "2. Ir para seu projeto"
echo "3. Menu > Authentication > Users"
echo "4. Clicar em 'Create user'"
echo ""
echo "Dados para criar:"
echo "├─ Email: admin@teste.com"
echo "├─ Senha: Teste123!@#"
echo "└─ Auto confirm user: ✓ SIM"
echo ""
echo "5. Após criar, copie o USER ID"
echo "6. Vá para SQL Editor e execute:"
echo ""
cat << 'EOF'
INSERT INTO admin_users (id, email, role) 
VALUES ('COLA_O_USER_ID_AQUI', 'admin@teste.com', 'admin');
EOF

echo ""
echo "Depois tente fazer login com:"
echo "├─ Email: admin@teste.com"
echo "└─ Senha: Teste123!@#"
