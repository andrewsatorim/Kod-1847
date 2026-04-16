import { NextResponse } from "next/server";
import pool from "@/lib/db";

const IIKO_BASE_URL = "https://api-ru.iiko.services";
const IIKO_API_LOGIN = process.env.IIKO_API_LOGIN || "a1828182eba646dea445f379128776e0";
const IIKO_ORG_ID = process.env.IIKO_ORG_ID || "";

let _token: string | null = null;
let _tokenExpiry = 0;

async function getIikoToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin: IIKO_API_LOGIN }),
  });
  if (!res.ok) throw new Error(`iiko auth failed (${res.status})`);
  const data = await res.json();
  _token = data.token;
  _tokenExpiry = Date.now() + 50 * 60 * 1000;
  return _token!;
}

async function getOrgId(token: string): Promise<string> {
  if (IIKO_ORG_ID) return IIKO_ORG_ID;
  const res = await fetch(`${IIKO_BASE_URL}/api/1/organizations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to get organizations");
  const data = await res.json();
  return data.organizations?.[0]?.id;
}

// Маппинг статусов iiko → наше поле visited
function mapIikoStatus(status: string): string | null {
  const s = (status || "").toLowerCase();
  if (s === "closed" || s === "started" || s === "arrived") return "came";
  if (s === "noshow" || s === "no_show") return "no_show";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return null;
}

async function fetchReserveStatuses(
  token: string,
  orgId: string,
  ids: string[]
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};

  // iiko не даёт batch-эндпоинта для статусов по ids, поэтому берём
  // список резервов на период и матчим локально. Здесь берём 90 дней.
  const sectionsRes = await fetch(`${IIKO_BASE_URL}/api/1/terminal_groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ organizationIds: [orgId] }),
  });
  if (!sectionsRes.ok) return map;

  const tgData = await sectionsRes.json();
  const terminalGroupIds: string[] = [];
  for (const org of tgData.terminalGroups || []) {
    for (const item of org.items || []) terminalGroupIds.push(item.id);
  }
  if (terminalGroupIds.length === 0) return map;

  const secRes = await fetch(`${IIKO_BASE_URL}/api/1/reserve/available_restaurant_sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ terminalGroupIds }),
  });
  if (!secRes.ok) return map;

  const secData = await secRes.json();
  const sectionIds: string[] = (secData.restaurantSections || []).map(
    (s: { id: string }) => s.id
  );
  if (sectionIds.length === 0) return map;

  const now = new Date();
  const from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const resvRes = await fetch(
    `${IIKO_BASE_URL}/api/1/reserve/restaurant_sections_workload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        restaurantSectionIds: sectionIds,
        dateFrom: `${from} 00:00:00.000`,
        dateTo: `${to} 23:59:59.999`,
      }),
    }
  );
  if (!resvRes.ok) return map;

  const resvData = await resvRes.json();
  const idSet = new Set(ids);
  for (const r of resvData.reserves || []) {
    if (r.id && idSet.has(r.id) && r.status) {
      map[r.id] = r.status;
    }
  }
  return map;
}

export async function POST() {
  try {
    const { rows } = await pool.query(
      `SELECT id, iiko_id FROM reservations
        WHERE iiko_id IS NOT NULL AND iiko_id <> ''
          AND visited = 'pending'
        LIMIT 500`
    );

    if (rows.length === 0) {
      return NextResponse.json({ updated: 0, checked: 0 });
    }

    const token = await getIikoToken();
    const orgId = await getOrgId(token);
    const statuses = await fetchReserveStatuses(
      token,
      orgId,
      rows.map((r) => r.iiko_id as string)
    );

    let updated = 0;
    for (const r of rows) {
      const iikoStatus = statuses[r.iiko_id as string];
      if (!iikoStatus) continue;
      const mapped = mapIikoStatus(iikoStatus);
      if (!mapped) continue;
      await pool.query(
        `UPDATE reservations SET visited = $1, iiko_status = $2 WHERE id = $3`,
        [mapped, iikoStatus, r.id]
      );
      updated++;
    }

    return NextResponse.json({ updated, checked: rows.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("iiko sync error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
