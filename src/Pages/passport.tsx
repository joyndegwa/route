import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { productService } from "../Services/productservice";
import { APP_NAME, ROUTES } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";
import { formatDate, productStatusLabel } from "../utils/formatters";
import type { Product } from "../types/product";

export default function Passport() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    productService
      .getById(productId)
      .then((found) => setProduct(found))
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
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-xl">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="mb-4 text-sm text-slate-500">
            Digital Product Passport
          </p>

          <dl className="space-y-2 text-sm">
            <Row label="Manufacturer" value={product.manufacturer} />
            <Row label="Category" value={product.category} />
            <Row label="Serial number" value={product.serialNumber} />
            <Row
              label="Status"
              value={productStatusLabel(product.status)}
            />
            <Row
              label="Manufactured"
              value={formatDate(product.manufactureDate)}
            />
            <Row label="Registered" value={formatDate(product.createdAt)} />
          </dl>

          {product.description && (
            <p className="mt-4 text-sm text-slate-600">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-3">
              <QRCode value={passportUrl} size={128} />
            </div>
            <p className="text-xs text-slate-400">Scan to view this passport</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-1">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
