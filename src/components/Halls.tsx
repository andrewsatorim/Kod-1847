"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

const halls = [
  {
    id: "tea",
    image: "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg",
    titleRu: "Чайный зал",
    titleEn: "Tea room",
    subRu: "Редкие сорта · Гунфу-ча · Дегустации мастера",
    subEn: "Rare teas · Gongfu-cha · Master tastings",
  },
  {
    id: "hookah",
    image: "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg",
    titleRu: "Кальянный лаундж",
    titleEn: "Hookah lounge",
    subRu: "Купажи мастера · Дымные церемонии · Авторские миксы",
    subEn: "Master blends · Smoke ceremonies · Signature mixes",
  },
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
          <div
            className="hall-section"
            style={{ backgroundImage: `url(${hall.image})` }}
          >
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
