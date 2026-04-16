export type DateRange = { from: string; to: string };

function qs(range: DateRange) {
  return `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
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

// ── Overview ────────────────────────────────────────────────────

export async function getOverviewStats(range: DateRange): Promise<OverviewStats> {
  const res = await fetch(`/api/analytics/overview?${qs(range)}`);
  return res.json();
}

export async function getPageviewsByDay(range: DateRange): Promise<PageviewDay[]> {
  const res = await fetch(`/api/analytics/pageviews-by-day?${qs(range)}`);
  return res.json();
}

// ── Pages ───────────────────────────────────────────────────────

export async function getTopPages(range: DateRange): Promise<PageStat[]> {
  const res = await fetch(`/api/analytics/top-pages?${qs(range)}`);
  return res.json();
}

// ── Bookings ────────────────────────────────────────────────────

export async function getBookingsByDay(range: DateRange): Promise<BookingDay[]> {
  const res = await fetch(`/api/analytics/bookings-by-day?${qs(range)}`);
  return res.json();
}

export async function getBookingSources(range: DateRange): Promise<BookingSource[]> {
  const res = await fetch(`/api/analytics/booking-sources?${qs(range)}`);
  return res.json();
}

// ── Clicks ──────────────────────────────────────────────────────

export async function getClickStats(range: DateRange): Promise<ClickStat[]> {
  const res = await fetch(`/api/analytics/clicks?${qs(range)}`);
  return res.json();
}

// ── Devices ─────────────────────────────────────────────────────

export async function getDeviceStats(range: DateRange): Promise<DeviceStats> {
  const res = await fetch(`/api/analytics/devices?${qs(range)}`);
  return res.json();
}

// ── Sources ─────────────────────────────────────────────────────

export async function getReferrerStats(range: DateRange): Promise<ReferrerStat[]> {
  const res = await fetch(`/api/analytics/referrers?${qs(range)}`);
  return res.json();
}
