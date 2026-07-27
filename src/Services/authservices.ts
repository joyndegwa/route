import { auth } from "../lib/auth";
import { userRepo } from "../lib/user";
import type { SignInInput, SignUpInput } from "../types/auth";

export interface AuthResult {
  success: boolean;
  error: string | null;
}

function toResult(error: unknown): AuthResult {
  if (!error) return { success: true, error: null };

  if (typeof error === "string") {
    return { success: false, error };
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Record<string, unknown>;
    const message = candidate.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return { success: false, error: message };
    }
    console.error("Unexpected auth error object:", error);
    return { success: false, error: "Unable to complete authentication." };
  }

  return { success: false, error: "Unable to complete authentication." };
}

async function ensureProfile(
  userId: string,
  email: string,
  fullName: string,
  role: string,
  organization?: string | null,
  phone?: string | null,
): Promise<void> {
  try {
    const existing = await userRepo.getById(userId);
    if (!existing) {
      await userRepo.insert({
        id: userId,
        email,
        fullName,
        role,
        organization,
        phone,
      });
    }
  } catch (err) {
    console.error("Failed to ensure profile exists", err);
  }
}

export const authService = {
  register: async (input: SignUpInput): Promise<AuthResult> => {
    try {
      await auth.signUp(input);

      const session = await auth.getSession();
      const user = session.data?.session?.user;
      if (user) {
        await ensureProfile(
          user.id,
          user.email ?? input.email,
          (user.user_metadata?.full_name as string) ?? input.fullName,
          (user.user_metadata?.role as string) ?? input.role,
          input.organization,
          input.phone,
        );
      }

      return { success: true, error: null };
    } catch (err) {
      console.error("Signup exception:", err);
      return toResult(err);
    }
  },

  login: async (input: SignInInput): Promise<AuthResult> => {
    try {
      await auth.signIn(input);

      const session = await auth.getSession();
      const user = session.data?.session?.user;
      if (user) {
        await ensureProfile(
          user.id,
          user.email ?? input.email,
          (user.user_metadata?.full_name as string) ?? "",
          (user.user_metadata?.role as string) ?? "client",
          user.user_metadata?.organization as string | null,
        );
      }

      return { success: true, error: null };
    } catch (err) {
      console.error("Login exception:", err);
      return toResult(err);
    }
  },

  logout: async (): Promise<AuthResult> => {
    const { error } = await auth.signOut();
    return toResult(error);
  },

  requestPasswordReset: async (
    email: string,
  ): Promise<AuthResult> => {
    const addresses = email
      .split(/[;,\n]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (addresses.length === 0) {
      return { success: false, error: "Enter at least one valid email address." };
    }

    const errors: string[] = [];

    for (const address of addresses) {
      const { error } = await auth.sendRecoveryCode(address);
      if (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0 && errors.length === addresses.length) {
      return { success: false, error: errors[0] };
    }

    return { success: true, error: null };
  },

  verifyRecoveryCode: async (
    email: string,
    code: string,
  ): Promise<AuthResult> => {
    try {
      await auth.verifyOtp(email, code);
      return { success: true, error: null };
    } catch (err) {
      console.error("Verify OTP exception:", err);
      return toResult(err);
    }
  },
};
