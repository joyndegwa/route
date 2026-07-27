import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() ||
  "https://uzzwxprxxsipqnyzskmb.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  "sb_publishable_PYr5o7mRhwbS4FymbaLnSA_CmPQQWba";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      const message = error.message || "Supabase responded with an error.";
      return {
        ok: false,
        message: message.includes("does not exist")
          ? "Supabase is reachable, but the profiles table is not available yet."
          : message,
      };
    }

    return {
      ok: true,
      message: "Supabase connection is working.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to reach Supabase.",
    };
  }
}
