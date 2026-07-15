import { USER_ROLES } from "./constants";
import type { UserRole } from "../types/user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * A password is valid when it is at least 8 characters long and contains at
 * least one letter and one number.
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function isNonEmpty(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidRole(role: string): role is UserRole {
  return (USER_ROLES as string[]).includes(role);
}

export interface FieldErrors {
  [field: string]: string;
}

export interface SignUpFields {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

/** Validate registration form fields, returning a map of field -> message. */
export function validateSignUp(fields: SignUpFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!isNonEmpty(fields.fullName)) {
    errors.fullName = "Full name is required.";
  }
  if (!isValidEmail(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!isValidPassword(fields.password)) {
    errors.password =
      "Password must be at least 8 characters and include a letter and a number.";
  }
  if (!isValidRole(fields.role)) {
    errors.role = "Select a valid role.";
  }

  return errors;
}

export interface SignInFields {
  email: string;
  password: string;
}

/** Validate login form fields, returning a map of field -> message. */
export function validateSignIn(fields: SignInFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!isValidEmail(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!isNonEmpty(fields.password)) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
