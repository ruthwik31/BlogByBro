-- ============================================================
-- Blog Schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Posts Table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  cover_image   TEXT,
  category      TEXT        DEFAULT 'General',
  tags          TEXT[]      DEFAULT ARRAY[]::TEXT[],
  status        TEXT        DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  read_time     INTEGER     DEFAULT 1,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS posts_slug_idx        ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_status_idx      ON posts(status);
CREATE INDEX IF NOT EXISTS posts_category_idx    ON posts(category);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (public blog)
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Authenticated users (you, the admin) have full access
CREATE POLICY "Authenticated users have full access"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── Storage Bucket for Blog Images ──────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Authenticated can upload images
CREATE POLICY "Authenticated can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Authenticated can delete images
CREATE POLICY "Authenticated can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
