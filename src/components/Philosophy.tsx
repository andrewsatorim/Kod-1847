"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

interface Props {
  textRu?: string;
  textEn?: string;
}

export default function Philosophy({ textRu, textEn }: Props) {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  const ru = textRu || "Тем, кому важно содержание без суеты. Качественный сервис без пафоса. Мастерство без лишнего шума. Эксклюзивный продукт. Взаимопонимание без лишних слов. Это Код 1847.";
  const en = textEn || "For those who value substance over fuss. Quality service without pretense. Mastery without noise. An exclusive product. Understanding without excess words. This is Code 1847.";

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
          <div className="phil-text">{t(ru, en)}</div>
        </div>
      </div>
    </section>
  );
}
