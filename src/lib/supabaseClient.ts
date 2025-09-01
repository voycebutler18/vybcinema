import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Helpful error during build/runtime if env vars are missing
  console.warn(
    "[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Set them in your .env (local) and on Render (Dashboard → Environment)."
  );
}

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
