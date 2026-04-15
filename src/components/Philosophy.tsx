"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

export default function Philosophy() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".phil-hidden, .section-divider");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("phil-visible"); }); },
      { threshold: 0.2, rootMargin: "0px 0px -20px 0px" }
    );
    let delay = 0;
    els.forEach((el) => { (el as HTMLElement).style.transitionDelay = delay + "ms"; delay += 400; obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="philosophy" ref={sectionRef} id="about">
      <DiamondDivider />
      <div className="phil-content">
        <div className="phil-block phil-hidden">
          <div className="phil-corner" />
          <div className="phil-text">{t("Тем, кому важно содержание без суеты.\nКачественный сервис без пафоса.\nМастерство без лишнего шума.\nЭксклюзивный продукт.\nВзаимопонимание без лишних слов.\nЭто Код 1847.", "For those who value substance over fuss.\nQuality service without pretense.\nMastery without noise.\nAn exclusive product.\nUnderstanding without excess words.\nThis is Code 1847.")}</div>
        </div>
      </div>
    </section>
  );
}
