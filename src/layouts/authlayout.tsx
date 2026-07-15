import { Link, Outlet } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, ROUTES } from "../utils/constants";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to={ROUTES.home}
            className="text-3xl font-bold text-green-400"
          >
            {APP_NAME}
          </Link>
          <p className="mt-2 text-sm text-slate-400">{APP_TAGLINE}</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
