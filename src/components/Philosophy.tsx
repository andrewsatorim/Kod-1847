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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("phil-visible");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -20px 0px" }
    );

    let delay = 0;
    els.forEach((el) => {
      (el as HTMLElement).style.transitionDelay = delay + "ms";
      delay += 400;
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <section className="philosophy" ref={sectionRef} id="about">
      <DiamondDivider />
      <div className="phil-content">
        <div className="phil-opening phil-hidden">
          {t("\u041c\u044b \u043d\u0435 \u0438\u0449\u0435\u043c \u0433\u043e\u0441\u0442\u0435\u0439 \u2014", "We don't seek guests \u2014")}<br />
          {t("\u043c\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044b \u0435\u0434\u0438\u043d\u043e\u043c\u044b\u0448\u043b\u0435\u043d\u043d\u0438\u043a\u0430\u043c.", "we welcome the like-minded.")}
        </div>
        <div className="phil-block phil-hidden">
          <div className="phil-corner" />
          <div className="phil-text">
            {t(
              "\u0422\u0435\u043c, \u043a\u043e\u043c\u0443 \u0432\u0430\u0436\u043d\u043e \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u043d\u0438\u0435 \u0431\u0435\u0437 \u0441\u0443\u0435\u0442\u044b. \u041a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0441\u0435\u0440\u0432\u0438\u0441 \u0431\u0435\u0437 \u043f\u0430\u0444\u043e\u0441\u0430. \u041c\u0430\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043e \u0431\u0435\u0437 \u043b\u0438\u0448\u043d\u0435\u0433\u043e \u0448\u0443\u043c\u0430. \u042d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u043d\u044b\u0439 \u043f\u0440\u043e\u0434\u0443\u043a\u0442. \u0412\u0437\u0430\u0438\u043c\u043e\u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u0435 \u0431\u0435\u0437 \u043b\u0438\u0448\u043d\u0438\u0445 \u0441\u043b\u043e\u0432. \u042d\u0442\u043e \u041a\u043e\u0434 1847.",
              "For those who value substance over fuss. Quality service without pretense. Mastery without noise. An exclusive product. Understanding without excess words. This is Code 1847."
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
