import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Load .env.local first (Next.js convention), fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// DATABASE_URL is optional — we use Supabase directly via SUPABASE_URL.
// Provide a dummy value so prisma generate never crashes when DATABASE_URL is unset.
const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/portfolio'

export default defineConfig({
    datasource: {
        url: dbUrl,
    },
})
