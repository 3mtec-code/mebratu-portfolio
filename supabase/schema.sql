-- ═══════════════════════════════════════════════════════════════════════
-- Mebratu Muhabaw Portfolio — Supabase PostgreSQL Schema
-- Run this in Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Singleton settings tables ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id            TEXT PRIMARY KEY DEFAULT 'default',
  site_name     TEXT NOT NULL DEFAULT 'Mebratu Muhabaw',
  tagline       TEXT NOT NULL DEFAULT 'Software Engineer • UI/UX Designer',
  email         TEXT NOT NULL DEFAULT 'mebratu@example.com',
  phone         TEXT DEFAULT '+251 912 345 678',
  location      TEXT DEFAULT 'Gondar, Ethiopia',
  logo_url      TEXT DEFAULT '',
  favicon_url   TEXT DEFAULT '',
  cv_url        TEXT DEFAULT '',
  start_year    INTEGER DEFAULT 2006,
  online_status TEXT DEFAULT 'available' CHECK (online_status IN ('available','busy','offline')),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hero_profile (
  id               TEXT PRIMARY KEY DEFAULT 'default',
  hero_image_url   TEXT DEFAULT '',
  about_image_url  TEXT DEFAULT '',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
  id                    TEXT PRIMARY KEY DEFAULT 'default',
  hero_headline         TEXT DEFAULT 'I build digital products that make impact.',
  hero_subtext          TEXT DEFAULT 'Hi, I''m Mebratu. Modern, scalable web & mobile experiences.',
  hero_cta1             TEXT DEFAULT 'Hire Me',
  hero_cta2             TEXT DEFAULT 'View My Work',
  follow_me_label       TEXT DEFAULT 'Follow me on',
  services_label        TEXT DEFAULT 'WHAT I DO',
  services_title        TEXT DEFAULT 'Services I Provide',
  contact_label         TEXT DEFAULT 'LET''S CONNECT',
  contact_title         TEXT DEFAULT 'Get In Touch',
  footer_copyright      TEXT DEFAULT 'All rights reserved.',
  review_form_title     TEXT DEFAULT 'Leave a Review',
  tech_stack_label      TEXT DEFAULT 'Tech Stack',
  tech_stack_title      TEXT DEFAULT 'Technologies I Use',
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS footer_settings (
  id             TEXT PRIMARY KEY DEFAULT 'default',
  copyright_text TEXT DEFAULT '',
  footer_note    TEXT DEFAULT 'Let''s build something great together.',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── List tables ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT DEFAULT '',
  cover_image_url  TEXT DEFAULT '',
  category         TEXT NOT NULL DEFAULT 'Web Apps',
  tags             TEXT[] DEFAULT '{}',
  live_url         TEXT DEFAULT '',
  github_url       TEXT DEFAULT '',
  featured         BOOLEAN DEFAULT FALSE,
  "order"          INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  issuer               TEXT NOT NULL,
  issue_date           DATE NOT NULL,
  certificate_image_url TEXT DEFAULT '',
  verification_url     TEXT DEFAULT '',
  description          TEXT DEFAULT '',
  "order"              INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS awards (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  issuer      TEXT NOT NULL,
  issue_date  DATE NOT NULL,
  description TEXT DEFAULT '',
  image_url   TEXT DEFAULT '',
  "order"     INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_name       TEXT NOT NULL,
  reviewer_role       TEXT NOT NULL,
  reviewer_company    TEXT DEFAULT '',
  reviewer_image_url  TEXT DEFAULT '',
  quote               TEXT NOT NULL,
  rating              INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  approved            BOOLEAN DEFAULT FALSE,
  "order"             INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pending_reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_name    TEXT NOT NULL,
  reviewer_role    TEXT NOT NULL,
  reviewer_company TEXT DEFAULT '',
  quote            TEXT NOT NULL,
  rating           INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  submitted_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  video_url     TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  duration      TEXT DEFAULT '',
  "order"       INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT DEFAULT 'code',
  "order"     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS social_links (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url      TEXT NOT NULL,
  icon     TEXT NOT NULL DEFAULT 'link',
  "order"  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  published       BOOLEAN DEFAULT FALSE,
  tags            TEXT[] DEFAULT '{}',
  author          TEXT DEFAULT 'Mebratu Muhabaw',
  read_time_min   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  percentage INTEGER NOT NULL DEFAULT 80 CHECK (percentage BETWEEN 0 AND 100),
  category   TEXT DEFAULT 'Frontend',
  "order"    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS timeline_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  "order"     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hero_stats (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  auto_calc  TEXT DEFAULT NULL,
  "order"    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS info_cards (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT 'code',
  "order"     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nav_links (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label   TEXT NOT NULL,
  href    TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tech_stack (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name    TEXT NOT NULL,
  color   TEXT DEFAULT '#6366f1',
  bg      TEXT DEFAULT '#eef2ff',
  "order" INTEGER DEFAULT 0
);

-- ─── Admin user (for NextAuth) ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  name           TEXT DEFAULT 'Admin',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Public: read-only on published content
-- Service role: full access (used by server-side API routes)

ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read published/approved content
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "public_read_certs"
  ON certificates FOR SELECT USING (true);

CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT USING (approved = true);

CREATE POLICY "public_read_blog"
  ON blog_posts FOR SELECT USING (published = true);

-- Pending reviews: only service role can read/write (admin)
CREATE POLICY "service_only_pending"
  ON pending_reviews USING (auth.role() = 'service_role');

-- ─── Seed default singleton rows ─────────────────────────────────────────────

INSERT INTO site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_profile   (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO site_content   (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO footer_settings(id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- ─── Indexes for performance ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_projects_featured   ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category   ON projects(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug     ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);

-- ─── Migration: Add github_username to site_settings ─────────────────────────
-- Run this in Supabase SQL Editor if not already applied
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS github_username TEXT DEFAULT '';
UPDATE site_settings SET github_username = 'mebratu' WHERE id = 'default';
