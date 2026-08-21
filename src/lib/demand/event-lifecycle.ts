import type { EventLifecycleStatus } from "./types";

export function resolveEventLifecycle(
  startDate: string,
  endDate: string,
  today = new Date().toISOString().slice(0, 10),
): EventLifecycleStatus {
  if (endDate < today) return "COMPLETED";
  if (startDate <= today && endDate >= today) return "ONGOING";
  return "UPCOMING";
}
