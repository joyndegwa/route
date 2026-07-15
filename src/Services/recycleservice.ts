import { supabase } from "../supabase/client";
import { RECYCLE_POINTS_PER_ITEM } from "../utils/constants";
import type {
  CreateRecycleInput,
  RecycleRecord,
  RecycleStatus,
} from "../types/product";

export interface RecycleRow {
  id: string;
  product_id: string;
  user_id: string;
  method: string;
  status: string;
  points: number | null;
  created_at: string;
}

const RECYCLE_TABLE = "recycle_records";

export function mapRecycleRow(row: RecycleRow): RecycleRecord {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    method: row.method,
    status: (row.status as RecycleStatus) ?? "requested",
    points: row.points ?? 0,
    createdAt: row.created_at,
  };
}

/** Points earned once a recycling request reaches the "processed" state. */
export function pointsForItems(count: number): number {
  if (count <= 0) return 0;
  return Math.floor(count) * RECYCLE_POINTS_PER_ITEM;
}

/** Total points earned across processed recycle records. Pure helper. */
export function totalEarnedPoints(records: RecycleRecord[]): number {
  return records
    .filter((r) => r.status === "processed")
    .reduce((total, r) => total + r.points, 0);
}

export const recycleService = {
  pointsForItems,
  totalEarnedPoints,

  listForUser: async (userId: string): Promise<RecycleRecord[]> => {
    const { data, error } = await supabase
      .from(RECYCLE_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapRecycleRow(row as RecycleRow));
  },

  request: async (
    userId: string,
    input: CreateRecycleInput,
  ): Promise<RecycleRecord> => {
    const { data, error } = await supabase
      .from(RECYCLE_TABLE)
      .insert({
        product_id: input.productId,
        user_id: userId,
        method: input.method,
        status: "requested",
        points: 0,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapRecycleRow(data as RecycleRow);
  },
};
