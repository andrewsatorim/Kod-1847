"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

export default function Header() {
  const { lang, toggle, setLang, t } = useLang();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero-sentinel");
    if (!heroEl) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setVisible(!e.isIntersecting));
      },
      { threshold: 0.6 }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { href: "/#about", labelRu: "О клубе", labelEn: "About" },
    { href: "/#zones", labelRu: "Зоны", labelEn: "Zones" },
    { href: "/menu", labelRu: "Карта", labelEn: "Menu" },
    { href: "/events", labelRu: "Мероприятия", labelEn: "Events" },
    { href: "/#gallery", labelRu: "Галерея", labelEn: "Gallery" },
    { href: "/#contacts", labelRu: "Контакты", labelEn: "Contact" },
  ];

  return (
    <>
      <nav className={`top-nav ${visible ? "visible" : ""}`}>
        <div className="menu-btn" onClick={() => setMobileOpen(true)}>
          <span /><span />
        </div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {t(link.labelRu, link.labelEn)}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className={`lang-option ${lang === "ru" ? "lang-active" : ""}`}
            onClick={() => setLang("ru")}
            style={{ cursor: "pointer" }}
          >RU</span>
          <div className={`lang-toggle ${lang === "en" ? "en" : ""}`} onClick={toggle} style={{ cursor: "pointer" }}>
            <div className="lang-thumb" />
          </div>
          <span
            className={`lang-option ${lang === "en" ? "lang-active" : ""}`}
            onClick={() => setLang("en")}
            style={{ cursor: "pointer" }}
          >EN</span>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="3" x2="17" y2="17" stroke="#B89860" strokeWidth="1" />
            <line x1="17" y1="3" x2="3" y2="17" stroke="#B89860" strokeWidth="1" />
          </svg>
        </button>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-menu-link"
            onClick={() => setMobileOpen(false)}
          >
            {t(link.labelRu, link.labelEn)}
          </Link>
        ))}
      </div>
    </>
  );
}
