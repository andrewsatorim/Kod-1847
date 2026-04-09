"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

const halls = [
  { id: "tea", image: "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg", titleRu: "\u0427\u0430\u0439\u043d\u044b\u0439 \u0437\u0430\u043b", titleEn: "Tea room", subRu: "\u0420\u0435\u0434\u043a\u0438\u0435 \u0441\u043e\u0440\u0442\u0430 \u00b7 \u0413\u0443\u043d\u0444\u0443-\u0447\u0430 \u00b7 \u0414\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u0438 \u043c\u0430\u0441\u0442\u0435\u0440\u0430", subEn: "Rare teas \u00b7 Gongfu-cha \u00b7 Master tastings" },
  { id: "hookah", image: "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg", titleRu: "\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u044b\u0439 \u043b\u0430\u0443\u043d\u0434\u0436", titleEn: "Hookah lounge", subRu: "\u041a\u0443\u043f\u0430\u0436\u0438 \u043c\u0430\u0441\u0442\u0435\u0440\u0430 \u00b7 \u0414\u044b\u043c\u043d\u044b\u0435 \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u0438 \u00b7 \u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u043c\u0438\u043a\u0441\u044b", subEn: "Master blends \u00b7 Smoke ceremonies \u00b7 Signature mixes" },
];

export default function Halls() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hallEls = sectionRef.current?.querySelectorAll(".hall-section");
    const divEls = sectionRef.current?.querySelectorAll(".halls-obs");
    if (!hallEls) return;
    const hallObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.2 }
    );
    hallEls.forEach((el) => hallObs.observe(el));
    const divObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("phil-visible"); }),
      { threshold: 0.3 }
    );
    divEls?.forEach((el) => divObs.observe(el));
    return () => { hallObs.disconnect(); divObs.disconnect(); };
  }, []);

  return (
    <section className="halls" ref={sectionRef} id="zones">
      <DiamondDivider className="halls-obs" />
      {halls.map((hall, i) => (
        <div key={hall.id}>
          {i > 0 && <div className="hall-mid-divider" />}
          <div className="hall-section" style={{ backgroundImage: `url(${hall.image})` }}>
            <div className="hall-overlay" />
            <div className="hall-info">
              <div className="hall-title">{t(hall.titleRu, hall.titleEn)}</div>
              <div className="hall-subtitle">{t(hall.subRu, hall.subEn)}</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
