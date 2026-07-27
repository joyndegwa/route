import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import { shopService } from "../Services/shopservice";
import MessageBanner from "../components/MessageBanner";
import GoogleMap from "../components/GoogleMap";
import { getErrorMessage } from "../utils/errors";
import { formatDate, repairStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";
import type { Repair } from "../types/repair";
import type { Shop } from "../types/shop";

export default function RepairPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const load = async (userId: string) => {
    try {
      const [owned, existing] = await Promise.all([
        productService.listForOwner(userId),
        repairService.listForRequester(userId),
      ]);
      setProducts(owned);
      setRepairs(existing);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load repairs"));
    }
  };

  useEffect(() => {
    if (user) void load(user.id);
  }, [user]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          shopService
            .listRepair(latitude, longitude)
            .then(setShops)
            .catch(() => setShops([]));
        },
        () => {
          shopService.listRepair().then(setShops).catch(() => setShops([]));
        },
      );
    } else {
      shopService.listRepair().then(setShops).catch(() => setShops([]));
    }
  }, []);

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
      setError(getErrorMessage(err, "Failed to submit request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Repairs</h1>
        <p className="text-slate-500">Request and track product repairs.</p>
      </div>

      {error && <MessageBanner tone="error">{error}</MessageBanner>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            New repair request
          </h2>
          <div>
            <label
              htmlFor="product"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Product
            </label>
            <select
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
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
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              placeholder="Describe the issue..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !productId || !description.trim()}
            className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            My repair requests
          </h2>
          {repairs.length === 0 ? (
            <p className="text-sm text-slate-500">No repair requests yet.</p>
          ) : (
            <div className="space-y-3">
              {repairs.map((repair) => (
                <div
                  key={repair.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-green-200 hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {repair.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      Requested {formatDate(repair.createdAt)}
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

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Nearby repair shops
        </h2>
        {shops.length === 0 ? (
          <p className="text-sm text-slate-500">No repair shops found nearby.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-green-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      🔧
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{shop.name}</p>
                      <p className="text-xs text-slate-500">{shop.address}</p>
                      {shop.phone && (
                        <p className="text-xs text-slate-500">{shop.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {shop.distance !== undefined ? `${shop.distance.toFixed(1)} km` : "—"}
                    </p>
                    <p className="text-xs text-slate-500">⭐ {shop.rating}</p>
                  </div>
                </div>
              ))}
            </div>
            <GoogleMap shops={shops} center={userLocation ?? undefined} />
          </div>
        )}
      </div>
    </div>
  );
}
