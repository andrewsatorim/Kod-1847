const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ── Session Management ──────────────────────────────────────────

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

// ── Device Detection ────────────────────────────────────────────

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

// ── Helpers ─────────────────────────────────────────────────────

function send(action: string, data: Record<string, unknown>) {
  if (!API_URL) return;
  fetch(`${API_URL}/api/public/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  }).catch(() => {});
}

function sendWithKeepalive(action: string, data: Record<string, unknown>) {
  if (typeof window === "undefined" || !API_URL) return;
  fetch(`${API_URL}/api/public/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
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

  send("session_create", {
    session_id: getSessionId(),
    device: getDevice(),
    browser: getBrowser(),
    pages_viewed: 0,
    max_scroll_depth: 0,
    duration: 0,
  });
}

function updateSessionKeepalive() {
  if (!API_URL) return;
  const sid = getSessionId();
  const duration = Math.round((Date.now() - sessionStartTime) / 1000);

  sendWithKeepalive("session_update", {
    session_id: sid,
    duration,
    pages_viewed: pagesViewed,
    max_scroll_depth: maxScrollDepth,
  });
}

// ── Pageview Tracking ───────────────────────────────────────────

export function trackPageview(page?: string) {
  ensureSession();
  pagesViewed++;
  pageStartTime = Date.now();
  maxScrollDepth = 0;

  const currentPage = page || window.location.pathname;
  send("pageview", {
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
  send("event", {
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

  sendWithKeepalive("event", {
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
      sendWithKeepalive("event", {
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
