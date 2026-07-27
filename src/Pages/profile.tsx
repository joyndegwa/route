import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userRepo } from "../lib/user";
import MessageBanner from "../components/MessageBanner";
import { getErrorMessage } from "../utils/errors";
import { roleLabel } from "../utils/formatters";
import PasswordInput from "../components/PasswordInput";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    setFullName(profile?.fullName ?? "");
    setOrganization(profile?.organization ?? "");
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await userRepo.update(user.id, { fullName, organization });
      await refreshProfile();
      setMessage("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save profile"));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordError(null);
    setPasswordMessage(null);

    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { auth } = await import("../lib/auth");
      await auth.updateUser({ password });
      setPasswordMessage("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Failed to update password"));
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500">Manage your account details.</p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        {message && (
          <MessageBanner tone="success" compact>
            {message}
          </MessageBanner>
        )}
        {error && (
          <MessageBanner tone="error" compact>
            {error}
          </MessageBanner>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
          <input
            value={profile ? roleLabel(profile.role) : ""}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <div>
          <label htmlFor="organization" className="mb-1.5 block text-sm font-medium text-slate-700">
            Organization
          </label>
          <input
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordUpdate}
        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
        {passwordMessage && (
          <MessageBanner tone="success" compact>
            {passwordMessage}
          </MessageBanner>
        )}
        {passwordError && (
          <MessageBanner tone="error" compact>
            {passwordError}
          </MessageBanner>
        )}

        <PasswordInput
          id="password"
          label="New password"
          value={password}
          onChange={setPassword}
          placeholder="Enter new password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat new password"
        />

        <button
          type="submit"
          disabled={updatingPassword}
          className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {updatingPassword ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
