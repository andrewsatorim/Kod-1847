"use client";
import { FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useReveal } from "@/hooks/useReveal";
import DiamondDivider from "./DiamondDivider";

export default function Contact() {
  const { t } = useLang();
  const ref = useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact-section" ref={ref} id="contacts">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", "Contact")}</div>
        <div className="section-subtitle">{t("\u0421\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 \u043d\u0430\u043c\u0438", "Get in touch")}</div>
      </div>

      <div className="contact-grid reveal" style={{ transitionDelay: "200ms" }}>
        <div className="contact-info-block">
          <div>
            <div className="contact-label">{t("\u0410\u0434\u0440\u0435\u0441", "Address")}</div>
            <div className="contact-value">{t("\u041c\u043e\u0441\u043a\u0432\u0430, \u0410\u0440\u0431\u0430\u0442", "Moscow, Arbat")}</div>
          </div>
          <div>
            <div className="contact-label">{t("\u0422\u0435\u043b\u0435\u0444\u043e\u043d", "Phone")}</div>
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
            <div className="contact-label">{t("\u041c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u044b", "Messengers")}</div>
            <div className="social-links">
              <a href="#" className="social-link">Telegram</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
          <div>
            <div className="contact-label">{t("\u0427\u0430\u0441\u044b \u0440\u0430\u0431\u043e\u0442\u044b", "Working hours")}</div>
            <div className="contact-value">{t("\u0415\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u043e, 14:00 \u2014 02:00", "Daily, 2:00 PM \u2014 2:00 AM")}</div>
          </div>
        </div>

        {submitted ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: "#B89860", marginBottom: 12 }}>{t("\u0421\u043f\u0430\u0441\u0438\u0431\u043e", "Thank you")}</div>
            <div style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 300, fontSize: 14, color: "#9A958B" }}>{t("\u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f", "We will contact you shortly")}</div>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" className="contact-input" placeholder={t("\u0418\u043c\u044f", "Name")} required />
            <input type="email" className="contact-input" placeholder="Email" required />
            <textarea className="contact-input contact-textarea" placeholder={t("\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435", "Message")} />
            <button type="submit" className="contact-submit">{t("\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", "Send")}</button>
          </form>
        )}
      </div>
    </section>
  );
}
