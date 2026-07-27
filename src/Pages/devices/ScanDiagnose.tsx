import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { productService } from "../../Services/productservice";
import { shopService } from "../../Services/shopservice";
import MessageBanner from "../../components/MessageBanner";
import GoogleMap from "../../components/GoogleMap";
import { getErrorMessage } from "../../utils/errors";
import type { Product } from "../../types/product";
import type { Shop } from "../../types/shop";

type ScanStatus = "idle" | "scanning" | "done" | "error";

interface Problem {
  title: string;
  severity: "low" | "medium" | "high";
  fix: string;
}

const MOCK_PROBLEMS: Record<string, Problem[]> = {
  Smartphone: [
    { title: "Battery health degraded", severity: "medium", fix: "Replace battery or enable optimized charging." },
    { title: "Storage nearly full", severity: "low", fix: "Free up space or backup photos." },
  ],
  Laptop: [
    { title: "Fan dust buildup", severity: "medium", fix: "Clean fan vents and replace thermal paste." },
    { title: "OS update pending", severity: "low", fix: "Install latest OS security patches." },
  ],
  default: [
    { title: "General wear detected", severity: "low", fix: "Schedule a check-up at a nearby repair shop." },
    { title: "Power efficiency low", severity: "medium", fix: "Calibrate battery or inspect power adapter." },
  ],
};

export default function ScanDiagnose() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    productService
      .listForOwner(user.id)
      .then(setProducts)
      .catch((err) =>
        setError(getErrorMessage(err, "Failed to load devices")),
      );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          shopService
            .listNearby(latitude, longitude)
            .then(setShops)
            .catch(() => setShops([]));
        },
        () => {
          shopService.listAll().then(setShops).catch(() => setShops([]));
        },
      );
    } else {
      shopService.listAll().then(setShops).catch(() => setShops([]));
    }
  }, [user]);

  const requestScanPermission = () => {
    setShowPermissionModal(true);
  };

  const grantPermission = async () => {
    setShowPermissionModal(false);
    setPermissionGranted(true);

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Re-Trace Scan", {
        body: "Scan permission granted. You can now scan your device.",
        icon: "/retrace-circuit.jpg",
      });
    }

    if (selectedProduct) {
      handleScan();
    }
  };

  const denyPermission = () => {
    setShowPermissionModal(false);
    setPermissionGranted(false);
  };

  const handleScan = async () => {
    if (!selectedProduct) return;
    setStatus("scanning");
    setError(null);
    setProblems([]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) {
      setStatus("error");
      setError("Device not found.");
      return;
    }

    const detected =
      MOCK_PROBLEMS[product.category] || MOCK_PROBLEMS.default;
    setProblems(detected);
    setStatus("done");
  };

  const mapShops: Shop[] = shops.map((shop) => ({
    ...shop,
    distance: shop.distance ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan & Diagnose</h1>
        <p className="text-slate-500">
          Scan your device to detect issues and find nearby repair or recycle shops.
        </p>
      </div>

      {error && <MessageBanner tone="error">{error}</MessageBanner>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Select device
          </h2>

          {products.length === 0 ? (
            <p className="text-sm text-slate-500">
              No devices registered. Register a device first.
            </p>
          ) : (
            <div className="space-y-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                <option value="">Choose a device…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={requestScanPermission}
                disabled={!selectedProduct || status === "scanning"}
                className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "scanning" ? "Scanning…" : "Start Scan"}
              </button>

              {!permissionGranted && status !== "scanning" && status !== "done" && (
                <p className="text-xs text-slate-400">
                  Clicking scan will ask for permission and send a notification to your device.
                </p>
              )}
            </div>
          )}

          {status === "scanning" && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="h-16 w-16 animate-pulse rounded-full bg-green-100" />
              <p className="text-sm text-slate-600">
                Analyzing device components…
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Nearby shops
          </h2>
          {shops.length === 0 ? (
            <p className="text-sm text-slate-500">No nearby shops found.</p>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-green-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        shop.type === "repair"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {shop.type === "repair" ? "🔧" : "♻️"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{shop.name}</p>
                      <p className="text-xs text-slate-500">{shop.address}</p>
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
          )}
        </div>
      </div>

      {status === "done" && problems.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Detected problems & fixes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-slate-900">
                    {problem.title}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                      problem.severity === "low"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : problem.severity === "medium"
                          ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/20"
                    }`}
                  >
                    {problem.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{problem.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Map view
        </h2>
        <GoogleMap shops={mapShops} center={userLocation ?? undefined} />
      </div>

      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Scan Permission Required
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Re-Trace needs your permission to scan the selected device. A notification will be sent to your device to confirm this action.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={denyPermission}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Deny
              </button>
              <button
                type="button"
                onClick={grantPermission}
                className="flex-1 rounded-xl bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700"
              >
                Allow Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
