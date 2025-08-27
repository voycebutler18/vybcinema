-- Fix security warnings by setting proper search_path for functions

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
    ls.id,
    ls.user_id,
    ls.title,
    ls.description,
    ls.is_live,
    ls.viewer_count,
    ls.started_at,
    ls.ended_at,
    ls.created_at,
    ls.updated_at
  FROM public.live_streams ls
  ORDER BY ls.created_at DESC;
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
    ls.id,
    ls.user_id,
    ls.title,
    ls.description,
    ls.is_live,
    ls.viewer_count,
    ls.started_at,
    ls.ended_at,
    ls.created_at,
    ls.updated_at,
    ls.stream_key
  FROM public.live_streams ls
  WHERE ls.user_id = user_uuid
  ORDER BY ls.created_at DESC;
$$;