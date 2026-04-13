"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner-new">
        {/* Column 1: Contacts */}
        <div className="footer-col">
          <div className="footer-brand">КОД 1847</div>
          <div className="footer-desc">Частный чайный клуб на Арбате</div>
          <div className="footer-contacts">
            <a href="tel:+79015359000" className="footer-contact-link">
              +7 (901) 535-90-00
            </a>
            <a href="mailto:info@kod1847.ru" className="footer-contact-link">
              info@kod1847.ru
            </a>
          </div>
        </div>

        {/* Column 2: Requisites */}
        <div className="footer-col">
          <div className="footer-col-title">ООО &laquo;РАНИКО&raquo;</div>
          <div className="footer-requisites">
            <span>ИНН 7743340610 / КПП 773301001</span>
            <span>ОГРН 1207700189575</span>
            <span>125364, г. Москва, б-р Химкинский,</span>
            <span>д. 14, к. 1, помещ. 4/1</span>
          </div>
        </div>

        {/* Column 3: Legal Links */}
        <div className="footer-col">
          <div className="footer-col-title">Документы</div>
          <div className="footer-legal-links">
            <Link href="/privacy" className="footer-legal-link">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="footer-legal-link">
              Пользовательское соглашение
            </Link>
            <Link href="/offer" className="footer-legal-link">
              Публичная оферта
            </Link>
            <Link href="/cookies" className="footer-legal-link">
              Политика cookies
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 ООО &laquo;РАНИКО&raquo;. Все права защищены.
      </div>
    </footer>
  );
}
