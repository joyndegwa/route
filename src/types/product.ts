export type ProductStatus = "active" | "in_repair" | "recycled" | "retired";

export interface Product {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  serialNumber: string;
  ownerId: string;
  status: ProductStatus;
  manufactureDate: string | null;
  description?: string | null;
  createdAt: string;
  materialComposition?: string | null;
  carbonFootprintKg?: number | null;
  circularEconomyScore?: number | null;
  estimatedValue?: number | null;
  repairabilityScore?: number | null;
}

export interface CreateProductInput {
  name: string;
  category: string;
  manufacturer: string;
  serialNumber: string;
  manufactureDate?: string | null;
  description?: string | null;
  materialComposition?: string | null;
  carbonFootprintKg?: number | null;
  circularEconomyScore?: number | null;
  estimatedValue?: number | null;
  repairabilityScore?: number | null;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  manufacturer?: string;
  status?: ProductStatus;
  description?: string | null;
  materialComposition?: string | null;
  carbonFootprintKg?: number | null;
  circularEconomyScore?: number | null;
  estimatedValue?: number | null;
  repairabilityScore?: number | null;
}

export interface RecycleRecord {
  id: string;
  productId: string;
  userId: string;
  method: string;
  status: RecycleStatus;
  points: number;
  createdAt: string;
}

export type RecycleStatus = "requested" | "collected" | "processed";

export interface CreateRecycleInput {
  productId: string;
  method: string;
}
