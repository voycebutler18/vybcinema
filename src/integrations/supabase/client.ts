// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

// Make sure these names match exactly what you set in Render
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing')
}
if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
