import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Load .env.local first (Next.js convention), fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// DATABASE_URL is optional on Vercel — app uses Supabase directly.
// Provide a dummy value so `prisma generate` never crashes when it's unset.
const dbUrl = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/portfolio'

export default defineConfig({
    datasource: {
        url: dbUrl,
    },
})
