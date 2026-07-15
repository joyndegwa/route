import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { recycleService } from "../Services/recycleservice";
import { RECYCLE_METHODS } from "../utils/constants";
import { formatDate, recycleStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";
import type { RecycleRecord } from "../types/product";

export default function RecyclingPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState<RecycleRecord[]>([]);
  const [productId, setProductId] = useState("");
  const [method, setMethod] = useState<string>(RECYCLE_METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async (userId: string) => {
    try {
      const [owned, existing] = await Promise.all([
        productService.listForOwner(userId),
        recycleService.listForUser(userId),
      ]);
      setProducts(owned);
      setRecords(existing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    }
  };

  useEffect(() => {
    if (user) void load(user.id);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !productId) return;
    setSubmitting(true);
    setError(null);
    try {
      await recycleService.request(user.id, { productId, method });
      setProductId("");
      await load(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const points = recycleService.totalEarnedPoints(records);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recycling</h1>
        <p className="text-slate-500">
          Responsibly recycle products and earn green points.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-xl bg-green-50 p-4 text-green-800">
        You have earned <span className="font-semibold">{points}</span> green
        points.
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-lg font-semibold">Recycle a product</h2>
        <div>
          <label htmlFor="product" className="mb-1 block text-sm font-medium">
            Product
          </label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="method" className="mb-1 block text-sm font-medium">
            Method
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {RECYCLE_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting || !productId}
          className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Request recycling"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">Recycling history</h2>
        {records.length === 0 ? (
          <p className="text-sm text-slate-500">No recycling records yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {records.map((record) => (
              <li
                key={record.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">{record.method}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(record.createdAt)} · {record.points} pts
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {recycleStatusLabel(record.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
