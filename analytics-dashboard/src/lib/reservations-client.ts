import type { DateRange } from "./queries";

export type VisitStatus = "pending" | "came" | "no_show" | "cancelled";
export type IikoSyncStatus = "not_synced" | "pending" | "synced" | "failed";

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  date: string;
  guests: string;
  comment: string;
  consent: boolean;
  source: string | null;
  visit_status: VisitStatus | null;
  manager_note: string | null;
  iiko_id: string | null;
  iiko_status: IikoSyncStatus | string | null;
  iiko_error: string | null;
  created_at: string;
}

export async function listReservations(range: DateRange): Promise<Reservation[]> {
  const url = `/api/reservations?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const j = await res.json();
  return j.data || [];
}

export async function patchReservation(id: number, patch: { visit_status?: VisitStatus; manager_note?: string }): Promise<boolean> {
  const res = await fetch(`/api/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return res.ok;
}

export async function deleteReservation(id: number): Promise<boolean> {
  const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function syncReservationWithIiko(id: number): Promise<{ ok: boolean; iiko_id?: string; error?: string }> {
  const res = await fetch(`/api/reservations/${id}/iiko-sync`, { method: "POST" });
  return res.json();
}
