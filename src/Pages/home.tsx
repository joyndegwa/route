import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">

      <h1 className="text-5xl font-bold mb-4 text-green-400">
        Re-Trace
      </h1>

      <p className="text-xl text-slate-300 mb-10">
        Digital Product Passport & E-Waste Management System
      </p>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Register
        </Link>

      </div>

    </div>
  );
}