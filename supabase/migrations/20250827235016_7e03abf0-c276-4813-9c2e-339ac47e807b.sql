-- Add cover image and trailer support to content table
ALTER TABLE public.content 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS trailer_url TEXT;