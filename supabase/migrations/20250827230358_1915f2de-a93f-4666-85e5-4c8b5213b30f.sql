-- Fix search path security warnings for the functions I just created

-- Update the get_public_live_streams function with proper search_path
CREATE OR REPLACE FUNCTION public.get_public_live_streams()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  is_live boolean,
  viewer_count integer,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    title,
    description,
    is_live,
    viewer_count,
    started_at,
    ended_at,
    created_at,
    updated_at
  FROM public.live_streams
  ORDER BY created_at DESC;
$$;

-- Update the get_user_live_streams function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_live_streams(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  is_live boolean,
  viewer_count integer,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  stream_key text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    title,
    description,
    is_live,
    viewer_count,
    started_at,
    ended_at,
    created_at,
    updated_at,
    stream_key
  FROM public.live_streams
  WHERE user_id = user_uuid
  ORDER BY created_at DESC;
$$;