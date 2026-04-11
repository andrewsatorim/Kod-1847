"use client";
import { FormEvent, useState, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReservationModal({ open, onClose }: Props) {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) setSubmitted(false);
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="14" y2="14" stroke="#9A958B" strokeWidth="1" />
            <line x1="14" y1="2" x2="2" y2="14" stroke="#9A958B" strokeWidth="1" />
          </svg>
        </button>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: "#B89860", marginBottom: 12 }}>{t("\u0421\u043f\u0430\u0441\u0438\u0431\u043e", "Thank you")}</div>
            <div style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 300, fontSize: 14, color: "#9A958B" }}>{t("\u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u0432\u0430\u0448\u0435\u0433\u043e \u0432\u0438\u0437\u0438\u0442\u0430", "We will contact you to confirm your visit")}</div>
          </div>
        ) : (
          <>
            <div className="modal-header">{t("\u0411\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435", "Reservation")}</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label className="modal-label">{t("\u0418\u043c\u044f", "Name")}</label>
                <input type="text" className="modal-input" placeholder={t("\u0418\u043c\u044f \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u044f", "Full name")} required />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("\u0422\u0435\u043b\u0435\u0444\u043e\u043d", "Phone")}</label>
                <input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("\u0414\u0430\u0442\u0430", "Date")}</label>
                <input type="date" className="modal-input" required />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0433\u043e\u0441\u0442\u0435\u0439", "Number of guests")}</label>
                <input type="number" className="modal-input" min="1" max="20" placeholder="2" required />
              </div>
              <div className="modal-field">
                <label className="modal-label">{t("\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439", "Comment")}</label>
                <input type="text" className="modal-input" placeholder={t("\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u044f", "Preferences")} />
              </div>
              <button type="submit" className="modal-submit">{t("\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", "Submit")}</button>
            </form>
            <div className="modal-note">{t("\u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f", "We will contact you to confirm")}</div>
          </>
        )}
      </div>
    </div>
  );
}
