import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const FEATURES = [
  {
    title: "Digital Product Passports",
    body: "Every device gets a scannable QR passport with its full history, from manufacture to recycling.",
    icon: (
      <path d="M4 5h6v6H4V5zm0 8h6v6H4v-6zm8-8h8v3h-8V5zm0 5h4v4h-4v-4zm6 0h2v9h-8v-2h6v-7z" />
    ),
  },
  {
    title: "Repairs & Lifecycle",
    body: "Request repairs, track status in real time, and extend the life of every product you own.",
    icon: (
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
    ),
  },
  {
    title: "Recycle & Earn",
    body: "Recycle responsibly and earn green points for every item diverted from landfill.",
    icon: (
      <path d="M12 2l3 5h-2v4h-2V7H9l3-5zM5 13l-3 5 3 5 2-1-2.5-4L7 14l-2-1zm14 0l-2 1 1.5 2.5L16 20l2 1 3-5-3-3z" />
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-900 text-white">
      <section className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div className="animate-fade-in-up space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300 ring-1 ring-green-500/30">
            <span className="h-2 w-2 animate-blink rounded-full bg-green-400" />
            Live sustainability tracking
          </span>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            <span className="text-gradient-eco">Re-Trace</span>
          </h1>
          <p className="text-xl text-slate-300">
            Digital Product Passport &amp; E-Waste Management System — track,
            repair, and recycle electronics for a circular economy.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={ROUTES.login}
              className="animate-pulse-glow rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
            >
              Login
            </Link>
            <Link
              to={ROUTES.register}
              className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="animate-float">
          <img
            src="/hero-recycle.png"
            alt="Electronics being disassembled inside a green recycling loop"
            className="w-full rounded-2xl shadow-2xl ring-1 ring-green-500/20"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-slate-800/60 p-6 ring-1 ring-slate-700 transition hover:-translate-y-1 hover:ring-green-500/50"
            >
              <div className="mb-4 inline-flex rounded-xl bg-green-500/10 p-3 text-green-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
