import { getSupabase } from "./supabase";

export interface BookingRequestInput {
  guest_name: string;
  phone: string;
  email?: string | null;
  visit_date?: string | null;
  visit_time?: string | null;
  guests_count?: number | null;
  comment?: string | null;
  source: string;
  source_detail?: string | null;
  consent_pdn: boolean;
}

export async function submitBookingRequest(input: BookingRequestInput): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const sid = typeof window !== "undefined" ? sessionStorage.getItem("_a_sid") : null;
  const { error } = await sb.from("booking_requests").insert({
    guest_name: input.guest_name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    visit_date: input.visit_date || null,
    visit_time: input.visit_time || null,
    guests_count: input.guests_count ?? null,
    comment: input.comment?.trim() || null,
    source: input.source,
    source_detail: input.source_detail || null,
    consent_pdn: input.consent_pdn,
    session_id: sid || null,
  });
  return !error;
}
