import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import { APP_NAME, ROUTES } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";
import { formatDate, productStatusLabel, repairStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";
import type { Repair } from "../types/repair";

export default function Passport() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    Promise.all([
      productService.getById(productId),
      repairService.listByProduct(productId),
    ])
      .then(([found, repairHistory]) => {
        setProduct(found);
        setRepairs(repairHistory);
      })
      .catch((err: unknown) =>
        setError(getErrorMessage(err, "Failed to load passport")),
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const passportUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-900 px-4 py-10 text-white">
      <Link to={ROUTES.home} className="mb-8 text-2xl font-bold text-green-400">
        {APP_NAME}
      </Link>

      {loading && <p className="text-slate-400">Loading passport…</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && !product && (
        <p className="text-slate-400">
          No product passport found for this identifier.
        </p>
      )}

      {product && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="rounded-xl bg-white p-6 text-slate-900 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold">{product.name}</h1>
                <p className="text-sm text-slate-500">Digital Product Passport</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {productStatusLabel(product.status)}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Section title="Device Information">
                <Row label="Name" value={product.name} />
                <Row label="Category" value={product.category} />
                <Row label="Manufacturer" value={product.manufacturer} />
                <Row label="Serial number" value={product.serialNumber} />
                <Row label="Manufactured" value={formatDate(product.manufactureDate)} />
                <Row label="Registered" value={formatDate(product.createdAt)} />
                {product.description && (
                  <Row label="Description" value={product.description} />
                )}
              </Section>

              <Section title="Material Composition">
                {product.materialComposition ? (
                  <p className="text-sm text-slate-700">{product.materialComposition}</p>
                ) : (
                  <p className="text-sm text-slate-400">Not specified</p>
                )}
              </Section>

              <Section title="Sustainability Metrics">
                <MetricRow
                  label="Carbon Footprint"
                  value={
                    product.carbonFootprintKg != null
                      ? `${product.carbonFootprintKg.toFixed(1)} kg CO2e`
                      : null
                  }
                />
                <MetricRow
                  label="Circular Economy Score"
                  value={
                    product.circularEconomyScore != null
                      ? `${product.circularEconomyScore}/100`
                      : null
                  }
                  score={product.circularEconomyScore}
                />
                <MetricRow
                  label="Repairability Score"
                  value={
                    product.repairabilityScore != null
                      ? `${product.repairabilityScore}/100`
                      : null
                  }
                  score={product.repairabilityScore}
                />
                <MetricRow
                  label="Estimated Value"
                  value={
                    product.estimatedValue != null
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.estimatedValue)
                      : null
                  }
                />
              </Section>

              <Section title="Repair History" className="sm:col-span-2">
                {repairs.length === 0 ? (
                  <p className="text-sm text-slate-400">No repair records found.</p>
                ) : (
                  <div className="space-y-2">
                    {repairs.map((repair) => (
                      <div
                        key={repair.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {repair.description}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(repair.createdAt)}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {repairStatusLabel(repair.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </dl>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="rounded-lg bg-white p-3">
                <QRCode value={passportUrl} size={128} />
              </div>
              <p className="text-xs text-slate-400">Scan to view this passport</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-100 p-4 ${className ?? ""}`}>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function MetricRow({
  label,
  value,
  score,
}: {
  label: string;
  value: string | null;
  score?: number | null;
}) {
  const colorClass =
    score == null ? "text-slate-500" : score >= 75 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right font-medium ${colorClass}`}>{value ?? "—"}</dd>
    </div>
  );
}
