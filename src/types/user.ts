export type UserRole = "client" | "industry" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization?: string | null;
  createdAt: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  organization?: string | null;
  role?: UserRole;
}
