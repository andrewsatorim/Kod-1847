"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

const items = [
  {
    titleRu: "Да Хун Пао", titleEn: "Da Hong Pao",
    descRu: "Утёсный улун. Уишань, весна 2024. Глубокий минеральный вкус с нотами обжаренного ореха",
    descEn: "Rock oolong. Wuyi, spring 2024. Deep mineral taste with roasted nut notes",
    price: "2 800 ₽", flagship: true,
  },
  {
    titleRu: "Купаж мастера №3", titleEn: "Master's Blend #3",
    descRu: "Авторский микс шеф-кальянщика. Многослойный, создан специально для «Код 1847»",
    descEn: "Signature blend by head hookah master. Multi-layered, crafted for Code 1847",
    price: "3 200 ₽", flagship: true,
  },
  {
    titleRu: "Гёкуро", titleEn: "Gyokuro",
    descRu: "Теневой японский зелёный чай. Умами, морские ноты, долгое шелковистое послевкусие",
    descEn: "Shade-grown Japanese green tea. Umami, ocean notes, long silky finish",
    price: "2 400 ₽", flagship: false,
  },
  {
    titleRu: "Дымная церемония", titleEn: "Smoke Ceremony",
    descRu: "Ритуал подачи кальяна с элементами чайной церемонии. Редкий чай и сезонные сладости",
    descEn: "Hookah ritual with tea ceremony elements. Rare tea and seasonal sweets",
    price: "5 500 ₽", flagship: false,
  },
];

export default function MenuPreview() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="menu-preview" ref={ref} id="menu-preview">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Карта", "Menu")}</div>
        <div className="section-subtitle">{t("Избранные позиции", "Featured selections")}</div>
      </div>

      <div className="menu-preview-grid">
        {items.map((item, i) => (
          <div key={i} className="menu-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="menu-card-title">
              {t(item.titleRu, item.titleEn)}
              {item.flagship && (
                <span className="flagship-badge">{t("Флагман", "Flagship")}</span>
              )}
            </div>
            <div className="menu-card-desc">{t(item.descRu, item.descEn)}</div>
            <div className="menu-card-price">{item.price}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <Link href="/menu" className="view-all-link">
          {t("Полная карта", "Full menu")}
        </Link>
      </div>
    </section>
  );
}
