import type { UserRole } from "../types/user";
import type { ProductStatus, RecycleStatus } from "../types/product";
import type { RepairStatus } from "../types/repair";

export const APP_NAME = "Re-Trace";
export const APP_TAGLINE = "Digital Product Passport & E-Waste Management System";

export const USER_ROLES: UserRole[] = ["client", "industry", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  industry: "Industry Partner",
  admin: "Administrator",
};

export const PRODUCT_STATUSES: ProductStatus[] = [
  "active",
  "in_repair",
  "recycled",
  "retired",
];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Active",
  in_repair: "In Repair",
  recycled: "Recycled",
  retired: "Retired",
};

export const REPAIR_STATUSES: RepairStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "rejected",
];

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

export const RECYCLE_STATUS_LABELS: Record<RecycleStatus, string> = {
  requested: "Requested",
  collected: "Collected",
  processed: "Processed",
};

export const RECYCLE_METHODS = [
  "Drop-off Point",
  "Scheduled Pickup",
  "Mail-in",
] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  forgotPasswordVerify: "/forgot-password/verify",
  dashboard: "/dashboard",
  adminDashboard: "/dashboard/admin",
  clientDashboard: "/dashboard/client",
  industryDashboard: "/dashboard/industry",
  profile: "/dashboard/profile",
  repairs: "/dashboard/repairs",
  recycling: "/dashboard/recycling",
  passport: "/passport",
  registerDevice: "/dashboard/devices/register",
  scan: "/dashboard/scan",
} as const;

/** Points awarded to a user for recycling a product. */
export const RECYCLE_POINTS_PER_ITEM = 50;
