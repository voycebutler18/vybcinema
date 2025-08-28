-- Add Cloudflare Stream fields to content table
ALTER TABLE public.content 
ADD COLUMN stream_id TEXT,
ADD COLUMN stream_status TEXT DEFAULT 'pending',
ADD COLUMN stream_url TEXT,
ADD COLUMN stream_thumbnail_url TEXT;

-- Add index for stream status queries
CREATE INDEX idx_content_stream_status ON public.content(stream_status);