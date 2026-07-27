import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../Services/authservices";
import MessageBanner from "../components/MessageBanner";
import { validateSignIn, isValid } from "../utils/validtors";
import type { FieldErrors } from "../utils/validtors";
import { ROUTES } from "../utils/constants";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateSignIn({ email, password });
    setErrors(validation);
    if (!isValid(validation)) return;

    setSubmitting(true);
    const result = await authService.login({ email, password });
    setSubmitting(false);

    if (result.success) {
      if (user) {
        navigate(ROUTES.dashboard, { replace: true });
      } else {
        window.location.href = ROUTES.dashboard;
      }
    } else {
      const errorMessage =
        typeof result.error === "string" && result.error.trim().length > 0
          ? result.error
          : "Unable to sign in. Please try again.";
      setFormError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage your devices
        </p>
      </div>

      {formError && (
        <MessageBanner tone="error" compact>
          {formError}
        </MessageBanner>
      )}

      <div className="flex justify-center">
        <img
          src="/retrace-circuit.jpg"
          alt="Re-Trace circuit"
          className="h-32 w-32 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email address
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

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        error={errors.password}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link
          to={ROUTES.forgotPassword}
          className="font-medium text-green-700 hover:text-green-800"
        >
          Forgot password?
        </Link>
        <Link
          to={ROUTES.register}
          className="font-medium text-green-700 hover:text-green-800"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}
