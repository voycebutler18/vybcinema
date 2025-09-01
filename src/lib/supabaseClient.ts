// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

/**
 * We use your ORIGINAL envs:
 *  - VITE_SUPABASE_URL
 *  - VITE_SUPABASE_PUBLISHABLE_KEY
 * If the anon key happens to exist, it's fine; we still prefer the publishable key.
 */
const URL =
  import.meta.env.VITE_SUPABASE_URL as string | undefined;

const KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined); // optional fallback

// Create the real client (no hard crash if missing; console helps in dev)
if (!URL || !KEY) {
  console.warn(
    "[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. " +
      "Set them in your Render Environment."
  );
}

export const supabase = createClient(String(URL ?? ""), String(KEY ?? ""));
