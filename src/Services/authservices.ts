import { auth } from "../lib/auth";
import type { SignInInput, SignUpInput } from "../types/auth";

/**
 * High-level authentication service used by the UI. Wraps the low-level
 * Supabase auth helpers and normalises the returned error message.
 */
export interface AuthResult {
  success: boolean;
  error: string | null;
}

function toResult(error: { message: string } | null): AuthResult {
  return { success: !error, error: error ? error.message : null };
}

export const authService = {
  register: async (input: SignUpInput): Promise<AuthResult> => {
    const { error } = await auth.signUp(input);
    return toResult(error);
  },

  login: async (input: SignInInput): Promise<AuthResult> => {
    const { error } = await auth.signIn(input);
    return toResult(error);
  },

  logout: async (): Promise<AuthResult> => {
    const { error } = await auth.signOut();
    return toResult(error);
  },

  requestPasswordReset: async (
    email: string,
    redirectTo?: string,
  ): Promise<AuthResult> => {
    const { error } = await auth.resetPassword(email, redirectTo);
    return toResult(error);
  },
};
