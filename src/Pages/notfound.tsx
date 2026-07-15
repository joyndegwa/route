import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-center text-white">
      <p className="text-6xl font-bold text-green-400">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to={ROUTES.home}
        className="mt-6 rounded-lg bg-green-500 px-6 py-3 font-medium hover:bg-green-600"
      >
        Back to home
      </Link>
    </div>
  );
}
