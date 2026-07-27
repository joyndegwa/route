import { supabase } from "../supabase/client";
import type { UpdateProfileInput, UserProfile } from "../types/user";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  organization: string | null;
  phone: string | null;
  created_at: string;
}

const PROFILES_TABLE = "profiles";

/** Map a raw Supabase profile row into the app's UserProfile shape. */
export function mapProfileRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? "",
    role: (row.role as UserProfile["role"]) ?? "client",
    organization: row.organization,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export const userRepo = {
  getById: async (id: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProfileRow(data as ProfileRow) : null;
  },

  list: async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapProfileRow(row as ProfileRow));
  },

  update: async (
    id: string,
    input: UpdateProfileInput,
  ): Promise<UserProfile> => {
    const patch: Record<string, unknown> = {};
    if (input.fullName !== undefined) patch.full_name = input.fullName;
    if (input.organization !== undefined) patch.organization = input.organization;
    if (input.role !== undefined) patch.role = input.role;

    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapProfileRow(data as ProfileRow);
  },

  insert: async (input: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    organization?: string | null;
    phone?: string | null;
  }): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .insert({
        id: input.id,
        email: input.email,
        full_name: input.fullName,
        role: input.role,
        organization: input.organization ?? null,
        phone: input.phone ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapProfileRow(data as ProfileRow);
  },
};
