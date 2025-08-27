-- Temporarily create a more permissive INSERT policy to debug the auth issue
-- This will help us identify if it's a session problem

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own content" ON public.content;

-- Create a temporary policy that allows authenticated users to insert
-- but logs the auth.uid() for debugging
CREATE POLICY "Debug: Allow authenticated users to insert content"
ON public.content 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Also create a function to help debug auth issues
CREATE OR REPLACE FUNCTION public.debug_auth_state()
RETURNS TABLE (
  auth_uid uuid,
  session_exists boolean,
  user_count bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    auth.uid() as auth_uid,
    (auth.uid() IS NOT NULL) as session_exists,
    (SELECT COUNT(*) FROM auth.users) as user_count;
$$;