import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

const IIKO_BASE_URL = "https://api-ru.iiko.services";
const IIKO_API_LOGIN = "99bc25d40d5c4587afec2bcad7794e4e";

let _token: string | null = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin: IIKO_API_LOGIN }),
  });
  if (!res.ok) throw new Error(`iiko auth ${res.status}`);
  const j = await res.json();
  _token = j.token;
  _tokenExpiry = Date.now() + 50 * 60 * 1000;
  return _token!;
}

async function iikoCall<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${IIKO_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${(await res.text()).slice(0, 240)}`);
  return res.json();
}

interface Reservation {
  id: number;
  name: string;
  phone: string;
  date: string;
  guests: string;
  comment: string;
  manager_note: string | null;
}

function parseDateTime(s: string): { dateOnly: string; time: string } | null {
  const m = s.match(/(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
  if (!m) return null;
  return { dateOnly: m[1], time: m[2] || "19:00:00" };
}

function normalizePhone(p: string): string {
  const digits = (p.match(/\d/g) || []).join("");
  if (digits.startsWith("8") && digits.length === 11) return "+7" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 11) return "+" + digits;
  return digits ? "+" + digits : "";
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const rows = await dbQuery<Reservation>(`select id, name, phone, date, guests, comment, manager_note from reservations where id = $1`, [numId]);
  const r = rows[0];
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });

  const dt = parseDateTime(r.date || "");
  if (!dt) {
    await dbQuery(`update reservations set iiko_status = $1, iiko_error = $2 where id = $3`, ["failed", "Не удалось разобрать дату/время", numId]);
    return NextResponse.json({ ok: false, error: "Не удалось разобрать дату/время" }, { status: 400 });
  }

  await dbQuery(`update reservations set iiko_status = 'pending', iiko_error = null where id = $1`, [numId]);

  try {
    const orgs = await iikoCall<{ organizations: { id: string }[] }>("/api/1/organizations", {});
    const orgId = orgs.organizations?.[0]?.id;
    if (!orgId) throw new Error("В iiko нет организаций");

    const tg = await iikoCall<{ terminalGroups: { items: { id: string }[] }[] }>("/api/1/terminal_groups", { organizationIds: [orgId] });
    const terminalGroupId = tg.terminalGroups?.[0]?.items?.[0]?.id;
    if (!terminalGroupId) throw new Error("Нет терминальной группы");

    const sect = await iikoCall<{ restaurantSections: { tables: { id: string; seatingCapacity: number; isDeleted: boolean }[] }[] }>(
      "/api/1/reserve/available_restaurant_sections",
      { terminalGroupIds: [terminalGroupId] }
    );
    const guestsNum = parseInt(r.guests || "1", 10) || 1;
    let tableId: string | null = null;
    for (const s of sect.restaurantSections || []) {
      const t = (s.tables || []).find(x => !x.isDeleted && (x.seatingCapacity || 0) >= guestsNum);
      if (t) { tableId = t.id; break; }
    }
    if (!tableId) {
      const fb = (sect.restaurantSections || []).flatMap(s => s.tables || []).find(t => !t.isDeleted);
      tableId = fb?.id || null;
    }
    if (!tableId) throw new Error("В iiko нет столов");

    const start = `${dt.dateOnly} ${dt.time.length === 5 ? dt.time + ":00" : dt.time}.000`;

    const phone = normalizePhone(r.phone);
    if (!phone) throw new Error("В заявке не указан телефон — iiko требует phone для клиента");

    const created = await iikoCall<{ reserveInfo?: { id: string }; correlationId?: string }>("/api/1/reserve/create", {
      organizationId: orgId,
      terminalGroupId,
      customer: { name: r.name || "Гость", phone, type: "regular" },
      phone,
      guestsCount: guestsNum,
      shouldRemind: false,
      tableIds: [tableId],
      estimatedStartTime: start,
      durationInMinutes: 120,
      guests: { count: guestsNum, splitBetweenPersons: false },
      comment: [r.comment || "", r.manager_note || ""].filter(Boolean).join(" | ").slice(0, 480),
    });

    const iikoId = created.reserveInfo?.id || created.correlationId || "";
    if (!iikoId) throw new Error("iiko не вернул id");

    await dbQuery(`update reservations set iiko_status = 'synced', iiko_id = $1, iiko_error = null where id = $2`, [iikoId, numId]);
    return NextResponse.json({ ok: true, iiko_id: iikoId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "iiko sync failed";
    await dbQuery(`update reservations set iiko_status = 'failed', iiko_error = $1 where id = $2`, [msg, numId]);
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
