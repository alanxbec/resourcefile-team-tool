-- ============================================================
-- ResourceFile — Security setup (run once in Supabase SQL Editor)
-- Turns RLS ON with policies so anon/youth can READ, only staff can WRITE.
-- ============================================================

-- ── 1. RESOURCES TABLE ──
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Defensive cleanup: an early build (before this file existed) created ad-hoc
-- policies granting unauthenticated INSERT/SELECT/DELETE to "public". They
-- were never defined here so re-running this script alone never removed them —
-- found still live in production on 2026-07-07, letting anyone add/delete
-- resources without logging in even though RLS showed as "enabled".
DROP POLICY IF EXISTS "allow insert" ON resources;
DROP POLICY IF EXISTS "allow select" ON resources;
DROP POLICY IF EXISTS "allow delete" ON resources;

-- Anyone (anon youth viewers + signed-in staff) can read
DROP POLICY IF EXISTS "public read" ON resources;
CREATE POLICY "public read" ON resources
  FOR SELECT TO anon, authenticated USING (true);

-- Only signed-in staff can add / change / remove
DROP POLICY IF EXISTS "staff insert" ON resources;
CREATE POLICY "staff insert" ON resources
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff update" ON resources;
CREATE POLICY "staff update" ON resources
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff delete" ON resources;
CREATE POLICY "staff delete" ON resources
  FOR DELETE TO authenticated USING (true);


-- ── 2. FLYER IMAGE STORAGE ──
-- Remove the old "anyone can upload" policy, replace with staff-only uploads.
DROP POLICY IF EXISTS "Allow public uploads to flyers" ON storage.objects;

-- Only signed-in staff can upload flyer images
DROP POLICY IF EXISTS "staff upload flyers" ON storage.objects;
CREATE POLICY "staff upload flyers" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'flyers');

-- Anyone can view flyer images (bucket is public; youth need to see them)
DROP POLICY IF EXISTS "public read flyers" ON storage.objects;
CREATE POLICY "public read flyers" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'flyers');

-- ============================================================
-- After running this, the Supabase "RLS disabled" warning will clear,
-- and the anon key alone can no longer edit or delete your data.
-- ============================================================
