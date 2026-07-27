import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/authservices";
import MessageBanner from "../components/MessageBanner";
import { isValidEmail } from "../utils/validtors";
import { ROUTES } from "../utils/constants";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const addresses = email
      .split(/[;,\n]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (addresses.length === 0) {
      setError("Enter at least one valid email address.");
      return;
    }

    const invalidEmail = addresses.find((address) => !isValidEmail(address));
    if (invalidEmail) {
      setError(`Enter valid email addresses. The address "${invalidEmail}" is invalid.`);
      return;
    }

    setSubmitting(true);
    const result = await authService.requestPasswordReset(email);
    setSubmitting(false);

    if (result.success) {
      navigate(`${ROUTES.forgotPasswordVerify}?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error ?? "Unable to send recovery code.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Reset password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your email and we&apos;ll send you a recovery code.
        </p>
      </div>

      {error && (
        <MessageBanner tone="error" compact>
          {error}
        </MessageBanner>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Send recovery code"}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link
          to={ROUTES.login}
          className="font-semibold text-green-700 hover:text-green-800"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
