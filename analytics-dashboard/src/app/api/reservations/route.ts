import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

const ALLOWED_ORIGINS = ["https://kod1847.ru", "https://www.kod1847.ru", "https://analytics.kod1847.ru", "https://manager.kod1847.ru"];

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Dashboard-Key",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: string[] = [];
  const params: unknown[] = [];
  if (from) { params.push(from); where.push(`created_at >= $${params.length}`); }
  if (to)   { params.push(to + "T23:59:59"); where.push(`created_at <= $${params.length}`); }
  const whereSql = where.length ? `where ${where.join(" and ")}` : "";

  const rows = await dbQuery(`
    select id, name, phone, date, guests, comment, consent, source,
           visit_status, manager_note,
           iiko_id, iiko_status, iiko_error,
           created_at
    from reservations
    ${whereSql}
    order by created_at desc
  `, params);

  return NextResponse.json({ data: rows }, { headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const body = await req.json();
    const rows = await dbQuery<{ id: number }>(`
      insert into reservations (name, phone, date, guests, comment, consent, source)
      values ($1, $2, $3, $4, $5, $6, $7)
      returning id
    `, [
      String(body.name || "").trim(),
      String(body.phone || "").trim(),
      String(body.date || "").trim(),
      String(body.guests || "").trim(),
      String(body.comment || ""),
      Boolean(body.consent),
      String(body.source || "").trim(),
    ]);
    return NextResponse.json({ id: rows[0]?.id }, { status: 201, headers: corsHeaders(origin) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "insert failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: corsHeaders(origin) });
  }
}
