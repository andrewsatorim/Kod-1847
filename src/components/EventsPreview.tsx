"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

const events = [
  { day: "18", monthRu: "Апрель", monthEn: "April", nameRu: "Чайная дегустация", nameEn: "Tea Tasting", descRu: "Четыре улунских сорта, урожай 2024.", descEn: "Four oolong varieties, 2024 harvest.", time: "18:00" },
  { day: "22", monthRu: "Апрель", monthEn: "April", nameRu: "Джаз-вечер", nameEn: "Jazz Evening", descRu: "Живая музыка, авторские напитки.", descEn: "Live music, signature drinks.", time: "20:00" },
  { day: "27", monthRu: "Апрель", monthEn: "April", nameRu: "Кальянная церемония", nameEn: "Hookah Ceremony", descRu: "Ритуал подачи с элементами чайной традиции.", descEn: "Serving ritual with tea tradition elements.", time: "19:00" },
];

export default function EventsPreview() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

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
        {events.map((ev, i) => (
          <div key={i} className="event-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="event-date">{ev.day}</div>
            <div className="event-month">{t(ev.monthRu, ev.monthEn)}</div>
            <div className="event-name">{t(ev.nameRu, ev.nameEn)}</div>
            <div className="event-desc">{t(ev.descRu, ev.descEn)}</div>
            <div className="event-time">{ev.time}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}><Link href="/events" className="view-all-link">{t("Все мероприятия", "All events")}</Link></div>
    </section>
  );
}
