"use client";
import { FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { formatPhoneInput, isPhoneValid, normalizePhone } from "@/lib/phone";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ consent?: boolean; phone?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!consent) newErrors.consent = true;
    if (!isPhoneValid(phone)) newErrors.phone = true;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    setSubmitting(true);
    trackEvent("booking_submit", { source: "club_membership" });

    try {
      if (API_URL) {
        await fetch(`${API_URL}/api/public/reservations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone: normalizePhone(phone),
            date: "",
            time: "",
            guests: "",
            comment: `Email: ${email}\nКак узнал: ${howHeard}${message ? "\nСообщение: " + message : ""}`,
            consent: true,
            source: "club_membership",
          }),
        });
      }
    } catch {
      // Молча продолжаем — заявка отображается как отправленная
    }

    setSubmitting(false);
    setSubmitted(true);
  };

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
              <input type="text" className="contact-input" placeholder={t("Имя", "Name")} required value={name} onChange={(e) => setName(e.target.value)} />
              <input
                type="tel"
                inputMode="tel"
                className="contact-input"
                placeholder="+7 (___) ___-__-__"
                required
                value={phone}
                onChange={(e) => { setPhone(formatPhoneInput(e.target.value)); if (errors.phone) setErrors({ ...errors, phone: false }); }}
              />
              {errors.phone && <p className="consent-error" style={{ marginTop: -8 }}>{t("Введите номер в формате +7 (999) 123-45-67", "Enter phone as +7 (999) 123-45-67")}</p>}
              <input type="email" className="contact-input" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <div>
                <label className="contact-label" style={{ marginBottom: 8, display: "block" }}>{t("Как узнали о клубе?", "How did you learn about the club?")}</label>
                <select className="contact-input" style={{ appearance: "none", cursor: "pointer" }} required value={howHeard} onChange={(e) => setHowHeard(e.target.value)}>
                  <option value="" style={{ background: "#08080A" }}>{t("Выберите", "Select")}</option>
                  {howHeardOptions.map((opt, i) => (<option key={i} value={opt.ru} style={{ background: "#08080A" }}>{t(opt.ru, opt.en)}</option>))}
                </select>
              </div>
              <textarea className="contact-input contact-textarea" placeholder={t("Сообщение (по желанию)", "Message (optional)")} value={message} onChange={(e) => setMessage(e.target.value)} />
              <div className="consent-block">
                <label className="consent-label">
                  <input type="checkbox" className="consent-checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setErrors({ ...errors, consent: false }); }} />
                  <span className="consent-checkmark" />
                  <span className="consent-text">
                    {t("Я даю согласие на обработку персональных данных в соответствии с ", "I consent to the processing of personal data in accordance with the ")}
                    <Link href="/privacy" target="_blank" className="consent-link" onClick={(e) => e.stopPropagation()}>
                      {t("Политикой конфиденциальности", "Privacy Policy")}
                    </Link>
                  </span>
                </label>
                {errors.consent && <p className="consent-error">{t("Для отправки заявки необходимо дать согласие на обработку персональных данных", "You must consent to the processing of personal data to submit")}</p>}
              </div>
              <button type="submit" className="contact-submit" style={{ alignSelf: "center" }} disabled={!consent || submitting}>{submitting ? t("Отправка...", "Submitting...") : t("Отправить заявку", "Submit application")}</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
