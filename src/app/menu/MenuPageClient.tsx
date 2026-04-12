"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";
import type { MenuCategory } from "@/lib/types";

const tabs = [
  { id: "tea", labelRu: "Чайное меню", labelEn: "Tea Menu" },
  { id: "hookah", labelRu: "Кальянное меню", labelEn: "Hookah Menu" },
  { id: "food", labelRu: "Кухня", labelEn: "Kitchen" },
];

interface Props {
  allCategories: Record<string, MenuCategory[]>;
}

export default function MenuPageClient({ allCategories }: Props) {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("tea");
  const categories = allCategories[activeTab] || [];

  return (
    <>
      <Header />
      <div className="menu-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Меню", "Menu")}</div>
        <div className="section-subtitle" style={{ marginBottom: 40 }}>{t("Полное меню клуба", "Full club menu")}</div>
        <div className="menu-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} className={`menu-tab ${activeTab === tab.id ? "menu-tab-active" : "menu-tab-inactive"}`} onClick={() => setActiveTab(tab.id)}>
              {t(tab.labelRu, tab.labelEn)}
            </button>
          ))}
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="menu-category">
            <div className="menu-cat-title">{t(cat.title_ru, cat.title_en)}</div>
            <div className="menu-cat-desc">{t(cat.desc_ru, cat.desc_en)}</div>
            {cat.menu_items.map((item) => (
              <div key={item.id} className="menu-item">
                <div>
                  <div className="menu-item-name">
                    {t(item.name_ru, item.name_en)}
                    {item.is_flagship && <span className="flagship-badge">{t("Флагман", "Flagship")}</span>}
                  </div>
                  {item.desc_ru && <div className="menu-item-desc">{t(item.desc_ru, item.desc_en || "")}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
