"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

const items = [
  { titleRu: "\u0414\u0430 \u0425\u0443\u043d \u041f\u0430\u043e", titleEn: "Da Hong Pao", descRu: "\u0423\u0442\u0451\u0441\u043d\u044b\u0439 \u0443\u043b\u0443\u043d. \u0423\u0438\u0448\u0430\u043d\u044c, \u0432\u0435\u0441\u043d\u0430 2024", descEn: "Rock oolong. Wuyi, spring 2024", price: "2 800 \u20bd", flagship: true },
  { titleRu: "\u041a\u0443\u043f\u0430\u0436 \u043c\u0430\u0441\u0442\u0435\u0440\u0430 \u21163", titleEn: "Master's Blend #3", descRu: "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0439 \u043c\u0438\u043a\u0441 \u0448\u0435\u0444-\u043a\u0430\u043b\u044c\u044f\u043d\u0449\u0438\u043a\u0430", descEn: "Signature blend by head hookah master", price: "3 200 \u20bd", flagship: true },
  { titleRu: "\u0413\u0451\u043a\u0443\u0440\u043e", titleEn: "Gyokuro", descRu: "\u0422\u0435\u043d\u0435\u0432\u043e\u0439 \u044f\u043f\u043e\u043d\u0441\u043a\u0438\u0439 \u0437\u0435\u043b\u0451\u043d\u044b\u0439 \u0447\u0430\u0439", descEn: "Shade-grown Japanese green tea", price: "2 400 \u20bd", flagship: false },
  { titleRu: "\u0414\u044b\u043c\u043d\u0430\u044f \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u044f", titleEn: "Smoke Ceremony", descRu: "\u0420\u0438\u0442\u0443\u0430\u043b \u043f\u043e\u0434\u0430\u0447\u0438 \u043a\u0430\u043b\u044c\u044f\u043d\u0430 \u0441 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430\u043c\u0438 \u0447\u0430\u0439\u043d\u043e\u0439 \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u0438", descEn: "Hookah ritual with tea ceremony elements", price: "5 500 \u20bd", flagship: false },
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
        <div className="section-title">{t("\u041a\u0430\u0440\u0442\u0430", "Menu")}</div>
        <div className="section-subtitle">{t("\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u044b\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438", "Featured selections")}</div>
      </div>
      <div className="menu-preview-grid">
        {items.map((item, i) => (
          <div key={i} className="menu-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="menu-card-title">{t(item.titleRu, item.titleEn)}{item.flagship && <span className="flagship-badge">{t("\u0424\u043b\u0430\u0433\u043c\u0430\u043d", "Flagship")}</span>}</div>
            <div className="menu-card-desc">{t(item.descRu, item.descEn)}</div>
            <div className="menu-card-price">{item.price}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}><Link href="/menu" className="view-all-link">{t("\u041f\u043e\u043b\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "Full menu")}</Link></div>
    </section>
  );
}
