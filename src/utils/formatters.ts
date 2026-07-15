import {
  PRODUCT_STATUS_LABELS,
  RECYCLE_STATUS_LABELS,
  REPAIR_STATUS_LABELS,
  ROLE_LABELS,
} from "./constants";
import type { ProductStatus, RecycleStatus } from "../types/product";
import type { RepairStatus } from "../types/repair";
import type { UserRole } from "../types/user";

/** Format an ISO date string as a human-readable date (e.g. "Jan 5, 2024"). */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format a number as USD currency. */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Turn a snake_case or space-separated string into Title Case. */
export function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Truncate text to a maximum length, appending an ellipsis when cut. */
export function truncate(value: string, maxLength = 40): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/** Build initials from a full name (e.g. "Ada Lovelace" -> "AL"). */
export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export function productStatusLabel(status: ProductStatus): string {
  return PRODUCT_STATUS_LABELS[status] ?? titleCase(status);
}

export function repairStatusLabel(status: RepairStatus): string {
  return REPAIR_STATUS_LABELS[status] ?? titleCase(status);
}

export function recycleStatusLabel(status: RecycleStatus): string {
  return RECYCLE_STATUS_LABELS[status] ?? titleCase(status);
}

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? titleCase(role);
}
