import { supabase } from "../supabase/client";
import type { SignInInput, SignUpInput } from "../types/auth";

export const auth = {
  signUp: async (input: SignUpInput) => {
    const response = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          role: input.role,
          organization: input.organization ?? null,
          phone: input.phone ?? null,
        },
      },
    });

    if (response.error) {
      console.error("Supabase signup error:", response.error);
      throw response.error;
    }

    return response.data;
  },

  signIn: async (input: SignInInput) => {
    const response = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign-in failed");
    }

    return response.data;
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

  sendRecoveryCode: async (email: string) => {
    return await supabase.auth.signInWithOtp({ email });
  },

  verifyOtp: async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
  },

  updateUser: async (updates: { password?: string }) => {
    return await supabase.auth.updateUser(updates);
  },
};