import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export function getSupabaseConfigError() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return "Supabase environment variables are not configured.";
  }

  return null;
}