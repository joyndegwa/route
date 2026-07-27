import { getSupabaseConfigError, supabase } from "../config/supabase";

function missingSupabaseConfigError() {
  return {
    data: null,
    error: { message: getSupabaseConfigError() || "Supabase is not configured." },
  };
}

export async function registerUser(
  email: string,
  password: string
) {
  if (!supabase) {
    return missingSupabaseConfigError();
  }

  return await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
}

export async function loginUser(
  email: string,
  password: string
) {
  if (!supabase) {
    return missingSupabaseConfigError();
  }

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}