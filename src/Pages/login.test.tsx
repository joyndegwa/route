import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./login";
import { authService } from "../Services/authservices";

const navigate = vi.fn();

let locationHref = "/";

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../Services/authservices", () => ({
  authService: { login: vi.fn() },
}));

const mockUseAuth = vi.hoisted(() =>
  vi.fn(() => ({
    user: null,
    loading: false,
    role: null,
    profile: null,
    session: null,
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
  })),
);

vi.mock("../hooks/useAuth", () => ({
  useAuth: mockUseAuth,
}));

const mockedLogin = vi.mocked(authService.login);

beforeEach(() => {
  vi.clearAllMocks();
  locationHref = "/";
  Object.defineProperty(window, "location", {
    value: {
      get href() {
        return locationHref;
      },
      set href(val: string) {
        locationHref = val;
      },
    },
    writable: true,
  });
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    role: null,
    profile: null,
    session: null,
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
  });
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login", () => {
  it("shows validation errors and does not call the service", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it("submits valid credentials and redirects to the dashboard", async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValue({ success: true, error: null });
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockedLogin).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "secret123",
    });

    expect(window.location.href).toBe("/dashboard");
  });

  it("shows an error banner when the service reports failure", async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValue({ success: false, error: "Nope" });
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Nope");
  });
});
