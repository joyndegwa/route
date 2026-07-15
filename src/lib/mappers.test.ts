import { describe, it, expect } from "vitest";
import { mapProfileRow } from "./user";
import type { ProfileRow } from "./user";
import { mapProductRow } from "./product";
import type { ProductRow } from "./product";
import { mapRepairRow } from "./repair";
import type { RepairRow } from "./repair";

describe("mapProfileRow", () => {
  it("maps fields and defaults nullish values", () => {
    const row: ProfileRow = {
      id: "u1",
      email: "a@b.com",
      full_name: null,
      role: null,
      organization: null,
      created_at: "2024-01-01",
    };
    expect(mapProfileRow(row)).toEqual({
      id: "u1",
      email: "a@b.com",
      fullName: "",
      role: "client",
      organization: null,
      createdAt: "2024-01-01",
    });
  });

  it("preserves a provided role", () => {
    const row: ProfileRow = {
      id: "u1",
      email: "a@b.com",
      full_name: "Ada",
      role: "admin",
      organization: "Cognition",
      created_at: "2024-01-01",
    };
    expect(mapProfileRow(row).role).toBe("admin");
    expect(mapProfileRow(row).fullName).toBe("Ada");
  });
});

describe("mapProductRow", () => {
  it("maps snake_case to camelCase", () => {
    const row: ProductRow = {
      id: "p1",
      name: "Phone",
      category: "Electronics",
      manufacturer: "Acme",
      serial_number: "SN-1",
      owner_id: "u1",
      status: "active",
      manufacture_date: "2023-01-01",
      description: "A phone",
      created_at: "2024-01-01",
    };
    expect(mapProductRow(row)).toEqual({
      id: "p1",
      name: "Phone",
      category: "Electronics",
      manufacturer: "Acme",
      serialNumber: "SN-1",
      ownerId: "u1",
      status: "active",
      manufactureDate: "2023-01-01",
      description: "A phone",
      createdAt: "2024-01-01",
    });
  });
});

describe("mapRepairRow", () => {
  it("maps snake_case to camelCase", () => {
    const row: RepairRow = {
      id: "r1",
      product_id: "p1",
      requester_id: "u1",
      technician_id: "tech-1",
      description: "Fix screen",
      status: "in_progress",
      cost: 75,
      created_at: "2024-01-01",
    };
    const mapped = mapRepairRow(row);
    expect(mapped.productId).toBe("p1");
    expect(mapped.requesterId).toBe("u1");
    expect(mapped.technicianId).toBe("tech-1");
    expect(mapped.status).toBe("in_progress");
    expect(mapped.cost).toBe(75);
  });
});
