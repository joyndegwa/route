import { describe, it, expect } from "vitest";
import { parseDeviceQr } from "./deviceQr";

describe("parseDeviceQr", () => {
  it("returns empty object for blank input", () => {
    expect(parseDeviceQr("   ")).toEqual({});
  });

  it("treats plain text as the serial number", () => {
    expect(parseDeviceQr("SN-12345")).toEqual({ serialNumber: "SN-12345" });
  });

  it("parses a full JSON payload", () => {
    const json = JSON.stringify({
      name: "Laptop",
      category: "Computer",
      manufacturer: "Acme",
      serialNumber: "SN-999",
      manufactureDate: "2023-01-01",
      description: "Refurbished",
    });
    expect(parseDeviceQr(json)).toEqual({
      name: "Laptop",
      category: "Computer",
      manufacturer: "Acme",
      serialNumber: "SN-999",
      manufactureDate: "2023-01-01",
      description: "Refurbished",
    });
  });

  it("accepts `serial` as an alias for serialNumber", () => {
    expect(parseDeviceQr(JSON.stringify({ serial: "ABC" }))).toEqual({
      serialNumber: "ABC",
    });
  });

  it("ignores blank/non-string fields in JSON", () => {
    const json = JSON.stringify({ name: "  ", manufacturer: 42, serial: "X1" });
    expect(parseDeviceQr(json)).toEqual({ serialNumber: "X1" });
  });

  it("falls back to serial number when JSON is malformed", () => {
    expect(parseDeviceQr("{not-json")).toEqual({ serialNumber: "{not-json" });
  });
});
