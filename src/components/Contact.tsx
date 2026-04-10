"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function Contact() {
  const { t } = useLang();

  return (
    <section className="contact-section" id="contacts">
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", "Contact")}</div>
      <div className="contact-row">
        <div className="contact-item">
          <div className="contact-label">{t("\u0410\u0434\u0440\u0435\u0441", "Address")}</div>
          <div className="contact-value">{t("\u041c\u043e\u0441\u043a\u0432\u0430, \u0410\u0440\u0431\u0430\u0442", "Moscow, Arbat")}</div>
        </div>
        <div className="contact-item">
          <div className="contact-label">{t("\u0422\u0435\u043b\u0435\u0444\u043e\u043d", "Phone")}</div>
          <div className="contact-value"><a href="tel:+74951234567">+7 (495) 123-45-67</a></div>
        </div>
        <div className="contact-item">
          <div className="contact-label">{t("\u0427\u0430\u0441\u044b \u0440\u0430\u0431\u043e\u0442\u044b", "Hours")}</div>
          <div className="contact-value">{t("\u0415\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u043e, 14:00 \u2014 02:00", "Daily, 14:00 \u2014 02:00")}</div>
        </div>
      </div>
      <div className="contact-social">
        <a href="#" className="social-link">Telegram</a>
        <a href="#" className="social-link">Instagram</a>
      </div>
    </section>
  );
}
