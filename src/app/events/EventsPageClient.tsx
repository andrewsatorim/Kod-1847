"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";
import type { Event } from "@/lib/types";

interface Props {
  events: Event[];
}

export default function EventsPageClient({ events }: Props) {
  const { t } = useLang();
  const [registerModal, setRegisterModal] = useState<number | null>(null);

  return (
    <>
      <Header />
      <div className="events-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Мероприятия", "Events")}</div>
        <div className="section-subtitle" style={{ marginBottom: 48 }}>{t("Расписание событий", "Event schedule")}</div>
        <div className="events-page-grid">
          {events.map((ev, i) => (
            <div key={ev.id} className="event-page-card">
              <div className="event-page-dateline">{ev.day} {t(ev.month_ru, ev.month_en).toLowerCase()} · {ev.time}</div>
              <div className="event-badge">{t(ev.tag_ru, ev.tag_en)}</div>
              <div className="event-name">{t(ev.name_ru, ev.name_en)}</div>
              <div className="event-desc">{t(ev.desc_ru, ev.desc_en)}</div>
              <button className="event-register-btn" onClick={() => setRegisterModal(i)}>{t("Забронировать", "Book")}</button>
            </div>
          ))}
        </div>
      </div>
      <div className={`modal-overlay ${registerModal !== null ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setRegisterModal(null); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setRegisterModal(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" /><line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" /></svg>
          </button>
          <div className="modal-header">{registerModal !== null ? t(events[registerModal].name_ru, events[registerModal].name_en) : ""}</div>
          <form onSubmit={(e) => { e.preventDefault(); setRegisterModal(null); }}>
            <div className="modal-field"><label className="modal-label">{t("Имя", "Name")}</label><input type="text" className="modal-input" placeholder={t("Имя и фамилия", "Full name")} required /></div>
            <div className="modal-field"><label className="modal-label">{t("Телефон", "Phone")}</label><input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required /></div>
            <button type="submit" className="modal-submit">{t("Забронировать", "Book")}</button>
          </form>
          <div className="modal-note">{t("Мы свяжемся для подтверждения", "We will contact you to confirm")}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
