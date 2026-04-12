"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import type { Contact as ContactType } from "@/lib/types";

interface Props {
  contacts?: Record<string, ContactType>;
}

export default function Contact({ contacts }: Props) {
  const { t } = useLang();

  const address = contacts?.address;
  const hours = contacts?.hours;
  const phone = contacts?.phone;
  const telegram = contacts?.telegram;
  const instagram = contacts?.instagram;

  return (
    <section className="contact-section" id="contacts">
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("Контакты", "Contact")}</div>
      <div className="contact-two-col">
        <div className="contact-col">
          <div className="contact-item">
            <div className="contact-label">{t("Адрес", "Address")}</div>
            <div className="contact-value">{address ? t(address.value_ru, address.value_en) : t("Москва, Арбат", "Moscow, Arbat")}</div>
          </div>
          <div className="contact-item">
            <div className="contact-label">{t("Часы работы", "Hours")}</div>
            <div className="contact-value">{hours ? t(hours.value_ru, hours.value_en) : t("Ежедневно, 14:00 — 02:00", "Daily, 14:00 — 02:00")}</div>
          </div>
        </div>
        <div className="contact-col">
          <div className="contact-item">
            <div className="contact-label">{t("Телефон", "Phone")}</div>
            <div className="contact-value"><a href={`tel:${(phone?.value_ru || "+74951234567").replace(/[^+\d]/g, "")}`}>{phone?.value_ru || "+7 (495) 123-45-67"}</a></div>
          </div>
          <div className="contact-item">
            <div className="contact-label">{t("Мессенджеры", "Messengers")}</div>
            <div className="contact-social-inline">
              <a href={telegram?.value_ru || "#"} className="social-link" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href={instagram?.value_ru || "#"} className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
