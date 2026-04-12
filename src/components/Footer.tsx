"use client";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";
import type { Contact } from "@/lib/types";

interface Props {
  contacts?: Record<string, Contact>;
}

export default function Footer({ contacts }: Props) {
  const { t } = useLang();
  const telegram = contacts?.telegram;

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">КОД 1847</div>
        <div className="footer-links">
          <Link href="/menu" className="footer-link">{t("Меню", "Menu")}</Link>
          <Link href="/events" className="footer-link">{t("Мероприятия", "Events")}</Link>
          <a href="#contacts" className="footer-link">{t("Контакты", "Contact")}</a>
          <a href={telegram?.value_ru || "#"} className="footer-link" target="_blank" rel="noopener noreferrer">Telegram</a>
        </div>
        <div className="footer-copy">© 2026 Код 1847. {t("Все права защищены", "All rights reserved")}.</div>
      </div>
    </footer>
  );
}
