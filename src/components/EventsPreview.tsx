"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

const events = [
  { day: "12", monthRu: "Апрель", monthEn: "April", nameRu: "Чайная дегустация: улуны Уишань", nameEn: "Tea Tasting: Wuyi Oolongs", descRu: "Четыре улунских сорта, урожай 2024. Комментарии чайного мастера.", descEn: "Four oolong varieties, 2024 harvest. Tea master commentary.", time: "18:00" },
  { day: "18", monthRu: "Апрель", monthEn: "April", nameRu: "Джаз-вечер", nameEn: "Jazz Evening", descRu: "Живая музыка, авторские напитки, камерная атмосфера.", descEn: "Live music, signature drinks, intimate atmosphere.", time: "20:00" },
  { day: "22", monthRu: "Апрель", monthEn: "April", nameRu: "Дымная церемония", nameEn: "Smoke Ceremony", descRu: "Ритуал подачи кальяна с элементами японской чайной традиции.", descEn: "Hookah serving ritual with Japanese tea tradition elements.", time: "19:00" },
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
        <div className="section-title">{t("\u041c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f", "Events")}</div>
        <div className="section-subtitle">{t("\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f", "Upcoming events")}</div>
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
      <div style={{ textAlign: "center", marginTop: 48 }}><Link href="/events" className="view-all-link">{t("\u0412\u0441\u0435 \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f", "All events")}</Link></div>
    </section>
  );
}
