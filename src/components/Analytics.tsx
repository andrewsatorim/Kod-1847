"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackPageview, trackTimeOnPage } from "@/lib/analytics";

export default function Analytics() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const prevPathRef = useRef<string | null>(null);

  // Initialize analytics once
  useEffect(() => {
    cleanupRef.current = initAnalytics() || undefined;
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  // Track pageviews on route changes
  useEffect(() => {
    if (prevPathRef.current !== null) {
      // Leaving previous page — record time spent
      trackTimeOnPage();
    }
    prevPathRef.current = pathname;
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
