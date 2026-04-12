import { getSupabase } from "./supabase";

export type DateRange = { from: string; to: string };

function dateFilter(range: DateRange) {
  return { gte: range.from, lte: range.to + "T23:59:59" };
}

// ── Overview ────────────────────────────────────────────────────

export async function getOverviewStats(range: DateRange) {
  const { gte, lte } = dateFilter(range);

  const [pageviewsRes, sessionsRes, bookingsRes] = await Promise.all([
    getSupabase().from("analytics_pageviews").select("id", { count: "exact", head: true }).gte("created_at", gte).lte("created_at", lte),
    getSupabase().from("analytics_sessions").select("session_id, duration, pages_viewed").gte("started_at", gte).lte("started_at", lte),
    getSupabase().from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "booking_submit").gte("created_at", gte).lte("created_at", lte),
  ]);

  const totalPageviews = pageviewsRes.count || 0;
  const sessions = sessionsRes.data || [];
  const totalSessions = sessions.length;
  const totalBookings = bookingsRes.count || 0;

  const avgDuration = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / totalSessions)
    : 0;

  const bounced = sessions.filter(s => (s.pages_viewed || 0) <= 1).length;
  const bounceRate = totalSessions > 0 ? Math.round((bounced / totalSessions) * 100) : 0;

  const conversionRate = totalSessions > 0 ? ((totalBookings / totalSessions) * 100).toFixed(1) : "0";

  return { totalPageviews, totalSessions, avgDuration, bounceRate, totalBookings, conversionRate };
}

export async function getPageviewsByDay(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_pageviews")
    .select("created_at")
    .gte("created_at", gte)
    .lte("created_at", lte)
    .order("created_at");

  const byDay: Record<string, number> = {};
  (data || []).forEach(row => {
    const day = row.created_at.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return Object.entries(byDay).map(([date, views]) => ({ date, views }));
}

// ── Pages ───────────────────────────────────────────────────────

export async function getTopPages(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_pageviews")
    .select("page")
    .gte("created_at", gte)
    .lte("created_at", lte);

  const counts: Record<string, number> = {};
  (data || []).forEach(row => {
    counts[row.page] = (counts[row.page] || 0) + 1;
  });

  // Get time_on_page events for avg time calculation
  const { data: timeData } = await supabase
    .from("analytics_events")
    .select("metadata")
    .eq("event_type", "time_on_page")
    .gte("created_at", gte)
    .lte("created_at", lte);

  const timeByPage: Record<string, number[]> = {};
  (timeData || []).forEach(row => {
    const meta = row.metadata as { page?: string; seconds?: number } | null;
    if (meta?.page && meta?.seconds) {
      if (!timeByPage[meta.page]) timeByPage[meta.page] = [];
      timeByPage[meta.page].push(meta.seconds);
    }
  });

  return Object.entries(counts)
    .map(([page, views]) => {
      const times = timeByPage[page] || [];
      const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      return { page, views, avgTime };
    })
    .sort((a, b) => b.views - a.views);
}

// ── Bookings ────────────────────────────────────────────────────

export async function getBookingsByDay(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_events")
    .select("created_at, metadata")
    .eq("event_type", "booking_submit")
    .gte("created_at", gte)
    .lte("created_at", lte)
    .order("created_at");

  const byDay: Record<string, number> = {};
  (data || []).forEach(row => {
    const day = row.created_at.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return Object.entries(byDay).map(([date, count]) => ({ date, bookings: count }));
}

export async function getBookingSources(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_events")
    .select("metadata")
    .eq("event_type", "booking_submit")
    .gte("created_at", gte)
    .lte("created_at", lte);

  const sources: Record<string, number> = {};
  (data || []).forEach(row => {
    const meta = row.metadata as { source?: string } | null;
    const src = meta?.source || "unknown";
    sources[src] = (sources[src] || 0) + 1;
  });

  return Object.entries(sources).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
}

// ── Clicks ──────────────────────────────────────────────────────

export async function getClickStats(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_events")
    .select("event_type, metadata")
    .in("event_type", ["click_reserve", "click_pdf", "click_phone", "click_telegram", "click_instagram"])
    .gte("created_at", gte)
    .lte("created_at", lte);

  const clicks: Record<string, number> = {};
  (data || []).forEach(row => {
    let label = row.event_type;
    const meta = row.metadata as Record<string, string> | null;
    if (row.event_type === "click_pdf" && meta?.menu) {
      label = `PDF: ${meta.menu}`;
    } else if (meta?.location) {
      label = `${row.event_type} (${meta.location})`;
    }
    clicks[label] = (clicks[label] || 0) + 1;
  });

  return Object.entries(clicks).map(([button, count]) => ({ button, count })).sort((a, b) => b.count - a.count);
}

// ── Devices ─────────────────────────────────────────────────────

export async function getDeviceStats(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_sessions")
    .select("device, browser")
    .gte("started_at", gte)
    .lte("started_at", lte);

  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};

  (data || []).forEach(row => {
    const d = row.device || "unknown";
    const b = row.browser || "unknown";
    devices[d] = (devices[d] || 0) + 1;
    browsers[b] = (browsers[b] || 0) + 1;
  });

  return {
    devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
    browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  };
}

// ── Sources ─────────────────────────────────────────────────────

export async function getReferrerStats(range: DateRange) {
  const { gte, lte } = dateFilter(range);
  const { data } = await supabase
    .from("analytics_pageviews")
    .select("referrer")
    .gte("created_at", gte)
    .lte("created_at", lte);

  const sources: Record<string, number> = {};
  (data || []).forEach(row => {
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
  });

  return Object.entries(sources).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
}
