"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";

const events = [
  { day: "12", monthRu: "Апрель", monthEn: "April", nameRu: "Чайная дегустация: улуны Уишань", nameEn: "Tea Tasting: Wuyi Oolongs", descRu: "Четыре улунских сорта, урожай 2024. Комментарии чайного мастера.", descEn: "Four oolong varieties, 2024 harvest. Tea master commentary.", time: "18:00", tagRu: "Дегустация", tagEn: "Tasting" },
  { day: "18", monthRu: "Апрель", monthEn: "April", nameRu: "Джаз-вечер", nameEn: "Jazz Evening", descRu: "Живая музыка, авторские напитки, камерная атмосфера.", descEn: "Live music, signature drinks, intimate atmosphere.", time: "20:00", tagRu: "Музыка", tagEn: "Music" },
  { day: "22", monthRu: "Апрель", monthEn: "April", nameRu: "Дымная церемония", nameEn: "Smoke Ceremony", descRu: "Ритуал подачи кальяна с элементами японской чайной традиции.", descEn: "Hookah serving ritual with Japanese tea tradition elements.", time: "19:00", tagRu: "Церемония", tagEn: "Ceremony" },
  { day: "27", monthRu: "Апрель", monthEn: "April", nameRu: "Пуэр-вечер: выдержанные сорта", nameEn: "Pu-erh Evening: Aged Varieties", descRu: "Три выдержанных шу-пуэра от 5 до 15 лет выдержки.", descEn: "Three aged shu pu-erhs from 5 to 15 years.", time: "18:00", tagRu: "Дегустация", tagEn: "Tasting" },
  { day: "3", monthRu: "Май", monthEn: "May", nameRu: "Мастер-класс: заваривание гунфу-ча", nameEn: "Workshop: Gongfu-cha Brewing", descRu: "Практическое занятие по технике традиционного заваривания.", descEn: "Hands-on session on traditional brewing technique.", time: "17:00", tagRu: "Мастер-класс", tagEn: "Workshop" },
  { day: "10", monthRu: "Май", monthEn: "May", nameRu: "Закрытый ужин", nameEn: "Private Dinner", descRu: "Авторское меню от приглашённого шефа. Паринг чая к каждому блюду.", descEn: "Guest chef's signature menu. Tea pairing for each course.", time: "19:30", tagRu: "Ужин", tagEn: "Dinner" },
];

export default function EventsPage() {
  const { t } = useLang();
  const [registerModal, setRegisterModal] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const openModal = (i: number) => {
    setSubmitted(false);
    setRegisterModal(i);
  };

  return (
    <>
      <Header />
      <div className="events-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Мероприятия", "Events")}</div>
        <div className="section-subtitle" style={{ marginBottom: 48 }}>{t("Расписание событий", "Event schedule")}</div>
        <div className="events-page-grid">
          {events.map((ev, i) => (
            <div key={i} className="event-page-card">
              <div className="event-badge">{t(ev.tagRu, ev.tagEn)}</div>
              <div className="event-date">{ev.day}</div>
              <div className="event-month">{t(ev.monthRu, ev.monthEn)}</div>
              <div className="event-name">{t(ev.nameRu, ev.nameEn)}</div>
              <div className="event-desc">{t(ev.descRu, ev.descEn)}</div>
              <div className="event-time">{ev.time}</div>
              <button className="event-register-btn" onClick={() => openModal(i)}>{t("Записаться", "Register")}</button>
            </div>
          ))}
        </div>
      </div>
      <div className={`modal-overlay ${registerModal !== null ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setRegisterModal(null); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setRegisterModal(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" /><line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" /></svg>
          </button>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: "#B89860", marginBottom: 12 }}>{t("Спасибо", "Thank you")}</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 300, fontSize: 14, color: "#9A958B" }}>{t("Мы свяжемся для подтверждения регистрации", "We will contact you to confirm your registration")}</div>
            </div>
          ) : (
            <>
              <div className="modal-header">{registerModal !== null ? t(events[registerModal].nameRu, events[registerModal].nameEn) : ""}</div>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="modal-field"><label className="modal-label">{t("Имя", "Name")}</label><input type="text" className="modal-input" placeholder={t("Имя и фамилия", "Full name")} required /></div>
                <div className="modal-field"><label className="modal-label">{t("Телефон", "Phone")}</label><input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required /></div>
                <div className="modal-field"><label className="modal-label">Email</label><input type="email" className="modal-input" placeholder="email@example.com" required /></div>
                <button type="submit" className="modal-submit">{t("Записаться", "Register")}</button>
              </form>
              <div className="modal-note">{t("Мы свяжемся для подтверждения", "We will contact you to confirm")}</div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
