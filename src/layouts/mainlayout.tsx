import { Link, Outlet } from "react-router-dom";
import { APP_NAME, ROUTES } from "../utils/constants";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to={ROUTES.home} className="text-xl font-bold text-green-400">
            {APP_NAME}
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to={ROUTES.login} className="hover:text-green-400">
              Login
            </Link>
            <Link to={ROUTES.register} className="hover:text-green-400">
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
