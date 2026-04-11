"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function MenuPreview({ onReserve }: { onReserve: () => void }) {
  const { t } = useLang();

  return (
    <section className="menu-preview" id="menu-preview">
      <div className="menu-preview-bg" />
      <div className="menu-preview-glow" />
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("\u041c\u0435\u043d\u044e", "Menu")}</div>
      <div className="section-subtitle">{t("\u0427\u0430\u0439\u043d\u0430\u044f \u0438 \u043a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u044b \u043a\u043b\u0443\u0431\u0430", "Tea and hookah menus")}</div>
      <div className="menu-pdf-buttons">
        <a href="/Kod1847_Tea_Menu.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">{t("Чайная карта", "Tea Menu")}</a>
        <div className="menu-pdf-divider" />
        <a href="/Kod1847_Hookah_Menu2.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">{t("Кальянная карта", "Hookah Menu")}</a>
      </div>
      <button className="menu-reserve-btn" onClick={onReserve}>
        {t("\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0438\u0437\u0438\u0442", "Book a visit")}
      </button>
    </section>
  );
}
