import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/authservices";
import MessageBanner from "../components/MessageBanner";
import { validateSignIn, isValid } from "../utils/validtors";
import type { FieldErrors } from "../utils/validtors";
import { ROUTES } from "../utils/constants";

export default function Login() {
  const navigate = useNavigate();
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
      navigate(ROUTES.dashboard);
    } else {
      setFormError(result.error ?? "Unable to sign in.");
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate className="space-y-4 text-slate-900">
      <h2 className="text-2xl font-semibold">Sign in</h2>

      {formError && (
        <MessageBanner tone="error" compact>
          {formError}
        </MessageBanner>
      )}

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

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-green-500 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <div className="flex justify-between text-sm text-slate-600">
        <Link to={ROUTES.forgotPassword} className="hover:text-green-600">
          Forgot password?
        </Link>
        <Link to={ROUTES.register} className="hover:text-green-600">
          Create account
        </Link>
      </div>
    </form>
  );
}
