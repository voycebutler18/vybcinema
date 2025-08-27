-- Clean RLS policies for content table (covers Movies, TV Shows, Music Videos, Stories, Podcasts)

-- Remove all existing policies first
DROP POLICY IF EXISTS "public read" ON public.content;
DROP POLICY IF EXISTS "auth can insert own" ON public.content;
DROP POLICY IF EXISTS "owner can update own" ON public.content;
DROP POLICY IF EXISTS "owner can delete own" ON public.content;
DROP POLICY IF EXISTS "Temp: Allow all inserts for testing" ON public.content;
DROP POLICY IF EXISTS "Debug: Allow authenticated users to insert content" ON public.content;

-- Enable RLS (if not already enabled)
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone (even not logged in) to READ published rows
CREATE POLICY "public read"
ON public.content
FOR SELECT
TO public
USING (true);

-- 2. Allow AUTHENTICATED users to INSERT their own content
CREATE POLICY "auth can insert own"
ON public.content
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Allow OWNERS to UPDATE their own rows
CREATE POLICY "owner can update own"
ON public.content
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Allow OWNERS to DELETE their own rows
CREATE POLICY "owner can delete own"
ON public.content
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Storage policies for content-files bucket
-- Remove existing storage policies
DROP POLICY IF EXISTS "public can read files" ON storage.objects;
DROP POLICY IF EXISTS "auth can upload" ON storage.objects;
DROP POLICY IF EXISTS "auth can update own files" ON storage.objects;
DROP POLICY IF EXISTS "auth can delete own files" ON storage.objects;

-- Allow anyone to view files (public site)
CREATE POLICY "public can read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'content-files');

-- Allow authenticated users to upload files
CREATE POLICY "auth can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-files');

-- Allow owners to update/delete files they uploaded
CREATE POLICY "auth can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'content-files' AND owner = auth.uid());

CREATE POLICY "auth can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'content-files' AND owner = auth.uid());