"use client";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          {/* Column 1: Contacts */}
          <div className="footer-col">
            <div className="footer-logo">КОД 1847</div>
            <div className="footer-col-sub">{t("Частный чайный клуб на Арбате", "Private tea club on Arbat")}</div>
            <a href="tel:+79015359000" className="footer-col-line">+7 (901) 535-90-00</a>
            <a href="mailto:info@kod1847.ru" className="footer-col-line">info@kod1847.ru</a>
          </div>

          {/* Column 2: Legal entity */}
          <div className="footer-col">
            <div className="footer-col-heading">{t("Реквизиты", "Legal info")}</div>
            <div className="footer-col-line">ООО «РАНИКО»</div>
            <div className="footer-col-line"><span className="footer-num">ИНН 7743340610</span> / <span className="footer-num">КПП 773301001</span></div>
            <div className="footer-col-line"><span className="footer-num">ОГРН 1207700189575</span></div>
            <div className="footer-col-line"><span className="footer-num">125364</span>, г. Москва, б-р Химкинский, д. <span className="footer-num">14</span>, к. <span className="footer-num">1</span>, помещ. <span className="footer-num">4/1</span></div>
          </div>

          {/* Column 3: Legal documents */}
          <div className="footer-col">
            <div className="footer-col-heading">{t("Документы", "Documents")}</div>
            <Link href="/privacy" className="footer-doc-link">{t("Политика конфиденциальности", "Privacy Policy")}</Link>
            <Link href="/terms" className="footer-doc-link">{t("Пользовательское соглашение", "Terms of Use")}</Link>
            <Link href="/offer" className="footer-doc-link">{t("Публичная оферта", "Public Offer")}</Link>
            <Link href="/cookies" className="footer-doc-link">{t("Политика cookies", "Cookie Policy")}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 ООО «РАНИКО». {t("Все права защищены", "All rights reserved")}.</div>
        </div>
      </div>
    </footer>
  );
}
