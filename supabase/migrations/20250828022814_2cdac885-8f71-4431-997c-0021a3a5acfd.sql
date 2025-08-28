-- Add playback_id column to content table for Cloudflare Stream
ALTER TABLE public.content ADD COLUMN playback_id text;