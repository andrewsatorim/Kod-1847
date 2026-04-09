"use client";
import { FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReservationModal({ open, onClose }: Props) {
  const { t } = useLang();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
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
        <div className="modal-header">{t("Бронирование", "Reservation")}</div>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">{t("Имя", "Name")}</label>
            <input type="text" className="modal-input" placeholder={t("Имя и фамилия", "Full name")} required />
          </div>
          <div className="modal-field">
            <label className="modal-label">{t("Телефон", "Phone")}</label>
            <input type="tel" className="modal-input" placeholder="+7 (___) ___ __ __" required />
          </div>
          <div className="modal-field">
            <label className="modal-label">{t("Дата", "Date")}</label>
            <input type="date" className="modal-input" required />
          </div>
          <div className="modal-field">
            <label className="modal-label">{t("Количество гостей", "Number of guests")}</label>
            <input type="number" className="modal-input" min="1" max="20" placeholder="2" required />
          </div>
          <div className="modal-field">
            <label className="modal-label">{t("Комментарий", "Comment")}</label>
            <input type="text" className="modal-input" placeholder={t("Пожелания", "Preferences")} />
          </div>
          <button type="submit" className="modal-submit">{t("Отправить", "Submit")}</button>
        </form>
        <div className="modal-note">{t("Мы свяжемся для подтверждения", "We will contact you to confirm")}</div>
      </div>
    </div>
  );
}
