import { getSupabase } from "./supabase";

// ── Session Management ────────────────���─────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("_a_sid");
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem("_a_sid", sid);
  }
  return sid;
}

// ── Device Detection ────────────────────���───────────────────────

function getDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("YaBrowser")) return "Yandex";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";
  return "other";
}

// ── State ───────────────────────────────────────────────────────

let sessionStartTime = 0;
let pageStartTime = 0;
let maxScrollDepth = 0;
let pagesViewed = 0;
let sessionCreated = false;
let scrollListenerAttached = false;

// ── Helpers ─────���───────────────���───────────────────────────────

function send(table: string, data: Record<string, unknown>) {
  const sb = getSupabase();
  if (!sb) return;
  sb.from(table).insert(data).then(() => {});
}

function sendWithKeepalive(table: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
}

// ── Session Tracking ────────────────────────────────────────────

function ensureSession() {
  if (sessionCreated) return;
  sessionCreated = true;
  sessionStartTime = Date.now();
  pagesViewed = 0;
  maxScrollDepth = 0;

  const sid = getSessionId();
  send("analytics_sessions", {
    session_id: sid,
    device: getDevice(),
    browser: getBrowser(),
    pages_viewed: 0,
    max_scroll_depth: 0,
    duration: 0,
  });
}

function updateSession() {
  const sb = getSupabase();
  if (!sb) return;
  const sid = getSessionId();
  const duration = Math.round((Date.now() - sessionStartTime) / 1000);

  sb.from("analytics_sessions")
    .update({
      duration,
      pages_viewed: pagesViewed,
      max_scroll_depth: maxScrollDepth,
    })
    .eq("session_id", sid)
    .then(() => {});
}

function updateSessionKeepalive() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  const sid = getSessionId();
  const duration = Math.round((Date.now() - sessionStartTime) / 1000);

  fetch(`${url}/rest/v1/analytics_sessions?session_id=eq.${encodeURIComponent(sid)}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      duration,
      pages_viewed: pagesViewed,
      max_scroll_depth: maxScrollDepth,
    }),
    keepalive: true,
  }).catch(() => {});
}

// ── Pageview Tracking ───────────────────────────────────────────

export function trackPageview(page?: string) {
  ensureSession();
  pagesViewed++;
  pageStartTime = Date.now();
  maxScrollDepth = 0;

  const currentPage = page || window.location.pathname;
  send("analytics_pageviews", {
    page: currentPage,
    referrer: document.referrer || null,
    device: getDevice(),
    browser: getBrowser(),
    screen_width: window.innerWidth,
    session_id: getSessionId(),
  });

  if (!scrollListenerAttached) {
    scrollListenerAttached = true;
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
}

// ── Event Tracking ──────────────────────────────────────────────

export function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  ensureSession();
  send("analytics_events", {
    event_type: eventType,
    page: typeof window !== "undefined" ? window.location.pathname : "",
    metadata: metadata || {},
    session_id: getSessionId(),
  });
}

// ── Scroll Depth ────────────────────────────────────────────────

function handleScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;
  const depth = Math.round((scrollTop / docHeight) * 100);
  if (depth > maxScrollDepth) {
    maxScrollDepth = depth;
  }
}

// ── Time Tracking ───────────────────────────────────────────────

export function trackTimeOnPage() {
  if (!pageStartTime) return;
  const seconds = Math.round((Date.now() - pageStartTime) / 1000);
  if (seconds < 1) return;

  sendWithKeepalive("analytics_events", {
    event_type: "time_on_page",
    page: window.location.pathname,
    metadata: { seconds },
    session_id: getSessionId(),
  });
}

// ── Lifecycle ───────────────────────────────────────────────────

export function initAnalytics() {
  if (typeof window === "undefined") return;

  ensureSession();

  const handleBeforeUnload = () => {
    trackTimeOnPage();

    if (maxScrollDepth > 0) {
      sendWithKeepalive("analytics_events", {
        event_type: "scroll_depth",
        page: window.location.pathname,
        metadata: { depth: maxScrollDepth },
        session_id: getSessionId(),
      });
    }

    updateSessionKeepalive();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      updateSessionKeepalive();
    }
  });

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("scroll", handleScroll);
  };
}
