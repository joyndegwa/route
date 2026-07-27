import { supabase } from "../supabase/client";
import type {
  CreateRepairInput,
  Repair,
  RepairStatus,
  UpdateRepairInput,
} from "../types/repair";

export interface RepairRow {
  id: string;
  product_id: string;
  requester_id: string;
  technician_id: string | null;
  description: string;
  status: string;
  cost: number | null;
  created_at: string;
}

const REPAIRS_TABLE = "repairs";

/** Map a raw Supabase repair row into the app's Repair shape. */
export function mapRepairRow(row: RepairRow): Repair {
  return {
    id: row.id,
    productId: row.product_id,
    requesterId: row.requester_id,
    technicianId: row.technician_id,
    description: row.description,
    status: (row.status as RepairStatus) ?? "pending",
    cost: row.cost,
    createdAt: row.created_at,
  };
}

export const repairRepo = {
  listByRequester: async (requesterId: string): Promise<Repair[]> => {
    const { data, error } = await supabase
      .from(REPAIRS_TABLE)
      .select("*")
      .eq("requester_id", requesterId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapRepairRow(row as RepairRow));
  },

  listByProduct: async (productId: string): Promise<Repair[]> => {
    const { data, error } = await supabase
      .from(REPAIRS_TABLE)
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapRepairRow(row as RepairRow));
  },

  listAll: async (): Promise<Repair[]> => {
    const { data, error } = await supabase
      .from(REPAIRS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapRepairRow(row as RepairRow));
  },

  create: async (
    requesterId: string,
    input: CreateRepairInput,
  ): Promise<Repair> => {
    const { data, error } = await supabase
      .from(REPAIRS_TABLE)
      .insert({
        product_id: input.productId,
        requester_id: requesterId,
        description: input.description,
        status: "pending",
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapRepairRow(data as RepairRow);
  },

  update: async (id: string, input: UpdateRepairInput): Promise<Repair> => {
    const patch: Record<string, unknown> = {};
    if (input.status !== undefined) patch.status = input.status;
    if (input.technicianId !== undefined) patch.technician_id = input.technicianId;
    if (input.cost !== undefined) patch.cost = input.cost;

    const { data, error } = await supabase
      .from(REPAIRS_TABLE)
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapRepairRow(data as RepairRow);
  },
};
