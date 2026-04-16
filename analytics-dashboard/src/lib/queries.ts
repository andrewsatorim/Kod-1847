export type DateRange = { from: string; to: string };

function qs(range: DateRange) {
  return `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
}

// ── Overview ────────────────────────────────────────────────────

export async function getOverviewStats(range: DateRange) {
  const res = await fetch(`/api/analytics/overview?${qs(range)}`);
  return res.json();
}

export async function getPageviewsByDay(range: DateRange) {
  const res = await fetch(`/api/analytics/pageviews-by-day?${qs(range)}`);
  return res.json();
}

// ── Pages ───────────────────────────────────────────────────────

export async function getTopPages(range: DateRange) {
  const res = await fetch(`/api/analytics/top-pages?${qs(range)}`);
  return res.json();
}

// ── Bookings ────────────────────────────────────────────────────

export async function getBookingsByDay(range: DateRange) {
  const res = await fetch(`/api/analytics/bookings-by-day?${qs(range)}`);
  return res.json();
}

export async function getBookingSources(range: DateRange) {
  const res = await fetch(`/api/analytics/booking-sources?${qs(range)}`);
  return res.json();
}

// ── Clicks ──────────────────────────────────────────────────────

export async function getClickStats(range: DateRange) {
  const res = await fetch(`/api/analytics/clicks?${qs(range)}`);
  return res.json();
}

// ── Devices ─────────────────────────────────────────────────────

export async function getDeviceStats(range: DateRange) {
  const res = await fetch(`/api/analytics/devices?${qs(range)}`);
  return res.json();
}

// ── Sources ─────────────────────────────────────────────────────

export async function getReferrerStats(range: DateRange) {
  const res = await fetch(`/api/analytics/referrers?${qs(range)}`);
  return res.json();
}
