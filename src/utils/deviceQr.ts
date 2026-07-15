import type { CreateProductInput } from "../types/product";

export type ScannedDevice = Partial<CreateProductInput>;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Parses the text decoded from a scanned QR/barcode into device fields.
 *
 * Supports two payload shapes:
 *  - JSON object with any of: name, category, manufacturer, serialNumber
 *    (also accepts `serial`), manufactureDate, description.
 *  - Plain text, treated as the device serial number.
 *
 * Pure and deterministic so it can be unit tested without a camera.
 */
export function parseDeviceQr(raw: string): ScannedDevice {
  const text = raw.trim();
  if (!text) return {};

  if (text.startsWith("{")) {
    try {
      const data = JSON.parse(text) as Record<string, unknown>;
      const result: ScannedDevice = {};
      const name = asString(data.name);
      const category = asString(data.category);
      const manufacturer = asString(data.manufacturer);
      const serialNumber = asString(data.serialNumber) ?? asString(data.serial);
      const manufactureDate = asString(data.manufactureDate);
      const description = asString(data.description);
      if (name) result.name = name;
      if (category) result.category = category;
      if (manufacturer) result.manufacturer = manufacturer;
      if (serialNumber) result.serialNumber = serialNumber;
      if (manufactureDate) result.manufactureDate = manufactureDate;
      if (description) result.description = description;
      return result;
    } catch {
      return { serialNumber: text };
    }
  }

  return { serialNumber: text };
}
