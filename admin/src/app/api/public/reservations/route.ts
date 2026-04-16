import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const IIKO_BASE_URL = "https://api-ru.iiko.services";
const IIKO_API_LOGIN = process.env.IIKO_API_LOGIN || "a1828182eba646dea445f379128776e0";
const IIKO_ORG_ID = process.env.IIKO_ORG_ID || "";

let _token: string | null = null;
let _tokenExpiry: number = 0;

async function getIikoToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin: IIKO_API_LOGIN }),
  });

  if (!res.ok) {
    throw new Error(`iiko auth failed (${res.status})`);
  }

  const data = await res.json();
  _token = data.token;
  _tokenExpiry = Date.now() + 50 * 60 * 1000;
  return _token!;
}

async function getOrganizationId(token: string): Promise<string> {
  if (IIKO_ORG_ID) return IIKO_ORG_ID;

  const res = await fetch(`${IIKO_BASE_URL}/api/1/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to get organizations");

  const data = await res.json();
  if (!data.organizations?.length) throw new Error("No organizations found");
  return data.organizations[0].id;
}

async function createIikoCustomer(
  token: string,
  organizationId: string,
  name: string,
  phone: string
): Promise<string> {
  // Normalize phone: keep only digits, ensure starts with 7 for Russia
  const cleanPhone = phone.replace(/\D/g, "").replace(/^8/, "7");

  const res = await fetch(`${IIKO_BASE_URL}/api/1/loyalty/iiko/customer/create_or_update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationId,
      client: {
        name,
        phone: cleanPhone,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Customer create failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.id;
}

async function createIikoReserve(
  token: string,
  organizationId: string,
  customerId: string,
  date: string,
  guests: number,
  comment: string
): Promise<string> {
  // Get terminal groups for the organization
  const termRes = await fetch(`${IIKO_BASE_URL}/api/1/terminal_groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ organizationIds: [organizationId] }),
  });

  if (!termRes.ok) throw new Error("Failed to get terminal groups");
  const termData = await termRes.json();
  const terminalGroupId = termData.terminalGroups?.[0]?.items?.[0]?.id;
  if (!terminalGroupId) throw new Error("No terminal group found");

  // Build datetime: if date is YYYY-MM-DD, add default time 19:00
  const dateTime = date ? `${date} 19:00:00.000` : "";

  const res = await fetch(`${IIKO_BASE_URL}/api/1/reserve/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationId,
      terminalGroupId,
      customer: { id: customerId },
      guestsCount: guests || 2,
      dateTime,
      comment: comment || "",
      shouldRemind: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reserve create failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.reserveId || data.id || "ok";
}

function corsHeaders(origin: string) {
  const headers: Record<string, string> = {};
  if (
    origin.includes("kod1847.ru") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1")
  ) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400, headers });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400, headers });
    }

    // Save to local PostgreSQL
    const { rows } = await pool.query(
      `INSERT INTO reservations (name, phone, date, guests, comment, consent)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [body.name, body.phone, body.date || "", body.guests || "", body.comment || "", body.consent]
    );

    const reservationId = rows[0].id;

    // Send to iiko Cloud API
    if (IIKO_API_LOGIN) {
      try {
        const token = await getIikoToken();
        const orgId = await getOrganizationId(token);

        // Create or find guest card
        const customerId = await createIikoCustomer(token, orgId, body.name, body.phone);

        // Create reservation
        const iikoId = await createIikoReserve(
          token,
          orgId,
          customerId,
          body.date || "",
          parseInt(body.guests) || 2,
          body.comment || ""
        );

        // Update reservation with iiko status
        await pool.query(
          `UPDATE reservations SET iiko_id = $1, iiko_status = 'success' WHERE id = $2`,
          [iikoId, reservationId]
        );
      } catch (iikoErr) {
        const errorMessage = iikoErr instanceof Error ? iikoErr.message : "Unknown iiko error";
        console.error("iiko integration error:", errorMessage);

        // Save error but don't fail the reservation
        await pool.query(
          `UPDATE reservations SET iiko_status = 'error', iiko_error = $1 WHERE id = $2`,
          [errorMessage, reservationId]
        );
      }
    }

    return NextResponse.json({ ok: true, id: reservationId }, { headers });
  } catch (err) {
    console.error("Reservation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
