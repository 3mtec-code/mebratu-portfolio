/**
 * One-command database setup.
 * Run: node scripts/setup-db.mjs
 *
 * This loads .env.local, pushes the Prisma schema, then seeds all content.
 */

import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Load .env.local into process.env
const envPath = path.join(root, '.env.local')
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const idx = trimmed.indexOf('=')
        if (idx === -1) continue
        const key = trimmed.slice(0, idx).trim()
        let value = trimmed.slice(idx + 1).trim()
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (!process.env[key]) process.env[key] = value
    }
    console.log('✓ Loaded .env.local')
} else {
    console.error('✗ .env.local not found — copy .env.example to .env.local and fill in DATABASE_URL')
    process.exit(1)
}

if (!process.env.DATABASE_URL) {
    console.error('✗ DATABASE_URL is not set in .env.local')
    process.exit(1)
}

console.log(`\n📦 DATABASE_URL: ${process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@')}\n`)

try {
    console.log('1/3  Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit', cwd: root, env: process.env })

    console.log('\n2/3  Pushing schema to database...')
    execSync('npx prisma db push --config=prisma/prisma.config.ts', { stdio: 'inherit', cwd: root, env: process.env })

    console.log('\n3/3  Seeding database with demo content...')
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', cwd: root, env: process.env })

    console.log('\n✅ Setup complete!')
    console.log('   Admin URL:      http://localhost:3000/mgmt-x7k2p9')
    console.log('   Basic Auth:     admin / Dev@Password123')
    console.log('   Login email:    admin@portfolio.com')
    console.log('   Login password: Admin@123456\n')
} catch (err) {
    console.error('\n✗ Setup failed:', err.message)
    process.exit(1)
}
