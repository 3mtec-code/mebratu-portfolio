# Mebratu Muhabaw — Personal Portfolio

> Full Stack Software Developer • AI Specialist • Cybersecurity | Gondar, Ethiopia

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

## 🌐 Live Site

**[mebratumuhabaw.dev](https://mebratumuhabaw.dev)** *(coming soon)*

---

## 🚀 About This Project

A **production-grade, fully dynamic portfolio** built with modern technologies. Every piece of content — from hero text to certificates — is managed through a hidden Admin CMS panel and stored in PostgreSQL (Supabase). No code changes needed to update content.

### What makes it special

- **100% Dynamic CMS** — All text, images, and data editable from the admin panel
- **AI Chat Assistant** — Powered by Groq (Llama 3) with real portfolio context
- **Supabase PostgreSQL** — ACID-compliant production database with Row Level Security
- **Cloudinary** — Optimized image delivery via CDN
- **Auto-calculated stats** — Project counts, certificate counts, years of experience update automatically
- **Review system** — Visitors submit reviews → admin approves → published publicly
- **Real-time availability badge** — Toggle available/busy/offline from admin

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 App Router + TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **Database** | Supabase PostgreSQL (14 tables, RLS policies) |
| **Auth** | NextAuth.js v4 (Credentials + JWT) |
| **AI Assistant** | Groq API — Llama 3.1 8B Instant (free tier) |
| **Media** | Cloudinary (upload, optimize, CDN deliver) |
| **Email** | Nodemailer + Gmail App Password |
| **Hosting** | Vercel (serverless, Edge-ready) |
| **Icons** | Lucide React + React Icons |
| **Fonts** | Inter + Poppins via next/font |

---

## ✨ Features

### Public Site
- ⚡ Hero section with animated availability badge + AI info cards
- 📊 Auto-calculated stats (projects, certificates, years experience)
- 🗂️ Filterable projects with Case Study modal popup
- 📈 Animated skill progress bars
- 🗓️ Career timeline
- 🏆 Certificates, awards and testimonials carousel
- 🤖 AI chat widget — answers visitor questions using site data
- 📬 Contact form with email delivery
- ⭐ Public review submission (pending admin approval)
- 🗺️ World map with dynamic location pin
- 📱 Fully responsive + mobile-first
- 🌙 Dark / Light mode toggle
- 🔍 SEO — dynamic metadata, OpenGraph, sitemap.xml, robots.txt

### Admin Panel (`/mgmt-x7k2p9`)
- 🔒 3-layer security: Basic HTTP Auth → NextAuth login → Session JWT
- 📋 18 admin pages covering every piece of content
- 🖼️ Drag-and-drop image uploads to Cloudinary
- ✅ Pending review approval workflow
- 🟢 Online status toggle (Available / Busy / Offline)
- ♻️ Auto-revalidation — changes go live in seconds

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (home, about, projects...)
│   ├── api/               # API routes (admin CRUD, AI, contact, upload)
│   └── mgmt-x7k2p9/      # Hidden admin panel (18 pages)
├── components/
│   ├── admin/             # Admin UI components
│   ├── sections/          # Page section components
│   └── ...
├── lib/
│   ├── dal.ts             # Data Access Layer (Supabase ↔ local fallback)
│   ├── store.ts           # Local JSON store (dev fallback)
│   ├── mailer.ts          # Email via Nodemailer
│   ├── revalidate.ts      # Central route revalidation
│   └── seo.ts             # SEO metadata builder
├── hooks/
│   └── useCrud.ts         # Generic CRUD hook for admin pages
supabase/
└── schema.sql             # Full PostgreSQL schema (14 tables + RLS)
```

---

## 🏗️ Architecture

```
Browser
   ↓
Next.js 14 (Vercel Serverless)
   ↓
Data Access Layer (dal.ts)
   ↓                    ↓
Supabase PostgreSQL   Local JSON (dev fallback)
   ↓
Cloudinary (images) + Groq (AI) + Gmail (email)
```

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/mebratu-portfolio.git
cd mebratu-portfolio

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your values (see .env.example)

# 4. Set up Supabase database
# Copy supabase/schema.sql → Supabase SQL Editor → Run
# Then seed:
node scripts/setup-supabase.mjs

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/mgmt-x7k2p9](http://localhost:3000/mgmt-x7k2p9)

---

## ⚙️ Environment Variables

```env
# Database
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
EMAIL_USER=
EMAIL_PASS=

# AI (free at console.groq.com)
GROQ_API_KEY=

# Admin panel security
ADMIN_HTTP_USER=
ADMIN_HTTP_PASSWORD=
```

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy → update `NEXTAUTH_URL` to your Vercel domain

---

## 👨‍💻 Author

**Mebratu Muhabaw**
Full Stack Software Developer | AI Specialist | Cybersecurity

📍 Gondar, Ethiopia
📧 mebratu@gmail.com
🌐 [mebratumuhabaw.dev](https://mebratumuhabaw.dev)

---

## 📄 License

MIT — feel free to use this as inspiration for your own portfolio.

---

*Built with ❤️ using Next.js, Supabase, and Groq AI*
