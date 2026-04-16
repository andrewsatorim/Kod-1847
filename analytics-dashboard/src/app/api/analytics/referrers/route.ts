import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  try {
    const { rows } = await pool.query(
      `SELECT referrer FROM analytics_pageviews
       WHERE created_at >= $1 AND created_at <= $2`,
      [from, to + "T23:59:59"]
    );

    const sources: Record<string, number> = {};
    for (const row of rows) {
      let source = "Прямой заход";
      if (row.referrer) {
        try {
          const host = new URL(row.referrer).hostname;
          if (host.includes("google")) source = "Google";
          else if (host.includes("yandex")) source = "Яндекс";
          else if (host.includes("t.me") || host.includes("telegram")) source = "Telegram";
          else if (host.includes("instagram") || host.includes("ig.me")) source = "Instagram";
          else if (host.includes("vk.com")) source = "VKontakte";
          else if (host.includes("facebook") || host.includes("fb.me")) source = "Facebook";
          else source = host;
        } catch {
          source = row.referrer;
        }
      }
      sources[source] = (sources[source] || 0) + 1;
    }

    const result = Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Referrers error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
