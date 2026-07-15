import { describe, it, expect } from "vitest";
import { canTransition, countActive, totalCompletedCost } from "./repairservice";
import type { Repair, RepairStatus } from "../types/repair";

function makeRepair(overrides: Partial<Repair> = {}): Repair {
  return {
    id: "r1",
    productId: "p1",
    requesterId: "u1",
    technicianId: null,
    description: "Screen replacement",
    status: "pending",
    cost: null,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("countActive", () => {
  it("counts pending and in_progress repairs", () => {
    const repairs = [
      makeRepair({ status: "pending" }),
      makeRepair({ id: "r2", status: "in_progress" }),
      makeRepair({ id: "r3", status: "completed" }),
      makeRepair({ id: "r4", status: "rejected" }),
    ];
    expect(countActive(repairs)).toBe(2);
  });
});

describe("totalCompletedCost", () => {
  it("sums cost of completed repairs only", () => {
    const repairs = [
      makeRepair({ status: "completed", cost: 100 }),
      makeRepair({ id: "r2", status: "completed", cost: 50 }),
      makeRepair({ id: "r3", status: "pending", cost: 999 }),
      makeRepair({ id: "r4", status: "completed", cost: null }),
    ];
    expect(totalCompletedCost(repairs)).toBe(150);
  });
});

describe("canTransition", () => {
  const cases: Array<[RepairStatus, RepairStatus, boolean]> = [
    ["pending", "in_progress", true],
    ["pending", "rejected", true],
    ["pending", "completed", false],
    ["in_progress", "completed", true],
    ["in_progress", "pending", false],
    ["completed", "in_progress", false],
    ["rejected", "pending", false],
  ];

  it.each(cases)("%s -> %s is %s", (from, to, expected) => {
    expect(canTransition(from, to)).toBe(expected);
  });
});
