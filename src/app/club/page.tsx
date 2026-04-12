"use client";
import { FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";

const levels = [
  { nameRu: "Разовое посещение", nameEn: "Single Visit", subRu: "По рекомендации члена клуба", subEn: "By member recommendation", featuresRu: ["Доступ в оба зала", "Полная карта чая и кальянов", "Бронирование через рекомендателя"], featuresEn: ["Access to both halls", "Full tea and hookah menu", "Booking via recommender"], priceRu: "По запросу", priceEn: "On request", featured: false },
  { nameRu: "Член клуба", nameEn: "Member", subRu: "Полное членство", subEn: "Full membership", featuresRu: ["Персональная членская карта", "Приоритетное бронирование", "Закрытые мероприятия", "Специальные условия на церемонии", "Гостевые приглашения"], featuresEn: ["Personal membership card", "Priority booking", "Private events", "Special ceremony rates", "Guest invitations"], priceRu: "По запросу", priceEn: "On request", featured: true },
  { nameRu: "Резидент", nameEn: "Resident", subRu: "Высший статус", subEn: "Highest tier", featuresRu: ["Все привилегии члена клуба", "Именной стол", "Персональный мастер", "Участие в закрытых ужинах", "Лимитированные сорта", "Клубная латунная карта"], featuresEn: ["All member privileges", "Personal table", "Dedicated master", "Private dinner access", "Limited editions", "Brass club card"], priceRu: "По запросу", priceEn: "On request", featured: false },
];

const howHeardOptions = [
  { ru: "Рекомендация друга", en: "Friend's recommendation" },
  { ru: "Социальные сети", en: "Social media" },
  { ru: "Деловые контакты", en: "Business contacts" },
  { ru: "Другое", en: "Other" },
];

export default function ClubPage() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); trackEvent("booking_submit", { source: "club_membership" }); setSubmitted(true); };

  return (
    <>
      <Header />
      <div className="club-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Членство", "Membership")}</div>
        <div className="section-subtitle" style={{ marginBottom: 48 }}>{t("Три уровня принадлежности", "Three levels of belonging")}</div>
        <div className="membership-grid">
          {levels.map((level, i) => (
            <div key={i} className={`membership-card ${level.featured ? "featured" : ""}`}>
              <div className="membership-level">{t(level.nameRu, level.nameEn)}</div>
              <div className="membership-subtitle">{t(level.subRu, level.subEn)}</div>
              <ul className="membership-features">
                {(t(level.featuresRu.join("|||"), level.featuresEn.join("|||"))).split("|||").map((f, fi) => (
                  <li key={fi} className="membership-feature">{f}</li>
                ))}
              </ul>
              <div className="membership-price">{t(level.priceRu, level.priceEn)}</div>
            </div>
          ))}
        </div>
        <div className="club-form">
          <DiamondDivider className="phil-visible" />
          <div className="club-form-title" style={{ marginTop: 40 }}>{t("Заявка на членство", "Membership Application")}</div>
          <div className="club-form-sub">{t("Заполните форму — мы свяжемся с вами", "Fill in the form — we will contact you")}</div>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, color: "#B89860", marginBottom: 12 }}>{t("Спасибо", "Thank you")}</div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: 14, color: "#9A958B" }}>{t("Мы свяжемся с вами в ближайшее время", "We will contact you shortly")}</div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <input type="text" className="contact-input" placeholder={t("Имя", "Name")} required />
              <input type="tel" className="contact-input" placeholder={t("Телефон", "Phone")} required />
              <input type="email" className="contact-input" placeholder="Email" required />
              <div>
                <label className="contact-label" style={{ marginBottom: 8, display: "block" }}>{t("Как узнали о клубе?", "How did you learn about the club?")}</label>
                <select className="contact-input" style={{ appearance: "none", cursor: "pointer" }} required>
                  <option value="" style={{ background: "#08080A" }}>{t("Выберите", "Select")}</option>
                  {howHeardOptions.map((opt, i) => (<option key={i} value={opt.ru} style={{ background: "#08080A" }}>{t(opt.ru, opt.en)}</option>))}
                </select>
              </div>
              <textarea className="contact-input contact-textarea" placeholder={t("Сообщение (по желанию)", "Message (optional)")} />
              <button type="submit" className="contact-submit" style={{ alignSelf: "center" }}>{t("Отправить заявку", "Submit application")}</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
