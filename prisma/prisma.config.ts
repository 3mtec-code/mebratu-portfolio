import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Load .env.local first (Next.js convention), fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL!,
    },
})
