import { useState } from "react";
import { productService } from "../Services/productservice";
import { parseDeviceQr } from "../utils/deviceQr";
import { isValid, validateProduct } from "../utils/validtors";
import type { FieldErrors } from "../utils/validtors";
import type { CreateProductInput, Product } from "../types/product";
import QrScanner from "./QrScanner";

interface RegisterDeviceFormProps {
  ownerId: string;
  onRegistered: (product: Product) => void;
}

const EMPTY: CreateProductInput = {
  name: "",
  category: "",
  manufacturer: "",
  serialNumber: "",
  manufactureDate: null,
  description: null,
};

export default function RegisterDeviceForm({
  ownerId,
  onRegistered,
}: RegisterDeviceFormProps) {
  const [fields, setFields] = useState<CreateProductInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof CreateProductInput, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleScan = (text: string) => {
    const parsed = parseDeviceQr(text);
    setFields((prev) => ({ ...prev, ...parsed }));
    setScanned(true);
    setScanning(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validation = validateProduct(fields);
    setErrors(validation);
    if (!isValid(validation)) return;

    setSubmitting(true);
    try {
      const product = await productService.register(ownerId, fields);
      onRegistered(product);
      setFields(EMPTY);
      setScanned(false);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to register device.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Register a device</h2>
        <button
          type="button"
          onClick={() => setScanning(true)}
          className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Scan QR
        </button>
      </div>

      {scanned && (
        <p className="rounded bg-green-50 p-2 text-xs text-green-700">
          Scanned code applied — review the details below.
        </p>
      )}
      {submitError && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Device name"
          value={fields.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
        />
        <Field
          label="Category"
          value={fields.category}
          onChange={(v) => set("category", v)}
          error={errors.category}
        />
        <Field
          label="Manufacturer"
          value={fields.manufacturer}
          onChange={(v) => set("manufacturer", v)}
          error={errors.manufacturer}
        />
        <Field
          label="Serial number"
          value={fields.serialNumber}
          onChange={(v) => set("serialNumber", v)}
          error={errors.serialNumber}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {submitting ? "Registering…" : "Register device"}
      </button>

      {scanning && (
        <QrScanner onResult={handleScan} onClose={() => setScanning(false)} />
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function Field({ label, value, onChange, error }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
