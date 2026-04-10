"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function MenuPreview() {
  const { t } = useLang();

  return (
    <section className="menu-preview" id="menu-preview">
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("\u041a\u0430\u0440\u0442\u0430", "Menu")}</div>
      <div className="section-subtitle">{t("\u0427\u0430\u0439\u043d\u0430\u044f \u0438 \u043a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u044b \u043a\u043b\u0443\u0431\u0430", "Tea and hookah menus")}</div>
      <div className="menu-pdf-buttons">
        <a href="/Kod1847_Tea_Menu.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
          {t("\u0427\u0430\u0439\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "Tea Menu")}
        </a>
        <a href="/Kod1847_Hookah_Menu2.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
          {t("\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "Hookah Menu")}
        </a>
      </div>
    </section>
  );
}
