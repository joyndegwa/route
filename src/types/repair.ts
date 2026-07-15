export type RepairStatus = "pending" | "in_progress" | "completed" | "rejected";

export interface Repair {
  id: string;
  productId: string;
  requesterId: string;
  technicianId?: string | null;
  description: string;
  status: RepairStatus;
  cost?: number | null;
  createdAt: string;
}

export interface CreateRepairInput {
  productId: string;
  description: string;
}

export interface UpdateRepairInput {
  status?: RepairStatus;
  technicianId?: string | null;
  cost?: number | null;
}
