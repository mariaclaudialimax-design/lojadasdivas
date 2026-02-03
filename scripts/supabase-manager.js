#!/usr/bin/env node
/**
 * Supabase Manager - Manipulate database without Docker
 * Usage: node scripts/supabase-manager.js <command> [args...]
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ovdwsrlkwwfisbpxruct.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

const commands = {
  async 'list-tables'() {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    if (error) throw error;
    console.log('📋 Tables in public schema:');
    data.forEach(t => console.log(`  - ${t.table_name}`));
  },

  async 'select'(tableName, limit = 10) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(parseInt(limit));
    if (error) throw error;
    console.log(`\n📋 ${tableName} (limit ${limit}):`);
    console.table(data);
  },

  help() {
    console.log('Available commands:');
    console.log('  list-tables      - List all tables');
    console.log('  select <table> [limit] - Select rows from table');
  }
};

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  
  if (!cmd || !commands[cmd]) {
    commands.help();
    process.exit(1);
  }

  try {
    await commands[cmd](...args);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
