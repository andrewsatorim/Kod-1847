"use client";
import { FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { submitBookingRequest } from "@/lib/bookings";
import Link from "next/link";

interface Props { open: boolean; onClose: () => void; }

const initial = { name: "", phone: "", date: "", time: "", guests: "2", comment: "" };

export default function ReservationModal({ open, onClose }: Props) {
  const { t } = useLang();
  const [form, setForm] = useState(initial);
  const [consent, setConsent] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => { setForm(initial); setConsent(false); setShowError(false); setDone(false); setSending(false); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) { setShowError(true); return; }
    setSending(true);
    const source = typeof window !== "undefined" ? window.location.pathname : "/";
    await submitBookingRequest({
      guest_name: form.name,
      phone: form.phone,
      visit_date: form.date || null,
      visit_time: form.time || null,
      guests_count: form.guests ? parseInt(form.guests, 10) : null,
      comment: form.comment || null,
      source,
      consent_pdn: consent,
    });
    trackEvent("booking_submit", { source });
    setSending(false);
    setDone(true);
    setTimeout(() => { reset(); onClose(); }, 1400);
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={handleClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" /><line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" /></svg>
        </button>
        <div className="modal-header">{t("Бронирование", "Reservation")}</div>
        {done ? (
          <div style={{ textAlign: "center", padding: "32px 0 8px" }}>
            <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, color: "#B89860", marginBottom: 12 }}>{t("Заявка отправлена", "Request sent")}</div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: 14, color: "#9A958B" }}>{t("Мы свяжемся с вами для подтверждения", "We will contact you to confirm")}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-field"><label className="modal-label">{t("Имя", "Name")}</label><input type="text" className="modal-input" placeholder={t("Имя и фамилия", "Full name")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="modal-field"><label className="modal-label">{t("Телефон", "Phone")}</label><input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="modal-field"><label className="modal-label">{t("Дата", "Date")}</label><input type="date" className="modal-input" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="modal-field"><label className="modal-label">{t("Время", "Time")}</label><input type="time" className="modal-input" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
            <div className="modal-field"><label className="modal-label">{t("Количество гостей", "Number of guests")}</label><input type="number" className="modal-input" min="1" max="20" placeholder="2" required value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} /></div>
            <div className="modal-field"><label className="modal-label">{t("Комментарий", "Comment")}</label><input type="text" className="modal-input" placeholder={t("Пожелания", "Preferences")} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /></div>
            <div className="consent-block">
              <label className="consent-label">
                <input type="checkbox" className="consent-checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setShowError(false); }} />
                <span className="consent-checkmark" />
                <span className="consent-text">
                  {t("Я даю согласие на обработку персональных данных в соответствии с ", "I consent to the processing of personal data in accordance with the ")}
                  <Link href="/privacy" target="_blank" className="consent-link" onClick={(e) => e.stopPropagation()}>
                    {t("Политикой конфиденциальности", "Privacy Policy")}
                  </Link>
                </span>
              </label>
              {showError && <p className="consent-error">{t("Для отправки заявки необходимо дать согласие на обработку персональных данных", "You must consent to the processing of personal data to submit")}</p>}
            </div>
            <button type="submit" className="modal-submit" disabled={!consent || sending}>{sending ? t("Отправка...", "Sending...") : t("Отправить", "Submit")}</button>
          </form>
        )}
        <div className="modal-note">{t("Мы свяжемся для подтверждения", "We will contact you to confirm")}</div>
      </div>
    </div>
  );
}
