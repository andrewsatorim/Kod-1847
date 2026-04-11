"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function MenuPreview({ onReserve }: { onReserve: () => void }) {
  const { t } = useLang();

  return (
    <section className="menu-preview" id="menu-preview">
      <DiamondDivider className="phil-visible" />
      <div className="section-title">{t("Меню", "Menu")}</div>
      <div className="section-subtitle">{t("Чайная и кальянная карты клуба", "Tea and hookah menus")}</div>
      <div className="menu-pdf-buttons">
        <a href="/Kod1847_Tea_Menu.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
          {t("Чайная карта", "Tea Menu")}
        </a>
        <a href="/Kod1847_Hookah_Menu2.pdf" target="_blank" rel="noopener noreferrer" className="menu-pdf-btn">
          {t("Кальянная карта", "Hookah Menu")}
        </a>
      </div>
      <button className="menu-reserve-btn" onClick={onReserve}>
        {t("Забронировать визит", "Book a visit")}
      </button>
    </section>
  );
}
