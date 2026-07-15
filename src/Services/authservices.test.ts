import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authservices";
import { auth } from "../lib/auth";

vi.mock("../lib/auth", () => ({
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

const mockedAuth = vi.mocked(auth);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authService.login", () => {
  it("returns success when there is no error", async () => {
    mockedAuth.signIn.mockResolvedValue({ error: null } as never);
    const result = await authService.login({
      email: "a@b.com",
      password: "x",
    });
    expect(result).toEqual({ success: true, error: null });
    expect(mockedAuth.signIn).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "x",
    });
  });

  it("surfaces the error message on failure", async () => {
    mockedAuth.signIn.mockResolvedValue({
      error: { message: "Invalid credentials" },
    } as never);
    const result = await authService.login({
      email: "a@b.com",
      password: "x",
    });
    expect(result).toEqual({ success: false, error: "Invalid credentials" });
  });
});

describe("authService.register", () => {
  it("passes the sign-up payload through and reports success", async () => {
    mockedAuth.signUp.mockResolvedValue({ error: null } as never);
    const input = {
      email: "a@b.com",
      password: "abc12345",
      fullName: "Ada",
      role: "client" as const,
    };
    const result = await authService.register(input);
    expect(result.success).toBe(true);
    expect(mockedAuth.signUp).toHaveBeenCalledWith(input);
  });
});

describe("authService.logout", () => {
  it("reports success", async () => {
    mockedAuth.signOut.mockResolvedValue({ error: null } as never);
    expect(await authService.logout()).toEqual({ success: true, error: null });
  });
});

describe("authService.requestPasswordReset", () => {
  it("forwards email and redirect and reports success", async () => {
    mockedAuth.resetPassword.mockResolvedValue({ error: null } as never);
    const result = await authService.requestPasswordReset(
      "a@b.com",
      "https://app/reset",
    );
    expect(result.success).toBe(true);
    expect(mockedAuth.resetPassword).toHaveBeenCalledWith(
      "a@b.com",
      "https://app/reset",
    );
  });
});
