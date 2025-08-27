-- Fix critical security vulnerability: Restrict stream key access to owners only

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Restrict sensitive stream data" ON public.live_streams;

-- Create a strict policy that only allows owners to access their own streams
CREATE POLICY "Stream owners can access their own data"
ON public.live_streams 
FOR SELECT 
USING (auth.uid() = user_id);

-- For public access, users must use the get_public_live_streams() function
-- which excludes sensitive fields like stream_key