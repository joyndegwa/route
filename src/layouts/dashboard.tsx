import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME, ROUTES } from "../utils/constants";
import { initials, roleLabel } from "../utils/formatters";

const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: "Overview", end: true },
  { to: ROUTES.repairs, label: "Repairs" },
  { to: ROUTES.recycling, label: "Recycling" },
  { to: ROUTES.profile, label: "Profile" },
];

export default function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.login);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-60 flex-col bg-slate-900 text-white">
        <Link
          to={ROUTES.home}
          className="border-b border-slate-800 px-6 py-5 text-xl font-bold text-green-400"
        >
          {APP_NAME}
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-green-500 text-sm font-semibold">
              {initials(profile?.fullName || profile?.email || "?")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {profile?.fullName || profile?.email}
              </p>
              <p className="text-xs text-slate-400">
                {profile ? roleLabel(profile.role) : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
