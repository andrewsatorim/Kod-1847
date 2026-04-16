export type DateRange = { from: string; to: string };

function qs(range: DateRange) {
  return `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
}

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

// ── Types ──────────────────────────────────────────────────────

export interface OverviewStats {
  totalPageviews: number;
  totalSessions: number;
  avgDuration: number;
  bounceRate: number;
  totalBookings: number;
  conversionRate: string;
}

export interface PageviewDay { date: string; views: number; }
export interface PageStat { page: string; views: number; avgTime: number; }
export interface BookingDay { date: string; bookings: number; }
export interface BookingSource { source: string; count: number; }
export interface ClickStat { button: string; count: number; }
export interface DeviceStats {
  devices: { name: string; value: number }[];
  browsers: { name: string; count: number }[];
}
export interface ReferrerStat { source: string; count: number; }

const EMPTY_OVERVIEW: OverviewStats = {
  totalPageviews: 0,
  totalSessions: 0,
  avgDuration: 0,
  bounceRate: 0,
  totalBookings: 0,
  conversionRate: "0",
};

const EMPTY_DEVICES: DeviceStats = { devices: [], browsers: [] };

// ── Overview ────────────────────────────────────────────────────

export async function getOverviewStats(range: DateRange): Promise<OverviewStats> {
  return safeFetch(`/api/analytics/overview?${qs(range)}`, EMPTY_OVERVIEW);
}

export async function getPageviewsByDay(range: DateRange): Promise<PageviewDay[]> {
  return safeFetch(`/api/analytics/pageviews-by-day?${qs(range)}`, []);
}

// ── Pages ───────────────────────────────────────────────────────

export async function getTopPages(range: DateRange): Promise<PageStat[]> {
  return safeFetch(`/api/analytics/top-pages?${qs(range)}`, []);
}

// ── Bookings ────────────────────────────────────────────────────

export async function getBookingsByDay(range: DateRange): Promise<BookingDay[]> {
  return safeFetch(`/api/analytics/bookings-by-day?${qs(range)}`, []);
}

export async function getBookingSources(range: DateRange): Promise<BookingSource[]> {
  return safeFetch(`/api/analytics/booking-sources?${qs(range)}`, []);
}

// ── Clicks ──────────────────────────────────────────────────────

export async function getClickStats(range: DateRange): Promise<ClickStat[]> {
  return safeFetch(`/api/analytics/clicks?${qs(range)}`, []);
}

// ── Devices ─────────────────────────────────────────────────────

export async function getDeviceStats(range: DateRange): Promise<DeviceStats> {
  return safeFetch(`/api/analytics/devices?${qs(range)}`, EMPTY_DEVICES);
}

// ── Sources ─────────────────────────────────────────────────────

export async function getReferrerStats(range: DateRange): Promise<ReferrerStat[]> {
  return safeFetch(`/api/analytics/referrers?${qs(range)}`, []);
}
