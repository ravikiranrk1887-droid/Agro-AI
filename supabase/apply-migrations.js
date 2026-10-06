import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend or root .env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigrations() {
    console.log('🌱 Starting Supabase Migration Runner...');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.log('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment variables.');
        console.log('ℹ️  Skipping remote Supabase migration execution. Schema file available at supabase/migrations/001_initial_schema.sql');
        return;
    }

    const migrationFilePath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    if (!fs.existsSync(migrationFilePath)) {
        console.error('❌ Migration file not found:', migrationFilePath);
        process.exit(1);
    }

    const sqlContent = fs.readFileSync(migrationFilePath, 'utf-8');

    try {
        console.log(`📡 Sending migration payload to Supabase SQL engine at ${SUPABASE_URL}...`);
        
        // Supabase Postgres endpoint / SQL API call using service_role key
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ query: sqlContent })
        });

        if (response.ok) {
            console.log('✅ Migrations applied successfully via Supabase SQL engine!');
        } else {
            const errorText = await response.text();
            console.log('⚠️ Supabase RPC exec_sql endpoint result status:', response.status);
            console.log('Response details:', errorText);
            console.log('👉 Note: If exec_sql RPC is not pre-enabled in Supabase dashboard, paste `supabase/migrations/001_initial_schema.sql` into the Supabase SQL Editor.');
        }
    } catch (err) {
        console.error('❌ Error executing migrations:', err.message);
    }
}

runMigrations();
