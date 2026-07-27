import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../Services/productservice";
import { recycleService } from "../Services/recycleservice";
import { shopService } from "../Services/shopservice";
import MessageBanner from "../components/MessageBanner";
import GoogleMap from "../components/GoogleMap";
import { RECYCLE_METHODS } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";
import { formatDate, recycleStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";
import type { RecycleRecord } from "../types/product";
import type { Shop } from "../types/shop";

export default function RecyclingPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState<RecycleRecord[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [productId, setProductId] = useState("");
  const [method, setMethod] = useState<string>(RECYCLE_METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const load = async (userId: string) => {
    try {
      const [owned, existing] = await Promise.all([
        productService.listForOwner(userId),
        recycleService.listForUser(userId),
      ]);
      setProducts(owned);
      setRecords(existing);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load records"));
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
            .listRecycle(latitude, longitude)
            .then(setShops)
            .catch(() => setShops([]));
        },
        () => {
          shopService.listRecycle().then(setShops).catch(() => setShops([]));
        },
      );
    } else {
      shopService.listRecycle().then(setShops).catch(() => setShops([]));
    }
  }, []);

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
      setError(getErrorMessage(err, "Failed to submit request"));
    } finally {
      setSubmitting(false);
    }
  };

  const points = recycleService.totalEarnedPoints(records);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recycling</h1>
        <p className="text-slate-500">
          Responsibly recycle products and earn green points.
        </p>
      </div>

      {error && <MessageBanner tone="error">{error}</MessageBanner>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white shadow-sm ring-1 ring-green-500">
          <p className="text-sm text-green-100">Your green points</p>
          <p className="mt-1 text-4xl font-bold">{points}</p>
          <p className="mt-1 text-sm text-green-200">Earned from recycling</p>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Recycle a product
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
                htmlFor="method"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Method
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
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
              className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Request recycling"}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recycling history
          </h2>
        </div>
        {records.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-slate-500">No recycling records yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{record.method}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(record.createdAt)} · {record.points} pts
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {recycleStatusLabel(record.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Nearby recycling centres
        </h2>
        {shops.length === 0 ? (
          <p className="text-sm text-slate-500">No recycling centres found nearby.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-green-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      ♻️
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{shop.name}</p>
                      <p className="text-xs text-slate-500">{shop.address}</p>
                      {shop.hours && (
                        <p className="text-xs text-slate-500">{shop.hours}</p>
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
