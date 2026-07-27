import { useEffect, useState } from "react";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import MessageBanner from "../components/MessageBanner";
import StatCard from "../components/StatCard";
import { getErrorMessage } from "../utils/errors";
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
        setError(getErrorMessage(err, "Failed to load data")),
      );
  }, []);

  const active = repairService.countActive(repairs);
  const revenue = repairService.totalCompletedCost(repairs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Industry dashboard</h1>
        <p className="text-slate-500">Repairs and products across the network.</p>
      </div>

      {error && <MessageBanner tone="warning">{error}</MessageBanner>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tracked products" value={productCount} icon="📦" />
        <StatCard label="Total repairs" value={repairs.length} icon="🔧" />
        <StatCard label="Active repairs" value={active} icon="⚡" />
        <StatCard label="Completed revenue" value={formatCurrency(revenue)} icon="💰" />
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Repair queue</h2>
        </div>
        {repairs.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-slate-500">No repair requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {repairs.map((repair) => (
              <div
                key={repair.id}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {repair.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Product {repair.productId}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {repairStatusLabel(repair.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
