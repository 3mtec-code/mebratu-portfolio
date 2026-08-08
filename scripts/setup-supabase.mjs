/**
 * Supabase Database Setup & Seed Script
 * Run: node scripts/setup-supabase.mjs
 *
 * Loads credentials from .env.local automatically.
 * NEVER hardcode secrets in this file.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// ─── Load .env.local ─────────────────────────────────────────────────────────
const envPath = path.join(root, '.env.local')
if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found. Copy .env.example → .env.local and fill in values.')
    process.exit(1)
}
const envLines = fs.readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    let val = trimmed.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
    if (!process.env[key]) process.env[key] = val
}

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local')
    process.exit(1)
}

console.log(`\n📡 Connecting to Supabase...\n`)
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

// ─── Test connection ──────────────────────────────────────────────────────────
const { data, error } = await sb.from('site_settings').select('id').limit(1)

if (error?.message?.includes('does not exist')) {
    console.log('❌ Tables not found.\n')
    console.log('📋 MANUAL STEP REQUIRED:')
    console.log('   1. Go to your Supabase project → SQL Editor')
    console.log('   2. Copy content of: supabase/schema.sql')
    console.log('   3. Paste and click RUN')
    console.log('   4. Run this script again\n')
    process.exit(1)
}

if (error) {
    console.error('❌ Connection error:', error.message)
    process.exit(1)
}

console.log('✅ Connected to Supabase!')

// Check if already seeded
const { count } = await sb.from('skills').select('*', { count: 'exact', head: true })
if (count > 0) {
    console.log(`ℹ Already seeded (${count} skills found). Skipping.\n`)
    process.exit(0)
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
console.log('🌱 Seeding database...\n')

await sb.from('site_settings').upsert({
    id: 'default', site_name: 'Mebratu Muhabaw',
    tagline: 'Full Stack Developer • AI & Cybersecurity',
    email: 'mebratu@gmail.com', phone: '+251 912 345 678',
    location: 'Gondar, Ethiopia', start_year: 2006, online_status: 'available',
}, { onConflict: 'id' })

await sb.from('hero_profile').upsert({ id: 'default', hero_image_url: '', about_image_url: '' }, { onConflict: 'id' })

await sb.from('site_content').upsert({
    id: 'default',
    hero_headline: 'I build intelligent, secure digital products.',
    hero_subtext: "Hi, I'm Mebratu — a Full Stack Software Developer specializing in AI-powered applications, secure system architecture, and cybersecurity across Windows & Linux (Ubuntu) environments.",
    hero_cta1: 'Hire Me', hero_cta2: 'View My Work', follow_me_label: 'Follow me on',
    services_label: 'WHAT I DO', services_title: 'Services I Provide',
    contact_label: "LET'S CONNECT", contact_title: 'Get In Touch',
}, { onConflict: 'id' })

await sb.from('footer_settings').upsert({ id: 'default', footer_note: "Let's build something great together." }, { onConflict: 'id' })

await sb.from('skills').insert([
    { name: 'React', percentage: 95, category: 'Frontend', order: 0 },
    { name: 'Next.js', percentage: 92, category: 'Frontend', order: 1 },
    { name: 'TypeScript', percentage: 90, category: 'Language', order: 2 },
    { name: 'Node.js', percentage: 88, category: 'Backend', order: 3 },
    { name: 'Tailwind CSS', percentage: 93, category: 'Frontend', order: 4 },
    { name: 'Python', percentage: 85, category: 'Language', order: 5 },
    { name: 'PostgreSQL', percentage: 87, category: 'Database', order: 6 },
    { name: 'MongoDB', percentage: 85, category: 'Database', order: 7 },
    { name: 'Cybersecurity', percentage: 88, category: 'Security', order: 8 },
    { name: 'Linux/Ubuntu', percentage: 90, category: 'DevOps', order: 9 },
    { name: 'Docker', percentage: 82, category: 'DevOps', order: 10 },
    { name: 'AI/ML', percentage: 85, category: 'AI', order: 11 },
])

await sb.from('timeline_entries').insert([
    { year: '2006', title: 'Started Programming', description: 'Began learning software development', order: 0 },
    { year: '2010', title: 'First Professional Role', description: 'Joined as Junior Developer', order: 1 },
    { year: '2015', title: 'Senior Developer', description: 'Promoted to senior position', order: 2 },
    { year: '2019', title: 'Information Systems Degree', description: 'Graduated from University of Gondar', order: 3 },
    { year: '2021', title: 'Full Stack Lead', description: 'Leading development teams', order: 4 },
    { year: '2024', title: 'Freelance Consultant', description: 'AI & Cybersecurity solutions', order: 5 },
])

await sb.from('info_cards').insert([
    { title: 'Full Stack Developer', description: 'AI-powered web & mobile apps', icon: 'code', order: 0 },
    { title: 'Cybersecurity', description: 'Secure architecture & penetration testing', icon: 'zap', order: 1 },
    { title: 'AI Solutions', description: 'Machine learning & automation', icon: 'brain', order: 2 },
    { title: 'Available for projects', description: 'Windows & Linux environments', icon: 'check', order: 3 },
])

await sb.from('hero_stats').insert([
    { label: 'Years Experience', value: '18+', auto_calc: 'yearsExperience', order: 0 },
    { label: 'Projects Completed', value: '0', auto_calc: 'projectCount', order: 1 },
    { label: 'Certificates', value: '0', auto_calc: 'certCount', order: 2 },
    { label: 'Awards Won', value: '15+', auto_calc: null, order: 3 },
    { label: 'Client Satisfaction', value: '98%', auto_calc: null, order: 4 },
])

await sb.from('projects').insert([
    { title: 'SmartCare AI', description: 'AI-powered healthcare assistant.', category: 'AI', tags: ['React', 'Python', 'TensorFlow'], featured: true, live_url: '#', github_url: '#', cover_image_url: '', order: 0 },
    { title: 'EduHub Platform', description: 'Learning management system.', category: 'Web Apps', tags: ['Next.js', 'TypeScript', 'Prisma'], featured: true, live_url: '#', github_url: '#', cover_image_url: '', order: 1 },
    { title: 'FinDash Analytics', description: 'Financial analytics dashboard.', category: 'Full Stack', tags: ['React', 'D3.js', 'Node.js'], featured: true, live_url: '#', github_url: '#', cover_image_url: '', order: 2 },
    { title: 'TaskFlow App', description: 'Team task management app.', category: 'Mobile Apps', tags: ['React Native', 'Firebase'], featured: true, live_url: '#', github_url: '#', cover_image_url: '', order: 3 },
])

await sb.from('certificates').insert([
    { title: 'Google Professional Cloud Developer', issuer: 'Google Cloud', issue_date: '2023-06-01', verification_url: 'https://cloud.google.com/certification', certificate_image_url: '', order: 0 },
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issue_date: '2023-03-15', verification_url: 'https://aws.amazon.com/certification', certificate_image_url: '', order: 1 },
])

await sb.from('awards').insert([
    { title: 'Best Student Developer', issuer: 'University of Gondar', issue_date: '2024-01-20', description: 'Awarded for outstanding performance in software engineering', order: 0 },
    { title: 'Innovation Award', issuer: 'Tech Summit 2023', issue_date: '2023-11-10', description: 'Recognized for innovative AI healthcare solution', order: 1 },
])

await sb.from('testimonials').insert([
    { reviewer_name: 'Abebe Kebede', reviewer_role: 'CEO', reviewer_company: 'EthioTech Solutions', quote: 'Mebratu is an exceptional developer. He delivers high-quality work on time and has a great eye for design.', rating: 5, approved: true, order: 0 },
    { reviewer_name: 'Sarah Johnson', reviewer_role: 'Product Manager', reviewer_company: 'StartupXYZ', quote: 'Working with Mebratu was a pleasure. He understood our vision and brought it to life beautifully.', rating: 5, approved: true, order: 1 },
])

await sb.from('services').insert([
    { title: 'Web Development', description: 'Building beautiful, high-performance websites.', icon: 'code', order: 0 },
    { title: 'UI/UX Design', description: 'Creating beautiful, intuitive user experiences.', icon: 'palette', order: 1 },
    { title: 'Mobile App', description: 'Building cross-platform mobile applications.', icon: 'smartphone', order: 2 },
    { title: 'AI Solutions', description: 'Intelligent solutions powered by AI.', icon: 'brain', order: 3 },
    { title: 'Cybersecurity', description: 'Penetration testing & secure architecture.', icon: 'zap', order: 4 },
    { title: 'AI Integration', description: 'LLM integration & intelligent automation.', icon: 'barchart', order: 5 },
])

await sb.from('social_links').insert([
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', order: 0 },
    { platform: 'GitHub', url: 'https://github.com/3mtec-code', icon: 'github', order: 1 },
    { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter', order: 2 },
    { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', order: 3 },
    { platform: 'Email', url: 'mailto:mebratu@gmail.com', icon: 'mail', order: 4 },
])

await sb.from('tech_stack').insert([
    { name: 'React', color: '#61DAFB', bg: '#E3F9FF', order: 0 },
    { name: 'Next.js', color: '#000000', bg: '#F0F0F0', order: 1 },
    { name: 'TypeScript', color: '#3178C6', bg: '#EBF3FD', order: 2 },
    { name: 'Node.js', color: '#339933', bg: '#E8F8E8', order: 3 },
    { name: 'Python', color: '#3776AB', bg: '#EBF3FD', order: 4 },
    { name: 'PostgreSQL', color: '#336791', bg: '#EBF3FD', order: 5 },
    { name: 'MongoDB', color: '#47A248', bg: '#E8F8E8', order: 6 },
    { name: 'Tailwind', color: '#06B6D4', bg: '#E0F8FF', order: 7 },
    { name: 'Figma', color: '#F24E1E', bg: '#FEF0EC', order: 8 },
    { name: 'Docker', color: '#2496ED', bg: '#EBF5FD', order: 9 },
    { name: 'AWS', color: '#FF9900', bg: '#FFF5E6', order: 10 },
    { name: 'GraphQL', color: '#E10098', bg: '#FDE6F4', order: 11 },
])

await sb.from('nav_links').insert([
    { label: 'Home', href: '/', order: 0 },
    { label: 'About', href: '/about', order: 1 },
    { label: 'Projects', href: '/projects', order: 2 },
    { label: 'Certificates', href: '/certificates', order: 3 },
    { label: 'Videos', href: '/videos', order: 4 },
    { label: 'Blog', href: '/blog', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
])

await sb.from('videos').insert([
    { title: 'Building AI Projects with Next.js', description: 'Learn how to integrate AI APIs', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:42', order: 0 },
    { title: 'My Developer Journey', description: 'Story & Experience', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10:15', order: 1 },
    { title: 'Full Stack Project Build', description: 'Step by Step Guide', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '32:05', order: 2 },
])

console.log('\n✅ Database seeded successfully!')
console.log('   Visit your site and admin panel to verify.\n')
