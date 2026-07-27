import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-green-400">Re-Trace</h1>
          <p className="text-xl text-slate-300">
            Digital Product Passport & E-Waste Management System
          </p>
          <p className="text-slate-400">
            Track, repair, and recycle your devices sustainably.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Create account
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-3xl">📱</p>
            <h3 className="mt-2 font-semibold text-white">Register Devices</h3>
            <p className="mt-1 text-sm text-slate-400">
              Track all your electronics in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-3xl">🔍</p>
            <h3 className="mt-2 font-semibold text-white">Scan & Diagnose</h3>
            <p className="mt-1 text-sm text-slate-400">
              Detect issues and find nearby repair shops.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-3xl">♻️</p>
            <h3 className="mt-2 font-semibold text-white">Recycle Smart</h3>
            <p className="mt-1 text-sm text-slate-400">
              Earn green points for responsible recycling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
