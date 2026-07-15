import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { recycleService } from "../Services/recycleservice";
import { repairService } from "../Services/repairservice";
import StatCard from "../components/StatCard";
import RegisterDeviceForm from "../components/RegisterDeviceForm";
import { productStatusLabel } from "../utils/formatters";
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
        setError(err instanceof Error ? err.message : "Failed to load data"),
      );
  }, [user]);

  const summary = productService.summarizeByStatus(products);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""}
        </h1>
        <p className="text-slate-500">Your products and sustainability impact.</p>
      </div>

      {error && (
        <p className="rounded bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My products" value={products.length} />
        <StatCard label="Active repairs" value={activeRepairs} />
        <StatCard label="Recycled" value={summary.recycled} />
        <StatCard label="Green points" value={points} hint="From recycling" />
      </div>

      {user && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <RegisterDeviceForm
            ownerId={user.id}
            onRegistered={(product) =>
              setProducts((prev) => [product, ...prev])
            }
          />
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">My products</h2>
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">
            No products registered yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    {product.manufacturer} · {product.serialNumber}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {productStatusLabel(product.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
