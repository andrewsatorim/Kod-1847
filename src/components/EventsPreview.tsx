"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

const events = [
  { day: "18", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u0427\u0430\u0439\u043d\u0430\u044f \u0434\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f", nameEn: "Tea Tasting", descRu: "\u0427\u0435\u0442\u044b\u0440\u0435 \u0443\u043b\u0443\u043d\u0441\u043a\u0438\u0445 \u0441\u043e\u0440\u0442\u0430, \u0443\u0440\u043e\u0436\u0430\u0439 2024.", descEn: "Four oolong varieties, 2024 harvest.", time: "18:00" },
  { day: "22", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u0414\u0436\u0430\u0437-\u0432\u0435\u0447\u0435\u0440", nameEn: "Jazz Evening", descRu: "\u0416\u0438\u0432\u0430\u044f \u043c\u0443\u0437\u044b\u043a\u0430, \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u043d\u0430\u043f\u0438\u0442\u043a\u0438.", descEn: "Live music, signature drinks.", time: "20:00" },
  { day: "27", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u044f", nameEn: "Hookah Ceremony", descRu: "\u0420\u0438\u0442\u0443\u0430\u043b \u043f\u043e\u0434\u0430\u0447\u0438 \u0441 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430\u043c\u0438 \u0447\u0430\u0439\u043d\u043e\u0439 \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u0438.", descEn: "Serving ritual with tea tradition elements.", time: "19:00" },
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
