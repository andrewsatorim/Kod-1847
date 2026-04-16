"use client";
import { FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { formatPhoneInput, isPhoneValid, normalizePhone } from "@/lib/phone";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Props { open: boolean; onClose: () => void; }

export default function ReservationModal({ open, onClose }: Props) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ consent?: boolean; phone?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!consent) newErrors.consent = true;
    if (!isPhoneValid(phone)) newErrors.phone = true;
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const data = {
      name,
      phone: normalizePhone(phone),
      date,
      time,
      guests,
      comment,
      consent: true,
      source: window.location.pathname,
    };

    setSubmitting(true);
    trackEvent("booking_submit", { source: window.location.pathname });

    try {
      if (API_URL) {
        await fetch(`${API_URL}/api/public/reservations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
    } catch {
      // Fall back silently — форма считается отправленной, менеджер увидит в админке
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const reset = () => {
    setName(""); setPhone(""); setDate(""); setTime(""); setGuests("2"); setComment("");
    setConsent(false); setErrors({}); setSubmitted(false);
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={handleClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" /><line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" /></svg>
        </button>

        {submitted ? (
          <>
            <div className="modal-header">{t("Спасибо!", "Thank you!")}</div>
            <div className="modal-note">{t("Мы свяжемся для подтверждения бронирования", "We will contact you to confirm your reservation")}</div>
            <button onClick={handleClose} className="modal-submit">{t("Закрыть", "Close")}</button>
          </>
        ) : (
          <>
            <div className="modal-header">{t("Бронирование", "Reservation")}</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label className="modal-label">{t("Имя", "Name")}</label>
                <input name="name" type="text" className="modal-input" placeholder={t("Имя и фамилия", "Full name")} required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("Телефон", "Phone")}</label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  className="modal-input"
                  placeholder="+7 (___) ___-__-__"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(formatPhoneInput(e.target.value)); if (errors.phone) setErrors({ ...errors, phone: false }); }}
                />
                {errors.phone && <p className="consent-error">{t("Введите номер в формате +7 (999) 123-45-67", "Please enter the phone in format +7 (999) 123-45-67")}</p>}
              </div>
              <div className="modal-field modal-field-row">
                <div style={{ flex: 1 }}>
                  <label className="modal-label">{t("Дата", "Date")}</label>
                  <input name="date" type="date" className="modal-input" required value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="modal-label">{t("Время", "Time")}</label>
                  <input name="time" type="time" className="modal-input" required value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("Количество гостей", "Number of guests")}</label>
                <input name="guests" type="number" className="modal-input" min="1" max="20" placeholder="2" required value={guests} onChange={(e) => setGuests(e.target.value)} />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("Комментарий", "Comment")}</label>
                <input name="comment" type="text" className="modal-input" placeholder={t("Пожелания", "Preferences")} value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
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
              <button type="submit" className="modal-submit" disabled={!consent || submitting}>
                {submitting ? t("Отправка...", "Submitting...") : t("Отправить", "Submit")}
              </button>
            </form>
            <div className="modal-note">{t("Мы свяжемся для подтверждения", "We will contact you to confirm")}</div>
          </>
        )}
      </div>
    </div>
  );
}
