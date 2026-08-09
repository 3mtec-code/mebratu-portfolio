/**
 * Change Admin Password Script
 * Run: node scripts/change-admin-password.mjs
 *
 * Updates the admin user password in Supabase.
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Load .env.local
const envLines = fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n')
for (const line of envLines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!process.env[k]) process.env[k] = v
}

// ── SET YOUR NEW PASSWORD HERE ────────────────────────────────────────────────
const NEW_EMAIL = 'admin@portfolio.com'   // ← change if you want
const NEW_PASSWORD = 'CHANGE_THIS_PASSWORD'   // ← ← ← ← ← ← ← ← ← ← ← ← ←
// ─────────────────────────────────────────────────────────────────────────────

if (NEW_PASSWORD === 'CHANGE_THIS_PASSWORD') {
    console.error('❌ Please edit change-admin-password.mjs and set NEW_PASSWORD first!')
    process.exit(1)
}

const { createClient } = await import('@supabase/supabase-js')
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const { hash } = await import('bcryptjs')
const hashed = await hash(NEW_PASSWORD, 12)

// Check if user exists
const { data: existing } = await sb.from('admin_users').select('id').eq('email', NEW_EMAIL).single()

if (existing) {
    // Update password
    const { error } = await sb.from('admin_users').update({ password_hash: hashed }).eq('email', NEW_EMAIL)
    if (error) { console.error('❌ Update failed:', error.message); process.exit(1) }
    console.log(`\n✅ Password updated for ${NEW_EMAIL}`)
} else {
    // Create new admin user
    const { error } = await sb.from('admin_users').insert({ email: NEW_EMAIL, password_hash: hashed, name: 'Admin' })
    if (error) { console.error('❌ Create failed:', error.message); process.exit(1) }
    console.log(`\n✅ Admin user created: ${NEW_EMAIL}`)
}

console.log('   New password is set. Keep it safe!\n')
