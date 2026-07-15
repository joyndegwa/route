import { describe, it, expect } from "vitest";
import {
  mapRecycleRow,
  pointsForItems,
  totalEarnedPoints,
} from "./recycleservice";
import type { RecycleRow } from "./recycleservice";
import { RECYCLE_POINTS_PER_ITEM } from "../utils/constants";
import type { RecycleRecord } from "../types/product";

describe("pointsForItems", () => {
  it("awards points per whole item", () => {
    expect(pointsForItems(3)).toBe(3 * RECYCLE_POINTS_PER_ITEM);
  });

  it("floors fractional counts", () => {
    expect(pointsForItems(2.9)).toBe(2 * RECYCLE_POINTS_PER_ITEM);
  });

  it("never returns negative points", () => {
    expect(pointsForItems(0)).toBe(0);
    expect(pointsForItems(-5)).toBe(0);
  });
});

describe("totalEarnedPoints", () => {
  it("sums points of processed records only", () => {
    const records: RecycleRecord[] = [
      {
        id: "1",
        productId: "p1",
        userId: "u1",
        method: "Mail-in",
        status: "processed",
        points: 50,
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        productId: "p2",
        userId: "u1",
        method: "Mail-in",
        status: "requested",
        points: 50,
        createdAt: "2024-01-02",
      },
    ];
    expect(totalEarnedPoints(records)).toBe(50);
  });
});

describe("mapRecycleRow", () => {
  it("maps snake_case rows and defaults nullish fields", () => {
    const row: RecycleRow = {
      id: "1",
      product_id: "p1",
      user_id: "u1",
      method: "Drop-off Point",
      status: "processed",
      points: null,
      created_at: "2024-01-01",
    };
    expect(mapRecycleRow(row)).toEqual({
      id: "1",
      productId: "p1",
      userId: "u1",
      method: "Drop-off Point",
      status: "processed",
      points: 0,
      createdAt: "2024-01-01",
    });
  });
});
