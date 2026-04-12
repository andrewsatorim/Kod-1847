"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";
import type { Event } from "@/lib/types";

interface Props {
  events?: Event[];
}

export default function EventsPreview({ events }: Props) {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  const eventsData = events || [];

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="events-preview" ref={ref} id="events-preview">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Мероприятия", "Events")}</div>
        <div className="section-subtitle">{t("Ближайшие события", "Upcoming events")}</div>
      </div>
      <div className="events-grid">
        {eventsData.map((ev, i) => (
          <div key={ev.id} className="event-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="event-card-dateline">{ev.day} {t(ev.month_ru, ev.month_en).toLowerCase()} · {ev.time}</div>
            <div className="event-name">{t(ev.name_ru, ev.name_en)}</div>
            <div className="event-desc">{t(ev.desc_ru, ev.desc_en)}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}><Link href="/events" className="view-all-link">{t("Все мероприятия", "All events")}</Link></div>
    </section>
  );
}
