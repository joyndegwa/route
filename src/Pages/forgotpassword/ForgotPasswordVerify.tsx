import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../Services/authservices";
import MessageBanner from "../../components/MessageBanner";
import { isValidEmail } from "../../utils/validtors";
import { ROUTES } from "../../utils/constants";

export default function ForgotPasswordVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!code.trim()) {
      setError("Enter the recovery code.");
      return;
    }

    setSubmitting(true);
    const result = await authService.verifyRecoveryCode(email, code.trim());
    setSubmitting(false);

    if (result.success) {
      setMessage("Code verified! You are now signed in. You can update your password from your profile.");
      setTimeout(() => navigate(ROUTES.profile), 2000);
    } else {
      setError(result.error ?? "Invalid or expired code.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Verify recovery code</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      {error && (
        <MessageBanner tone="error" compact>
          {error}
        </MessageBanner>
      )}
      {message && (
        <MessageBanner tone="success" compact>
          {message}
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="code"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Recovery code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-2xl tracking-widest text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          placeholder="123456"
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Verifying…" : "Verify code"}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link
          to={ROUTES.forgotPassword}
          className="font-semibold text-green-700 hover:text-green-800"
        >
          Back to forgot password
        </Link>
      </p>
    </form>
  );
}
