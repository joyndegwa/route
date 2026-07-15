import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import { formatDate, repairStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";
import type { Repair } from "../types/repair";

export default function RepairPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async (userId: string) => {
    try {
      const [owned, existing] = await Promise.all([
        productService.listForOwner(userId),
        repairService.listForRequester(userId),
      ]);
      setProducts(owned);
      setRepairs(existing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repairs");
    }
  };

  useEffect(() => {
    if (user) void load(user.id);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !productId || !description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await repairService.request(user.id, { productId, description });
      setDescription("");
      setProductId("");
      await load(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Repairs</h1>
        <p className="text-slate-500">Request and track product repairs.</p>
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-lg font-semibold">New repair request</h2>
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
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !productId || !description.trim()}
          className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">My repair requests</h2>
        {repairs.length === 0 ? (
          <p className="text-sm text-slate-500">No repair requests yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {repairs.map((repair) => (
              <li key={repair.id} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{repair.description}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {repairStatusLabel(repair.status)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Requested {formatDate(repair.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
