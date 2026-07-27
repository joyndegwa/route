import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { productService } from "../../Services/productservice";
import MessageBanner from "../../components/MessageBanner";
import { getErrorMessage } from "../../utils/errors";
import type { CreateProductInput, Product } from "../../types/product";

const CATEGORIES = [
  "Smartphone",
  "Laptop",
  "Tablet",
  "Washing Machine",
  "Refrigerator",
  "Television",
  "Air Conditioner",
  "Other",
] as const;

export default function RegisterDevice() {
  const { user } = useAuth();
  const [form, setForm] = useState<CreateProductInput>({
    name: "",
    category: "Smartphone",
    manufacturer: "",
    serialNumber: "",
    manufactureDate: null,
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    productService
      .listForOwner(user.id)
      .then(setDevices)
      .catch((err) => setError(getErrorMessage(err, "Failed to load devices")));
  }, [user]);

  const [devices, setDevices] = useState<Product[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await productService.register(user.id, form);
      setMessage("Device registered successfully!");
      setForm({
        name: "",
        category: "Smartphone",
        manufacturer: "",
        serialNumber: "",
        manufactureDate: null,
        description: "",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to register device"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Devices</h1>
        <p className="text-slate-500">
          Register and manage your devices for tracking and support.
        </p>
      </div>

      {error && <MessageBanner tone="error">{error}</MessageBanner>}
      {message && <MessageBanner tone="success">{message}</MessageBanner>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Register new device
          </h2>

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Device name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              placeholder="e.g. iPhone 14"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="manufacturer"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Manufacturer
            </label>
            <input
              id="manufacturer"
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              placeholder="e.g. Apple"
              required
            />
          </div>

          <div>
            <label
              htmlFor="serialNumber"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Serial number
            </label>
            <input
              id="serialNumber"
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              placeholder="SN-123456"
              required
            />
          </div>

          <div>
            <label
              htmlFor="manufactureDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Manufacture date
            </label>
            <input
              id="manufactureDate"
              type="date"
              value={form.manufactureDate ?? ""}
              onChange={(e) =>
                setForm({ ...form, manufactureDate: e.target.value || null })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
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
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              placeholder="Condition, model notes..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Registering…" : "Register device"}
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Registered devices
          </h2>
          {devices.length === 0 ? (
            <p className="text-sm text-slate-500">No devices registered yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {devices.map((device) => (
                <li key={device.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {device.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {device.manufacturer} · {device.serialNumber}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {device.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
