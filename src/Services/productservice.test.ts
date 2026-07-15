import { describe, it, expect } from "vitest";
import { filterProducts, summarizeByStatus } from "./productservice";
import type { Product, ProductStatus } from "../types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    name: "Laptop",
    category: "Electronics",
    manufacturer: "Acme",
    serialNumber: "SN-001",
    ownerId: "u1",
    status: "active",
    manufactureDate: null,
    description: null,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("summarizeByStatus", () => {
  it("counts products per status", () => {
    const products = [
      makeProduct({ status: "active" }),
      makeProduct({ id: "p2", status: "active" }),
      makeProduct({ id: "p3", status: "recycled" }),
      makeProduct({ id: "p4", status: "in_repair" }),
    ];
    expect(summarizeByStatus(products)).toEqual({
      active: 2,
      in_repair: 1,
      recycled: 1,
      retired: 0,
    });
  });

  it("returns all-zero summary for an empty list", () => {
    expect(summarizeByStatus([])).toEqual({
      active: 0,
      in_repair: 0,
      recycled: 0,
      retired: 0,
    });
  });

  it("ignores unknown statuses", () => {
    const products = [makeProduct({ status: "bogus" as ProductStatus })];
    expect(summarizeByStatus(products).active).toBe(0);
  });
});

describe("filterProducts", () => {
  const products = [
    makeProduct({ id: "p1", name: "MacBook", manufacturer: "Apple" }),
    makeProduct({ id: "p2", name: "ThinkPad", manufacturer: "Lenovo" }),
    makeProduct({ id: "p3", name: "Pixel", serialNumber: "XYZ-999" }),
  ];

  it("returns everything for an empty query", () => {
    expect(filterProducts(products, "   ")).toHaveLength(3);
  });

  it("matches case-insensitively across fields", () => {
    expect(filterProducts(products, "apple")).toHaveLength(1);
    expect(filterProducts(products, "xyz-999")).toHaveLength(1);
    expect(filterProducts(products, "pad")[0].id).toBe("p2");
  });

  it("returns nothing when there is no match", () => {
    expect(filterProducts(products, "nonexistent")).toHaveLength(0);
  });
});
