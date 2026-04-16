"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

interface Props { open: boolean; onClose: () => void; }

const ANALYTICS_API = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "https://analytics.kod1847.ru";

// Слоты с 14:00 до 02:00 (с переходом через полночь) с шагом 30 минут.
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let m = 14 * 60; m <= 26 * 60; m += 30) {
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
})();

const initial = { name: "", phone: "", date: "", time: "14:00", guests: "2", comment: "" };

const ITEM_H = 36;

function TimeWheel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const idx = Math.max(0, TIME_SLOTS.indexOf(value));
    lockRef.current = true;
    ref.current.scrollTo({ top: idx * ITEM_H, behavior: "auto" });
    setTimeout(() => { lockRef.current = false; }, 50);
  }, [value]);

  const onScroll = () => {
    if (!ref.current || lockRef.current) return;
    if (settleRef.current) clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      if (!ref.current) return;
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(TIME_SLOTS.length - 1, idx));
      const v = TIME_SLOTS[clamped];
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
      if (v && v !== value) onChange(v);
    }, 90);
  };

  return (
    <div style={{ position: "relative", height: ITEM_H * 5, marginTop: 4 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: ITEM_H * 2, height: ITEM_H, borderTop: "1px solid #B89860", borderBottom: "1px solid #B89860", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ITEM_H * 2, background: "linear-gradient(#08080A, rgba(8,8,10,0))", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: ITEM_H * 2, background: "linear-gradient(rgba(8,8,10,0), #08080A)", pointerEvents: "none", zIndex: 2 }} />
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          paddingTop: ITEM_H * 2,
          paddingBottom: ITEM_H * 2,
          scrollbarWidth: "none",
        }}
      >
        {TIME_SLOTS.map(s => (
          <div
            key={s}
            style={{
              height: ITEM_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scrollSnapAlign: "center",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: s === value ? 22 : 16,
              color: s === value ? "#F5F0E8" : "#6B6760",
              transition: "color .15s, font-size .15s",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    try {
      await fetch(`${ANALYTICS_API}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          date: `${form.date} ${form.time}`,
          guests: form.guests,
          comment: form.comment,
          consent,
          source,
        }),
      });
    } catch { /* не блокируем UX */ }
    trackEvent("booking_submit", { source });
    setSending(false);
    setDone(true);
    setTimeout(() => { reset(); onClose(); }, 1400);
  };

  const handleClose = () => { reset(); onClose(); };
  const today = new Date().toISOString().slice(0, 10);

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
            <div className="modal-field"><label className="modal-label">{t("Дата", "Date")}</label><input type="date" className="modal-input" required min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="modal-field">
              <label className="modal-label">{t("Время", "Time")}</label>
              <TimeWheel value={form.time || TIME_SLOTS[0]} onChange={(v) => setForm({ ...form, time: v })} />
              <div style={{ marginTop: 6, fontSize: 11, color: "#6B6760", textAlign: "center" }}>{t("Время работы: с 14:00 до 02:00", "Hours: 2pm – 2am")}</div>
            </div>
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
