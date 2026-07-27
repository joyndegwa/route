import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { recycleService } from "../Services/recycleservice";
import { repairService } from "../Services/repairservice";
import { Link } from "react-router-dom";
import MessageBanner from "../components/MessageBanner";
import StatCard from "../components/StatCard";
import { getErrorMessage } from "../utils/errors";
import { productStatusLabel } from "../utils/formatters";
import { ROUTES } from "../utils/constants";
import type { Product } from "../types/product";

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeRepairs, setActiveRepairs] = useState(0);
  const [points, setPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      productService.listForOwner(user.id),
      repairService.listForRequester(user.id),
      recycleService.listForUser(user.id),
    ])
      .then(([ownedProducts, repairs, recycles]) => {
        setProducts(ownedProducts);
        setActiveRepairs(repairService.countActive(repairs));
        setPoints(recycleService.totalEarnedPoints(recycles));
      })
      .catch((err: unknown) =>
        setError(getErrorMessage(err, "Failed to load data")),
      );
  }, [user]);

  const summary = productService.summarizeByStatus(products);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""}
        </h1>
        <p className="text-slate-500">
          Your products and sustainability impact.
        </p>
      </div>

      {error && <MessageBanner tone="warning">{error}</MessageBanner>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My products" value={products.length} icon="📱" />
        <StatCard label="Active repairs" value={activeRepairs} icon="🔧" />
        <StatCard label="Recycled" value={summary.recycled} icon="♻️" />
        <StatCard label="Green points" value={points} hint="From recycling" icon="⭐" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              My products
            </h2>
            <Link
              to={ROUTES.registerDevice}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              + Register
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-slate-500">
              No products registered yet.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-green-200 hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.manufacturer} · {product.serialNumber}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {productStatusLabel(product.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white shadow-sm ring-1 ring-green-500">
          <h3 className="text-lg font-semibold">Quick actions</h3>
          <p className="mt-1 text-sm text-green-100">
            Scan a device or request recycling.
          </p>
          <div className="mt-4 space-y-2">
            <Link
              to={ROUTES.scan}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/30"
            >
              🔍 Scan device
            </Link>
            <Link
              to={ROUTES.recycling}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/30"
            >
              ♻️ Recycle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
