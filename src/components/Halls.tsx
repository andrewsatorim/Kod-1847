"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const halls = [
  {
    id: "tea",
    image: "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg",
    titleRu: "\u0427\u0430\u0439\u043d\u044b\u0439 \u0437\u0430\u043b",
    titleEn: "Tea Room",
    descRu: "\u041c\u0435\u0441\u0442\u043e, \u0433\u0434\u0435 \u0432\u0440\u0435\u043c\u044f \u0437\u0430\u043c\u0435\u0434\u043b\u044f\u0435\u0442\u0441\u044f. \u0420\u0435\u0434\u043a\u0438\u0435 \u0443\u043b\u0443\u043d\u044b \u0438 \u0432\u044b\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0435 \u043f\u0443\u044d\u0440\u044b, \u043f\u043e\u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u043e \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u0438 \u0433\u0443\u043d\u0444\u0443-\u0447\u0430. \u041a\u0430\u0436\u0434\u0430\u044f \u0447\u0430\u0448\u043a\u0430\u00a0\u2014 \u0434\u0438\u0430\u043b\u043e\u0433 \u0441 \u043c\u0430\u0441\u0442\u0435\u0440\u043e\u043c, \u043a\u0430\u0436\u0434\u044b\u0439 \u043f\u0440\u043e\u043b\u0438\u0432\u00a0\u2014 \u043d\u043e\u0432\u044b\u0439 \u043e\u0442\u0442\u0435\u043d\u043e\u043a \u0432\u043a\u0443\u0441\u0430. \u0417\u0434\u0435\u0441\u044c \u043d\u0435 \u043f\u044c\u044e\u0442 \u0447\u0430\u0439\u00a0\u2014 \u0437\u0434\u0435\u0441\u044c \u0435\u0433\u043e \u043f\u0440\u043e\u0436\u0438\u0432\u0430\u044e\u0442.",
    descEn: "A place where time slows down. Rare oolongs and aged pu-erhs served in the gongfu-cha tradition. Each cup is a dialogue with the master, each infusion reveals a new shade of taste. Here, tea is not drunk\u00a0\u2014 it is lived.",
  },
  {
    id: "hookah",
    image: "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg",
    titleRu: "\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u044b\u0439 \u043b\u0430\u0443\u043d\u0434\u0436",
    titleEn: "Hookah Lounge",
    descRu: "\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0433\u0443\u0441\u0442\u043e\u0433\u043e \u0434\u044b\u043c\u0430 \u0438 \u043d\u0435\u0433\u0440\u043e\u043c\u043a\u0438\u0445 \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u043e\u0432. \u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u043a\u0443\u043f\u0430\u0436\u0438 \u0448\u0435\u0444-\u043a\u0430\u043b\u044c\u044f\u043d\u0449\u0438\u043a\u0430, \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0435 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e \u0434\u043b\u044f \u00ab\u041a\u043e\u0434 1847\u00bb. \u041a\u0430\u0436\u0434\u044b\u0439 \u043c\u0438\u043a\u0441\u00a0\u2014 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u043c\u0435\u0441\u044f\u0446\u0435\u0432 \u043f\u043e\u0438\u0441\u043a\u0430 \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0431\u0430\u043b\u0430\u043d\u0441\u0430. \u0414\u044b\u043c \u0437\u0434\u0435\u0441\u044c\u00a0\u2014 \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432\u043e.",
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
