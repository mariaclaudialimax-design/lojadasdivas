
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

const SETTINGS_DATA = {
    contact_email: 'contato@lojadasdivas.com.br',
    contact_phone: '(21) 96555-4423',
    address: 'Av. Piraí, 351, São Cristóvão, Lajeado-RS',
    working_hours: 'Seg a Sex: 09:00 às 18:00',
    footer_about: 'Moda feminina com elegância e conforto para todas as mulheres.',
    copyright: '© 2026 Loja das Divas. Todos os direitos reservados.',
    cnpj: '41.873.753/0001-99'
};

async function seed() {
    console.log('🌱 Seeding Global Settings into home_sections...');

    const { error } = await supabase.from('home_sections').upsert({
        section_key: 'global_settings',
        section_type: 'settings',
        title: 'Configurações do Site',
        description: 'Dados de contato, rodapé e informações globais.',
        content: JSON.stringify(SETTINGS_DATA),
        is_active: true,
        order_position: 99
    }, { onConflict: 'section_key' });

    if (error) {
        console.error('❌ Error seeding settings:', error.message);
    } else {
        console.log('✅ Settings seeded successfully!');
    }
}

seed();
