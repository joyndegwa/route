import { describe, it, expect } from "vitest";
import {
  isNonEmpty,
  isValid,
  isValidEmail,
  isValidPassword,
  isValidRole,
  validateProduct,
  validateSignIn,
  validateSignUp,
} from "./validtors";

describe("isValidEmail", () => {
  it("accepts well-formed addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("  spaced@example.io  ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("no-at-sign")).toBe(false);
    expect(isValidEmail("missing@tld")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("requires 8+ chars with a letter and a number", () => {
    expect(isValidPassword("abc12345")).toBe(true);
  });

  it("rejects weak passwords", () => {
    expect(isValidPassword("short1")).toBe(false);
    expect(isValidPassword("allletters")).toBe(false);
    expect(isValidPassword("12345678")).toBe(false);
  });
});

describe("isNonEmpty", () => {
  it("treats whitespace-only as empty", () => {
    expect(isNonEmpty("  ")).toBe(false);
    expect(isNonEmpty("")).toBe(false);
    expect(isNonEmpty(null)).toBe(false);
    expect(isNonEmpty("x")).toBe(true);
  });
});

describe("isValidRole", () => {
  it("only accepts known roles", () => {
    expect(isValidRole("admin")).toBe(true);
    expect(isValidRole("client")).toBe(true);
    expect(isValidRole("superuser")).toBe(false);
  });
});

describe("validateSignUp", () => {
  it("passes for valid input", () => {
    const errors = validateSignUp({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "abc12345",
      role: "client",
    });
    expect(isValid(errors)).toBe(true);
  });

  it("collects an error per invalid field", () => {
    const errors = validateSignUp({
      fullName: "",
      email: "bad",
      password: "weak",
      role: "nope",
    });
    expect(isValid(errors)).toBe(false);
    expect(errors).toHaveProperty("fullName");
    expect(errors).toHaveProperty("email");
    expect(errors).toHaveProperty("password");
    expect(errors).toHaveProperty("role");
  });
});

describe("validateSignIn", () => {
  it("passes for valid input", () => {
    expect(
      isValid(validateSignIn({ email: "a@b.com", password: "anything" })),
    ).toBe(true);
  });

  it("flags a bad email and missing password", () => {
    const errors = validateSignIn({ email: "bad", password: "" });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

describe("validateProduct", () => {
  it("passes when all required fields are present", () => {
    expect(
      isValid(
        validateProduct({
          name: "Laptop",
          category: "Computer",
          manufacturer: "Acme",
          serialNumber: "SN-1",
        }),
      ),
    ).toBe(true);
  });

  it("flags every missing required field", () => {
    const errors = validateProduct({
      name: "",
      category: "  ",
      manufacturer: "",
      serialNumber: "",
    });
    expect(errors.name).toBeDefined();
    expect(errors.category).toBeDefined();
    expect(errors.manufacturer).toBeDefined();
    expect(errors.serialNumber).toBe("Serial number is required.");
  });
});
