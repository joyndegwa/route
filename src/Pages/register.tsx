import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/authservices";
import MessageBanner from "../components/MessageBanner";
import { validateSignUp, isValid } from "../utils/validtors";
import type { FieldErrors } from "../utils/validtors";
import { ROLE_LABELS, ROUTES, USER_ROLES } from "../utils/constants";
import type { UserRole } from "../types/user";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);

    const validation = validateSignUp({
      fullName,
      email,
      password,
      confirmPassword,
      role,
      phone,
    });
    setErrors(validation);
    if (!isValid(validation)) return;

    setSubmitting(true);
    const result = await authService.register({
      email,
      password,
      fullName,
      role,
      phone,
    });
    setSubmitting(false);

    if (result.success) {
      setMessage("Account created successfully. You can sign in now.");
      setTimeout(() => navigate(ROUTES.login), 1500);
    } else {
      const errorMessage =
        typeof result.error === "string" && result.error.trim().length > 0
          ? result.error
          : "Unable to register. Please try again.";
      setFormError(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      noValidate
      className="space-y-5"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Join Re-Trace and start tracking your products
        </p>
      </div>

      {formError && (
        <MessageBanner tone="error" compact>
          {formError}
        </MessageBanner>
      )}
      {message && (
        <MessageBanner tone="success" compact>
          {message}
        </MessageBanner>
      )}

      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Full name
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          placeholder="Jane Doe"
        />
        {errors.fullName && (
          <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          placeholder="+1 234 567 8900"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        error={errors.password}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="••••••••"
        error={errors.confirmPassword}
      />

      <div>
        <label
          htmlFor="role"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Account type
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
        >
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Creating…" : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to={ROUTES.login}
          className="font-semibold text-green-700 hover:text-green-800"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
