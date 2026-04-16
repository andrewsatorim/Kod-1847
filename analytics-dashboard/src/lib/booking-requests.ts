import { getSupabase } from "./supabase";
import { iikoPost, ensureOrgId } from "./iiko";
import type { DateRange } from "./queries";

export type VisitStatus = "pending" | "came" | "no_show" | "cancelled";
export type IikoSyncStatus = "not_synced" | "pending" | "synced" | "failed";

export interface BookingRequest {
  id: number;
  guest_name: string;
  phone: string;
  email: string | null;
  visit_date: string | null;
  visit_time: string | null;
  guests_count: number | null;
  comment: string | null;
  source: string;
  source_detail: string | null;
  consent_pdn: boolean;
  visit_status: VisitStatus;
  manager_note: string | null;
  iiko_status: IikoSyncStatus;
  iiko_id: string | null;
  iiko_error: string | null;
  iiko_synced_at: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function listBookingRequests(range: DateRange): Promise<BookingRequest[]> {
  const { data, error } = await getSupabase()
    .from("booking_requests")
    .select("*")
    .gte("created_at", range.from)
    .lte("created_at", range.to + "T23:59:59")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listBookingRequests", error);
    return [];
  }
  return (data || []) as BookingRequest[];
}

export async function updateBookingStatus(id: number, status: VisitStatus): Promise<boolean> {
  const { error } = await getSupabase()
    .from("booking_requests")
    .update({ visit_status: status })
    .eq("id", id);
  return !error;
}

export async function updateBookingNote(id: number, note: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("booking_requests")
    .update({ manager_note: note })
    .eq("id", id);
  return !error;
}

export async function deleteBookingRequest(id: number): Promise<boolean> {
  const { error } = await getSupabase().from("booking_requests").delete().eq("id", id);
  return !error;
}

// ── iiko sync ───────────────────────────────────────────────────

interface IikoCreateReserveResponse {
  reserveInfo?: { id: string; status?: string };
  correlationId?: string;
}

export async function createIikoReserveForBooking(b: BookingRequest): Promise<{ ok: true; iikoId: string } | { ok: false; error: string }> {
  if (!b.visit_date || !b.visit_time) {
    return { ok: false, error: "Не указаны дата или время визита" };
  }
  try {
    await ensureOrgId();
    const orgId = await ensureOrgId();

    const tgRes = await iikoPost<{
      terminalGroups: { organizationId: string; items: { id: string; name: string }[] }[];
    }>("/api/1/terminal_groups", { organizationIds: [orgId] });
    const terminalGroupId = tgRes.terminalGroups?.[0]?.items?.[0]?.id;
    if (!terminalGroupId) return { ok: false, error: "В iiko нет доступных терминальных групп" };

    const sectRes = await iikoPost<{
      restaurantSections: { id: string; name: string; tables: { id: string; seatingCapacity: number; isDeleted: boolean }[] }[];
    }>("/api/1/reserve/available_restaurant_sections", { terminalGroupIds: [terminalGroupId] });
    const guests = b.guests_count || 1;
    let chosenTableId: string | null = null;
    for (const sect of sectRes.restaurantSections || []) {
      const table = (sect.tables || []).find(t => !t.isDeleted && (t.seatingCapacity || 0) >= guests);
      if (table) { chosenTableId = table.id; break; }
    }
    if (!chosenTableId) {
      const fallback = (sectRes.restaurantSections || []).flatMap(s => s.tables || []).find(t => !t.isDeleted);
      if (fallback) chosenTableId = fallback.id;
    }
    if (!chosenTableId) return { ok: false, error: "В iiko нет доступных столов" };

    const start = `${b.visit_date} ${b.visit_time.length === 5 ? b.visit_time + ":00" : b.visit_time}.000`;
    const phoneDigits = (b.phone.match(/\d/g) || []).join("");
    const normalizedPhone = phoneDigits.startsWith("8") ? "+7" + phoneDigits.slice(1) : phoneDigits.startsWith("7") ? "+" + phoneDigits : "+" + phoneDigits;

    const payload = {
      organizationId: orgId,
      terminalGroupId,
      customer: { name: b.guest_name, type: "regular" as const },
      guestsCount: guests,
      shouldRemind: false,
      tableIds: [chosenTableId],
      estimatedStartTime: start,
      durationInMinutes: 120,
      guests: { count: guests, splitBetweenPersons: false },
      comment: [b.comment || "", b.manager_note || "", `Источник: ${b.source}`].filter(Boolean).join(" | ").slice(0, 480),
      phone: normalizedPhone,
    };

    const created = await iikoPost<IikoCreateReserveResponse>("/api/1/reserve/create", payload);
    const iikoId = created.reserveInfo?.id || created.correlationId || "";
    if (!iikoId) return { ok: false, error: "iiko не вернул ID резерва" };
    return { ok: true, iikoId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Неизвестная ошибка" };
  }
}

export async function syncBookingWithIiko(b: BookingRequest): Promise<BookingRequest | null> {
  await getSupabase().from("booking_requests").update({ iiko_status: "pending", iiko_error: null }).eq("id", b.id);
  const result = await createIikoReserveForBooking(b);
  const patch = result.ok
    ? { iiko_status: "synced" as const, iiko_id: result.iikoId, iiko_error: null, iiko_synced_at: new Date().toISOString() }
    : { iiko_status: "failed" as const, iiko_error: result.error, iiko_synced_at: new Date().toISOString() };
  const { data } = await getSupabase().from("booking_requests").update(patch).eq("id", b.id).select("*").single();
  return (data as BookingRequest) || null;
}
