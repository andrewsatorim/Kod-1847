"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const halls = [
  {
    id: "tea",
    image: "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg",
    titleRu: "Чайный зал",
    titleEn: "Tea Room",
    descRu: "Место, где время замедляется. Редкие улуны и выдержанные пуэры, поданные по традиции гунфу-ча. Каждая чашка\u00a0— диалог с мастером, каждый пролив\u00a0— новый оттенок вкуса. Здесь не пьют чай\u00a0— здесь его проживают.",
    descEn: "A place where time slows down. Rare oolongs and aged pu-erhs served in the gongfu-cha tradition. Each cup is a dialogue with the master, each infusion reveals a new shade of taste. Here, tea is not drunk\u00a0— it is lived.",
  },
  {
    id: "hookah",
    image: "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg",
    titleRu: "Кальянный лаундж",
    titleEn: "Hookah Lounge",
    descRu: "Пространство густого дыма и негромких разговоров. Авторские купажи шеф-кальянщика, созданные специально для \u00abКод 1847\u00bb. Каждый микс\u00a0— результат месяцев поиска идеального баланса. Дым здесь\u00a0— искусство.",
    descEn: "A space of dense smoke and quiet conversations. Signature blends by the head hookah master, crafted exclusively for Code 1847. Each mix is the result of months searching for perfect balance. Smoke here is art.",
  },
];

export default function Halls() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".hall-card");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("hall-visible");
      }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="halls" ref={sectionRef} id="zones">
      {halls.map((hall) => (
        <div key={hall.id} className="hall-card">
          <div className="hall-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hall.image} alt={t(hall.titleRu, hall.titleEn)} className="hall-img" loading="lazy" />
          </div>
          <div className="hall-tint" />
          <div className="hall-content">
            <div className="hall-label">{t(hall.titleRu, hall.titleEn)}</div>
            <div className="hall-line" />
            <div className="hall-desc">{t(hall.descRu, hall.descEn)}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
