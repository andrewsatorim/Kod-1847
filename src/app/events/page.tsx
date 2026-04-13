"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";

const events = [
  { day: "12", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u0427\u0430\u0439\u043d\u0430\u044f \u0434\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f: \u0443\u043b\u0443\u043d\u044b \u0423\u0438\u0448\u0430\u043d\u044c", nameEn: "Tea Tasting: Wuyi Oolongs", descRu: "\u0427\u0435\u0442\u044b\u0440\u0435 \u0443\u043b\u0443\u043d\u0441\u043a\u0438\u0445 \u0441\u043e\u0440\u0442\u0430, \u0443\u0440\u043e\u0436\u0430\u0439 2024. \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u0447\u0430\u0439\u043d\u043e\u0433\u043e \u043c\u0430\u0441\u0442\u0435\u0440\u0430.", descEn: "Four oolong varieties, 2024 harvest. Tea master commentary.", time: "18:00", tagRu: "\u0414\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f", tagEn: "Tasting" },
  { day: "18", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u0414\u0436\u0430\u0437-\u0432\u0435\u0447\u0435\u0440", nameEn: "Jazz Evening", descRu: "\u0416\u0438\u0432\u0430\u044f \u043c\u0443\u0437\u044b\u043a\u0430, \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u043d\u0430\u043f\u0438\u0442\u043a\u0438, \u043a\u0430\u043c\u0435\u0440\u043d\u0430\u044f \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430.", descEn: "Live music, signature drinks, intimate atmosphere.", time: "20:00", tagRu: "\u041c\u0443\u0437\u044b\u043a\u0430", tagEn: "Music" },
  { day: "22", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u0414\u044b\u043c\u043d\u0430\u044f \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u044f", nameEn: "Smoke Ceremony", descRu: "\u0420\u0438\u0442\u0443\u0430\u043b \u043f\u043e\u0434\u0430\u0447\u0438 \u043a\u0430\u043b\u044c\u044f\u043d\u0430 \u0441 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430\u043c\u0438 \u044f\u043f\u043e\u043d\u0441\u043a\u043e\u0439 \u0447\u0430\u0439\u043d\u043e\u0439 \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u0438.", descEn: "Hookah serving ritual with Japanese tea tradition elements.", time: "19:00", tagRu: "\u0426\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u044f", tagEn: "Ceremony" },
  { day: "27", monthRu: "\u0410\u043f\u0440\u0435\u043b\u044c", monthEn: "April", nameRu: "\u041f\u0443\u044d\u0440-\u0432\u0435\u0447\u0435\u0440: \u0432\u044b\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0435 \u0441\u043e\u0440\u0442\u0430", nameEn: "Pu-erh Evening: Aged Varieties", descRu: "\u0422\u0440\u0438 \u0432\u044b\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0445 \u0448\u0443-\u043f\u0443\u044d\u0440\u0430 \u043e\u0442 5 \u0434\u043e 15 \u043b\u0435\u0442 \u0432\u044b\u0434\u0435\u0440\u0436\u043a\u0438.", descEn: "Three aged shu pu-erhs from 5 to 15 years.", time: "18:00", tagRu: "\u0414\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f", tagEn: "Tasting" },
  { day: "3", monthRu: "\u041c\u0430\u0439", monthEn: "May", nameRu: "\u041c\u0430\u0441\u0442\u0435\u0440-\u043a\u043b\u0430\u0441\u0441: \u0437\u0430\u0432\u0430\u0440\u0438\u0432\u0430\u043d\u0438\u0435 \u0433\u0443\u043d\u0444\u0443-\u0447\u0430", nameEn: "Workshop: Gongfu-cha Brewing", descRu: "\u041f\u0440\u0430\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0437\u0430\u043d\u044f\u0442\u0438\u0435 \u043f\u043e \u0442\u0435\u0445\u043d\u0438\u043a\u0435 \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u043e\u043d\u043d\u043e\u0433\u043e \u0437\u0430\u0432\u0430\u0440\u0438\u0432\u0430\u043d\u0438\u044f.", descEn: "Hands-on session on traditional brewing technique.", time: "17:00", tagRu: "\u041c\u0430\u0441\u0442\u0435\u0440-\u043a\u043b\u0430\u0441\u0441", tagEn: "Workshop" },
  { day: "10", monthRu: "\u041c\u0430\u0439", monthEn: "May", nameRu: "\u0417\u0430\u043a\u0440\u044b\u0442\u044b\u0439 \u0443\u0436\u0438\u043d", nameEn: "Private Dinner", descRu: "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u043e\u0435 \u043c\u0435\u043d\u044e \u043e\u0442 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u043e\u0433\u043e \u0448\u0435\u0444\u0430. \u041f\u0430\u0440\u0438\u043d\u0433 \u0447\u0430\u044f \u043a \u043a\u0430\u0436\u0434\u043e\u043c\u0443 \u0431\u043b\u044e\u0434\u0443.", descEn: "Guest chef's signature menu. Tea pairing for each course.", time: "19:30", tagRu: "\u0423\u0436\u0438\u043d", tagEn: "Dinner" },
];

export default function EventsPage() {
  const { t } = useLang();
  const [registerModal, setRegisterModal] = useState<number | null>(null);

  return (
    <>
      <Header />
      <button className="menu-back-btn" onClick={() => window.location.replace("/#events-preview")}>← На главную</button>
      <div className="events-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("\u041c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f", "Events")}</div>
        <div className="section-subtitle" style={{ marginBottom: 48 }}>{t("\u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u0439", "Event schedule")}</div>
        <div className="events-page-grid">
          {events.map((ev, i) => (
            <div key={i} className="event-page-card">
              <div className="event-page-dateline">{ev.day} {t(ev.monthRu, ev.monthEn).toLowerCase()} · {ev.time}</div>
              <div className="event-badge">{t(ev.tagRu, ev.tagEn)}</div>
              <div className="event-name">{t(ev.nameRu, ev.nameEn)}</div>
              <div className="event-desc">{t(ev.descRu, ev.descEn)}</div>
              <button className="event-register-btn" onClick={() => { trackEvent("click_reserve", { location: "events", event: ev.nameRu }); setRegisterModal(i); }}>{t("Забронировать", "Book")}</button>
            </div>
          ))}
        </div>
      </div>
      <div className={`modal-overlay ${registerModal !== null ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setRegisterModal(null); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setRegisterModal(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" /><line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" /></svg>
          </button>
          <div className="modal-header">{registerModal !== null ? t(events[registerModal].nameRu, events[registerModal].nameEn) : ""}</div>
          <form onSubmit={(e) => { e.preventDefault(); trackEvent("booking_submit", { source: "events", event: registerModal !== null ? events[registerModal].nameRu : "" }); setRegisterModal(null); }}>
            <div className="modal-field"><label className="modal-label">{t("\u0418\u043c\u044f", "Name")}</label><input type="text" className="modal-input" placeholder={t("\u0418\u043c\u044f \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u044f", "Full name")} required /></div>
            <div className="modal-field"><label className="modal-label">{t("\u0422\u0435\u043b\u0435\u0444\u043e\u043d", "Phone")}</label><input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required /></div>
            <button type="submit" className="modal-submit">{t("\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c", "Book")}</button>
          </form>
          <div className="modal-note">{t("\u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f", "We will contact you to confirm")}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
