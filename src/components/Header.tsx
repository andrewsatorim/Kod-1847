"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

export default function Header() {
  const { lang, toggle, setLang, t } = useLang();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const heroEl = document.querySelector(".hero");
    if (!heroEl) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => setVisible(!e.isIntersecting)); },
      { threshold: 0.6 }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { href: "/#about", labelRu: "\u041e \u043a\u043b\u0443\u0431\u0435", labelEn: "About" },
    { href: "/tea-room", labelRu: "\u0427\u0430\u0439\u043d\u044b\u0439 \u0437\u0430\u043b", labelEn: "Tea Room" },
    { href: "/hookah-room", labelRu: "\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u044b\u0439 \u0437\u0430\u043b", labelEn: "Hookah Room" },
    { href: "/menu", labelRu: "\u041c\u0435\u043d\u044e", labelEn: "Menu" },
    { href: "/events", labelRu: "\u041c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f", labelEn: "Events" },
    { href: "/partnership", labelRu: "Партнёрство", labelEn: "Partnership" },
    { href: "/#contacts", labelRu: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", labelEn: "Contact" },
  ];

  return (
    <>
      <nav className={`top-nav ${visible ? "visible" : ""}`}>
        <div className="menu-btn" onClick={() => setMobileOpen(true)}><span /><span /></div>
        <div className="nav-links">
          {navLinks.map((link) => (<Link key={link.href} href={link.href} className="nav-link">{t(link.labelRu, link.labelEn)}</Link>))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`lang-option ${lang === "ru" ? "lang-active" : ""}`} onClick={() => setLang("ru")} style={{ cursor: "pointer" }}>RU</span>
          <div className={`lang-toggle ${lang === "en" ? "en" : ""}`} onClick={toggle} style={{ cursor: "pointer" }}><div className="lang-thumb" /></div>
          <span className={`lang-option ${lang === "en" ? "lang-active" : ""}`} onClick={() => setLang("en")} style={{ cursor: "pointer" }}>EN</span>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="3" x2="17" y2="17" stroke="#B89860" strokeWidth="1" /><line x1="17" y1="3" x2="3" y2="17" stroke="#B89860" strokeWidth="1" /></svg>
        </button>
        {navLinks.map((link) => (<Link key={link.href} href={link.href} className="mobile-menu-link" onClick={() => setMobileOpen(false)}>{t(link.labelRu, link.labelEn)}</Link>))}
      </div>
    </>
  );
}
