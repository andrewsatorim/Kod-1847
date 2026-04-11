"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function Contact() {
  const { t } = useLang();

  return (
    <section className="contact-section" id="contacts">
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("Контакты", "Contact")}</div>
      <div className="contact-two-col">
        <div className="contact-col">
          <div className="contact-item">
            <div className="contact-label">{t("Адрес", "Address")}</div>
            <div className="contact-value">{t("Москва, Арбат", "Moscow, Arbat")}</div>
          </div>
          <div className="contact-item">
            <div className="contact-label">{t("Часы работы", "Hours")}</div>
            <div className="contact-value">{t("Ежедневно, 14:00 — 02:00", "Daily, 14:00 — 02:00")}</div>
          </div>
        </div>
        <div className="contact-col">
          <div className="contact-item">
            <div className="contact-label">{t("Телефон", "Phone")}</div>
            <div className="contact-value"><a href="tel:+74951234567">+7 (495) 123-45-67</a></div>
          </div>
          <div className="contact-item">
            <div className="contact-label">{t("Мессенджеры", "Messengers")}</div>
            <div className="contact-social-inline">
              <a href="#" className="social-link">Telegram</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
