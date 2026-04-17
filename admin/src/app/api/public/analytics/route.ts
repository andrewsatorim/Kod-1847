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
    const { action, data } = await req.json();

    switch (action) {
      case "session_create": {
        await pool.query(
          `INSERT INTO analytics_sessions (session_id, device, browser, pages_viewed, max_scroll_depth, duration)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [data.session_id, data.device, data.browser, data.pages_viewed || 0, data.max_scroll_depth || 0, data.duration || 0]
        );
        break;
      }
      case "session_update": {
        await pool.query(
          `UPDATE analytics_sessions SET duration=$1, pages_viewed=$2, max_scroll_depth=$3
           WHERE session_id=$4`,
          [data.duration, data.pages_viewed, data.max_scroll_depth, data.session_id]
        );
        break;
      }
      case "pageview": {
        await pool.query(
          `INSERT INTO analytics_pageviews (page, referrer, device, browser, screen_width, session_id)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [data.page, data.referrer || null, data.device, data.browser, data.screen_width, data.session_id]
        );
        break;
      }
      case "event": {
        await pool.query(
          `INSERT INTO analytics_events (event_type, page, metadata, session_id)
           VALUES ($1,$2,$3,$4)`,
          [data.event_type, data.page, JSON.stringify(data.metadata || {}), data.session_id]
        );
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400, headers });
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (err) {
    console.error("Analytics ingest error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
