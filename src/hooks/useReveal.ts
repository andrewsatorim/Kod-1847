"use client";
import { useEffect, useRef } from "react";

export function useReveal(
  selector = ".reveal",
  options: IntersectionObserverInit = { threshold: 0.1 },
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(selector);
    if (!els?.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    }, options);

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [selector, options]);

  return ref;
}
