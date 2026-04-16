import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

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

    const { rows } = await pool.query(
      `INSERT INTO reservations (name, phone, date, guests, comment, consent)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [body.name, body.phone, body.date || "", body.guests || "", body.comment || "", body.consent]
    );

    const reservationId = rows[0].id;

    // TODO: iiko Cloud API integration
    // When IIKO_API_LOGIN and IIKO_ORG_ID are configured,
    // create a guest card and reservation in iiko here.
    // Update iiko_id, iiko_status, iiko_error in the reservations table.

    return NextResponse.json({ ok: true, id: reservationId }, { headers });
  } catch (err) {
    console.error("Reservation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
