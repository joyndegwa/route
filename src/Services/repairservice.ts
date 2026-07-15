import { repairRepo } from "../lib/repair";
import type { CreateRepairInput, Repair, RepairStatus } from "../types/repair";

const ACTIVE_STATUSES: RepairStatus[] = ["pending", "in_progress"];

/** Number of repairs still awaiting resolution. Pure helper. */
export function countActive(repairs: Repair[]): number {
  return repairs.filter((r) => ACTIVE_STATUSES.includes(r.status)).length;
}

/** Sum the cost of completed repairs. Pure helper. */
export function totalCompletedCost(repairs: Repair[]): number {
  return repairs
    .filter((r) => r.status === "completed")
    .reduce((total, r) => total + (r.cost ?? 0), 0);
}

/** Whether a repair may transition to the given next status. */
export function canTransition(from: RepairStatus, to: RepairStatus): boolean {
  const transitions: Record<RepairStatus, RepairStatus[]> = {
    pending: ["in_progress", "rejected"],
    in_progress: ["completed", "rejected"],
    completed: [],
    rejected: [],
  };
  return transitions[from].includes(to);
}

export const repairService = {
  countActive,
  totalCompletedCost,
  canTransition,
  listForRequester: (requesterId: string) =>
    repairRepo.listByRequester(requesterId),
  listAll: () => repairRepo.listAll(),
  request: (requesterId: string, input: CreateRepairInput) =>
    repairRepo.create(requesterId, input),
  update: repairRepo.update,
};
