import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../Services/authservices";
import MessageBanner from "../components/MessageBanner";
import { isValidEmail } from "../utils/validtors";
import { ROUTES } from "../utils/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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

    setSubmitting(true);
    const result = await authService.requestPasswordReset(email);
    setSubmitting(false);

    if (result.success) {
      setMessage("If an account exists, a reset link has been sent.");
    } else {
      setError(result.error ?? "Unable to send reset email.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-slate-900">
      <h2 className="text-2xl font-semibold">Reset password</h2>
      <p className="text-sm text-slate-600">
        Enter your email and we'll send you a reset link.
      </p>

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
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-green-500 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link to={ROUTES.login} className="text-green-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
