"use client";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">КОД 1847</div>
        <div className="footer-links">
          <Link href="/menu" className="footer-link">{t("Меню", "Menu")}</Link>
          <Link href="/events" className="footer-link">{t("Мероприятия", "Events")}</Link>
          <a href="#contacts" className="footer-link">{t("Контакты", "Contact")}</a>
          <a href="#" className="footer-link" onClick={() => trackEvent("click_telegram", { location: "footer" })}>Telegram</a>
        </div>
        <div className="footer-copy">© 2026 Код 1847. {t("Все права защищены", "All rights reserved")}.</div>
      </div>
    </footer>
  );
}
