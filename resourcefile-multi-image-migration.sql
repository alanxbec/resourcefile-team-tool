-- ============================================================
-- ResourceFile — Multi-image flyers (run once in Supabase SQL Editor)
-- Adds a column that stores ALL of a resource's scanned pages, not just one.
-- Safe to run more than once — IF NOT EXISTS makes re-runs a no-op.
-- ============================================================

ALTER TABLE resources ADD COLUMN IF NOT EXISTS image_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ============================================================
-- That's it — one column. Existing resources keep working unchanged;
-- the app falls back to their old single `image_url` automatically.
-- ============================================================
