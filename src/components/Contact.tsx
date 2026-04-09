"use client";
import { useEffect, useRef, FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function Contact() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder for form submission
  };

  return (
    <section className="contact-section" ref={ref} id="contacts">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Контакты", "Contact")}</div>
        <div className="section-subtitle">{t("Свяжитесь с нами", "Get in touch")}</div>
      </div>

      <div className="contact-grid reveal" style={{ transitionDelay: "200ms" }}>
        <div className="contact-info-block">
          <div>
            <div className="contact-label">{t("Адрес", "Address")}</div>
            <div className="contact-value">{t("Москва, Арбат", "Moscow, Arbat")}</div>
          </div>
          <div>
            <div className="contact-label">{t("Телефон", "Phone")}</div>
            <div className="contact-value">
              <a href="tel:+74951234567">+7 (495) 123-45-67</a>
            </div>
          </div>
          <div>
            <div className="contact-label">Email</div>
            <div className="contact-value">
              <a href="mailto:info@kod1847.ru">info@kod1847.ru</a>
            </div>
          </div>
          <div>
            <div className="contact-label">{t("Мессенджеры", "Messengers")}</div>
            <div className="social-links">
              <a href="#" className="social-link">Telegram</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
          <div>
            <div className="contact-label">{t("Часы работы", "Working hours")}</div>
            <div className="contact-value">{t("Ежедневно, 14:00 — 02:00", "Daily, 2:00 PM — 2:00 AM")}</div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="contact-input"
            placeholder={t("Имя", "Name")}
            required
          />
          <input
            type="email"
            className="contact-input"
            placeholder="Email"
            required
          />
          <textarea
            className="contact-input contact-textarea"
            placeholder={t("Сообщение", "Message")}
          />
          <button type="submit" className="contact-submit">
            {t("Отправить", "Send")}
          </button>
        </form>
      </div>
    </section>
  );
}
