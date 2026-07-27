import { supabase } from "../supabase/client";
import type {
  CreateProductInput,
  Product,
  ProductStatus,
  UpdateProductInput,
} from "../types/product";

export interface ProductRow {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  serial_number: string;
  owner_id: string;
  status: string;
  manufacture_date: string | null;
  description: string | null;
  created_at: string;
  material_composition: string | null;
  carbon_footprint_kg: number | null;
  circular_economy_score: number | null;
  estimated_value: number | null;
  repairability_score: number | null;
}

const PRODUCTS_TABLE = "products";

/** Map a raw Supabase product row into the app's Product shape. */
export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    manufacturer: row.manufacturer,
    serialNumber: row.serial_number,
    ownerId: row.owner_id,
    status: (row.status as ProductStatus) ?? "active",
    manufactureDate: row.manufacture_date,
    description: row.description,
    createdAt: row.created_at,
    materialComposition: row.material_composition ?? null,
    carbonFootprintKg: row.carbon_footprint_kg ?? null,
    circularEconomyScore: row.circular_economy_score ?? null,
    estimatedValue: row.estimated_value ?? null,
    repairabilityScore: row.repairability_score ?? null,
  };
}

export const productRepo = {
  getById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProductRow(data as ProductRow) : null;
  },

  listByOwner: async (ownerId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapProductRow(row as ProductRow));
  },

  listAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapProductRow(row as ProductRow));
  },

  create: async (
    ownerId: string,
    input: CreateProductInput,
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert({
        name: input.name,
        category: input.category,
        manufacturer: input.manufacturer,
        serial_number: input.serialNumber,
        manufacture_date: input.manufactureDate ?? null,
        description: input.description ?? null,
        owner_id: ownerId,
        status: "active",
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapProductRow(data as ProductRow);
  },

  update: async (id: string, input: UpdateProductInput): Promise<Product> => {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.category !== undefined) patch.category = input.category;
    if (input.manufacturer !== undefined) patch.manufacturer = input.manufacturer;
    if (input.status !== undefined) patch.status = input.status;
    if (input.description !== undefined) patch.description = input.description;

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapProductRow(data as ProductRow);
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
