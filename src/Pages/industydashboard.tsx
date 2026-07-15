import { useEffect, useState } from "react";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import StatCard from "../components/StatCard";
import { formatCurrency, repairStatusLabel } from "../utils/formatters";
import type { Repair } from "../types/repair";

export default function IndustryDashboard() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([repairService.listAll(), productService.listAll()])
      .then(([allRepairs, allProducts]) => {
        setRepairs(allRepairs);
        setProductCount(allProducts.length);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load data"),
      );
  }, []);

  const active = repairService.countActive(repairs);
  const revenue = repairService.totalCompletedCost(repairs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Industry dashboard</h1>
        <p className="text-slate-500">Repairs and products across the network.</p>
      </div>

      {error && (
        <p className="rounded bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tracked products" value={productCount} />
        <StatCard label="Total repairs" value={repairs.length} />
        <StatCard label="Active repairs" value={active} />
        <StatCard label="Completed revenue" value={formatCurrency(revenue)} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">Repair queue</h2>
        {repairs.length === 0 ? (
          <p className="text-sm text-slate-500">No repair requests yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {repairs.map((repair) => (
              <li
                key={repair.id}
                className="flex items-center justify-between py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{repair.description}</p>
                  <p className="text-xs text-slate-500">
                    Product {repair.productId}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {repairStatusLabel(repair.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
