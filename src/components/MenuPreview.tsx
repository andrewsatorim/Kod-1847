"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

const particles = [
  { left: "15%", bottom: "20%", duration: "7s", delay: "0s" },
  { left: "35%", bottom: "15%", duration: "8s", delay: "1s" },
  { left: "55%", bottom: "25%", duration: "6.5s", delay: "2s" },
  { left: "75%", bottom: "18%", duration: "9s", delay: "3s" },
  { left: "90%", bottom: "10%", duration: "7.5s", delay: "4s" },
];

export default function MenuPreview() {
  const { t } = useLang();

  return (
    <section className="menu-preview" id="menu-preview">
      <div className="menu-preview-bg" />
      <div className="menu-preview-glow" />
      {particles.map((p, i) => (
        <div key={i} className="ptc" style={{ left: p.left, bottom: p.bottom, animation: `fl ${p.duration} ease-in-out infinite ${p.delay}` }} />
      ))}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("\u041c\u0435\u043d\u044e", "Menu")}</div>
        <div className="section-subtitle">{t("\u0427\u0430\u0439\u043d\u0430\u044f \u0438 \u043a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u044b \u043a\u043b\u0443\u0431\u0430", "Tea and hookah menus")}</div>
        <div className="menu-pdf-buttons">
          <a href="/Kod1847_Tea_Menu.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
            {t("\u0427\u0430\u0439\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "Tea Menu")}
          </a>
          <a href="/Kod1847_Hookah_Menu2.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
            {t("\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "Hookah Menu")}
          </a>
        </div>
      </div>
    </section>
  );
}
