import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userRepo } from "../lib/user";
import { roleLabel } from "../utils/formatters";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
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
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        {message && (
          <p className="rounded bg-green-50 p-2 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <input
            value={profile ? roleLabel(profile.role) : ""}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
          />
        </div>

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
        </div>

        <div>
          <label
            htmlFor="organization"
            className="mb-1 block text-sm font-medium"
          >
            Organization
          </label>
          <input
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
