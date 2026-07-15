import type { UserRole } from "./user";

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  organization?: string | null;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
