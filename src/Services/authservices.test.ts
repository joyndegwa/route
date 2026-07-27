import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authservices";
import { auth } from "../lib/auth";
import { userRepo } from "../lib/user";

vi.mock("../lib/auth", () => ({
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    sendRecoveryCode: vi.fn(),
    verifyOtp: vi.fn(),
    getSession: vi.fn(),
  },
}));

vi.mock("../lib/user", () => ({
  userRepo: {
    getById: vi.fn(),
    insert: vi.fn(),
  },
}));

const mockedAuth = vi.mocked(auth);
const mockedUserRepo = vi.mocked(userRepo);

beforeEach(() => {
  vi.clearAllMocks();
  mockedUserRepo.getById.mockResolvedValue(null);
  mockedUserRepo.insert.mockResolvedValue({
    id: "user-1",
    email: "a@b.com",
    fullName: "",
    role: "client",
    organization: null,
    createdAt: new Date().toISOString(),
  });
});

describe("authService.login", () => {
  it("returns success when there is no error", async () => {
    mockedAuth.signIn.mockResolvedValue({} as never);
    mockedAuth.getSession.mockResolvedValue({ data: { session: { user: { id: "user-1", email: "a@b.com", user_metadata: {} } } }, error: null } as never);
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
    mockedAuth.signIn.mockRejectedValue(new Error("Invalid credentials"));
    const result = await authService.login({
      email: "a@b.com",
      password: "x",
    });
    expect(result).toEqual({ success: false, error: "Invalid credentials" });
  });
});

describe("authService.register", () => {
  it("reports success when sign-up succeeds", async () => {
    mockedAuth.signUp.mockResolvedValue({} as never);
    mockedAuth.getSession.mockResolvedValue({ data: { session: { user: { id: "user-1", email: "a@b.com", user_metadata: {} } } }, error: null } as never);
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

  it("surfaces the backend error message on registration failure", async () => {
    mockedAuth.signUp.mockRejectedValue(new Error("Email already registered"));
    const result = await authService.register({
      email: "a@b.com",
      password: "abc12345",
      fullName: "Ada",
      role: "client" as const,
    });
    expect(result).toEqual({ success: false, error: "Email already registered" });
  });
});

describe("authService.logout", () => {
  it("reports success", async () => {
    mockedAuth.signOut.mockResolvedValue({} as never);
    expect(await authService.logout()).toEqual({ success: true, error: null });
  });
});

describe("authService.requestPasswordReset", () => {
  it("sends recovery code and reports success", async () => {
    mockedAuth.sendRecoveryCode.mockResolvedValue({ error: null } as never);
    const result = await authService.requestPasswordReset("a@b.com");
    expect(result.success).toBe(true);
    expect(mockedAuth.sendRecoveryCode).toHaveBeenCalledWith("a@b.com");
  });

  it("sends reset requests to every valid email address entered", async () => {
    mockedAuth.sendRecoveryCode.mockResolvedValue({ error: null } as never);

    const result = await authService.requestPasswordReset(
      "a@b.com, b@c.com; d@e.com",
    );

    expect(result.success).toBe(true);
    expect(mockedAuth.sendRecoveryCode).toHaveBeenCalledTimes(3);
    expect(mockedAuth.sendRecoveryCode).toHaveBeenNthCalledWith(1, "a@b.com");
    expect(mockedAuth.sendRecoveryCode).toHaveBeenNthCalledWith(2, "b@c.com");
    expect(mockedAuth.sendRecoveryCode).toHaveBeenNthCalledWith(3, "d@e.com");
  });
});

describe("authService.verifyRecoveryCode", () => {
  it("returns success when OTP is valid", async () => {
    mockedAuth.verifyOtp.mockResolvedValue({ error: null } as never);
    const result = await authService.verifyRecoveryCode("a@b.com", "123456");
    expect(result).toEqual({ success: true, error: null });
    expect(mockedAuth.verifyOtp).toHaveBeenCalledWith("a@b.com", "123456");
  });

  it("surfaces the error message on invalid code", async () => {
    mockedAuth.verifyOtp.mockRejectedValue(new Error("Invalid code"));
    const result = await authService.verifyRecoveryCode("a@b.com", "000000");
    expect(result).toEqual({ success: false, error: "Invalid code" });
  });
});
