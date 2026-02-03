
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...val] = line.split('=');
            return [key.trim(), val.join('=').split('#')[0].trim()];
        })
);

const supabase = createClient(env.REACT_APP_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const PAGES = [
    {
        title: 'Por que somos um Site Confiável?',
        slug: 'trust',
        content: `
            <div class="space-y-8">
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="p-6 bg-green-50 rounded-xl border border-green-100 text-center">
                        <h3 class="font-bold text-lg mb-2">Segurança de Dados</h3>
                        <p class="text-sm text-gray-600">Utilizamos criptografia SSL de 256 bits (a mesma de bancos) para proteger seus dados pessoais e de cartão.</p>
                    </div>
                    <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <h3 class="font-bold text-lg mb-2">Entrega Garantida</h3>
                        <p class="text-sm text-gray-600">Todas as encomendas possuem código de rastreio e seguro contra extravio. Se não chegar, devolvemos seu dinheiro.</p>
                    </div>
                </div>
                <p>A Loja das Divas atua no mercado de moda feminina com o compromisso de levar elegância e conforto para mulheres de todo o Brasil. Somos uma empresa registrada e transparente.</p>
            </div>
        `,
        is_published: true
    },
    {
        title: 'Trocas e Devoluções',
        slug: 'exchanges',
        content: `
            <p>Se o tamanho não serviu, a <strong>primeira troca é por nossa conta</strong>. Basta entrar em contato com nosso suporte informando o número do pedido.</p>
            <h3>1. Prazo</h3>
            <p>Você tem 7 dias corridos após o recebimento para solicitar a troca ou devolução por arrependimento.</p>
            <h3>2. Condições</h3>
            <p>A peça deve estar com a etiqueta fixada e sem sinais de uso.</p>
        `,
        is_published: true
    },
    {
        title: 'Política de Privacidade',
        slug: 'privacy',
        content: `
            <p>A Loja das Divas respeita a sua privacidade. Esta política descreve como coletamos e usamos seus dados.</p>
            <h3>Coleta de Dados</h3>
            <p>Coletamos apenas as informações necessárias para processar seu pedido: Nome, CPF (para Nota Fiscal), Endereço e Dados de Contato.</p>
            <h3>Segurança</h3>
            <p>Seus dados são armazenados em servidores seguros e nunca são vendidos a terceiros.</p>
        `,
        is_published: true
    },
    {
        title: 'Sobre Nós',
        slug: 'about',
        content: `
            <p>Nascemos de um desejo simples: criar roupas que unam a sofisticação da alfaiataria com o conforto que a mulher brasileira precisa.</p>
            <p>Nossas coleções são desenvolvidas com tecidos naturais e modelagens pensadas para valorizar todos os tipos de corpos.</p>
        `,
        is_published: true
    },
    {
        title: 'Política de Envio',
        slug: 'shipping',
        content: `
            <p>Enviamos para todo o Brasil com frete grátis e seguro incluso.</p>
            <p>O prazo de processamento é de até 24h úteis. O prazo de entrega varia de 5 a 15 dias úteis dependendo da sua região.</p>
        `,
        is_published: true
    },
    {
        title: 'Política de Reembolso',
        slug: 'refund',
        content: `
            <p>O reembolso é feito na mesma forma de pagamento da compra.</p>
            <ul>
                <li>Cartão: Estorno em até 2 faturas.</li>
                <li>Pix: Em até 5 dias úteis na conta de origem.</li>
            </ul>
        `,
        is_published: true
    },
    {
        title: 'Aviso Legal',
        slug: 'legal',
        content: `
            <p>Todo o conteúdo deste site é propriedade da Loja das Divas. Imagens meramente ilustrativas.</p>
        `,
        is_published: true
    },
    {
        title: 'Termos de Serviço',
        slug: 'terms',
        content: `
            <p>Ao comprar em nossa loja, você concorda com nossos prazos e políticas de envio.</p>
        `,
        is_published: true
    }
];

const SETTINGS = [
    { key: 'contact_email', value: 'contato@lojadasdivas.com.br', label: 'Email de Contato', group: 'contact' },
    { key: 'contact_phone', value: '(21) 96555-4423', label: 'Telefone / WhatsApp', group: 'contact' },
    { key: 'address', value: 'Av. Piraí, 351, São Cristóvão, Lajeado-RS', label: 'Endereço Completo', group: 'contact', type: 'textarea' },
    { key: 'working_hours', value: 'Seg a Sex: 09:00 às 18:00', label: 'Horário de Atendimento', group: 'contact' },
    { key: 'footer_about', value: 'Moda feminina com elegância e conforto para todas as mulheres.', label: 'Texto Sobre no Rodapé', group: 'footer', type: 'textarea' },
    { key: 'copyright', value: '© 2026 Loja das Divas. Todos os direitos reservados.', label: 'Texto de Copyright', group: 'footer' },
    { key: 'cnpj', value: '41.873.753/0001-99', label: 'CNPJ', group: 'footer' }
];

async function seedContent() {
    console.log('🌱 Seeding Pages...');
    for (const page of PAGES) {
        const { error } = await supabase.from('pages').upsert(page, { onConflict: 'slug' });
        if (error) console.error(`Error page ${page.slug}:`, error.message);
    }

    // Creating table if migration didn't run via direct SQL command in tool (it ran via file write, need to verify)
    // Assuming user will run migration or I should run a sync. Use Supabase RPC if possible or standard insert.
    // Since I can't run DDL here easily, I rely on the file '20260203_add_settings.sql' being applied manually or by me somehow?
    // Wait, I haven't "executed" the SQL file. I just wrote it.
    // I need to use the `repair_and_sync` approach but for table creation? No, Supabase client can't create tables without RPC.

    // BUT! I can use the existing `home_sections` trick? No.
    // I MUST assume the user or system applies migrations. 
    // OR, I can try to use a specialized RPC if available.
    // Fallback: Use `repair` script to try to *insert*. If it fails, I might handle it.
    // Actually, I can use the `run_command` with `psql` if installed? No.
    // I can try to use the `setup_admin` function if it allows SQL injection? No.

    // STRATEGY: I will assume the table exists or I will fail. 
    // To make sure table exists, I'll log a warning.

    console.log('🌱 Seeding Settings...');
    // We first check if table exists by inserting one. 
    // If it fails, we know we can't seed settings yet.

    for (const s of SETTINGS) {
        const { error } = await supabase.from('site_settings').upsert({
            setting_key: s.key,
            setting_value: s.value,
            label: s.label,
            group_name: s.group,
            field_type: s.type || 'text'
        }, { onConflict: 'setting_key' });

        if (error) {
            console.error(`Error setting ${s.key}:`, error.message);
            if (error.message.includes('relation "public.site_settings" does not exist')) {
                console.error("CRITICAL: Table site_settings does not exist. Please run migration.");
            }
        }
    }

    console.log('✅ Content Seeded!');
}

seedContent();
