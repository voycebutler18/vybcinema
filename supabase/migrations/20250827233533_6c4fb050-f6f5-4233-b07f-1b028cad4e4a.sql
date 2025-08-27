-- Fix the search_path security warning
CREATE OR REPLACE FUNCTION public.debug_auth_state()
RETURNS TABLE (
  auth_uid uuid,
  session_exists boolean,
  user_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() as auth_uid,
    (auth.uid() IS NOT NULL) as session_exists,
    (SELECT COUNT(*) FROM auth.users) as user_count;
$$;