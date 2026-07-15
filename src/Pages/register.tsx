import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/authservices";
import { validateSignUp, isValid } from "../utils/validtors";
import type { FieldErrors } from "../utils/validtors";
import { ROLE_LABELS, ROUTES, USER_ROLES } from "../utils/constants";
import type { UserRole } from "../types/user";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);

    const validation = validateSignUp({ fullName, email, password, role });
    setErrors(validation);
    if (!isValid(validation)) return;

    setSubmitting(true);
    const result = await authService.register({
      email,
      password,
      fullName,
      role,
    });
    setSubmitting(false);

    if (result.success) {
      setMessage("Registration successful! Check your email to verify.");
      setTimeout(() => navigate(ROUTES.login), 1500);
    } else {
      setFormError(result.error ?? "Unable to register.");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      noValidate
      className="space-y-4 text-slate-900"
    >
      <h2 className="text-2xl font-semibold">Create account</h2>

      {formError && (
        <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-600">
          {formError}
        </p>
      )}
      {message && (
        <p className="rounded bg-green-50 p-2 text-sm text-green-700">
          {message}
        </p>
      )}

      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium">
          Account type
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-xs text-red-600">{errors.role}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="text-green-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
