import { supabase } from "../supabase/client";
import type { SignInInput, SignUpInput } from "../types/auth";

export const auth = {
  signUp: async (input: SignUpInput) => {
    return await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          role: input.role,
          organization: input.organization ?? null,
        },
      },
    });
  },

  signIn: async (input: SignInInput) => {
    return await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  resetPassword: async (email: string, redirectTo?: string) => {
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },
};
