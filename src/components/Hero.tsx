"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import LogoSVG from "./LogoSVG";

const particles = [
  { left: "12%", bottom: "15%", duration: "6s", delay: "0s" },
  { left: "28%", bottom: "20%", duration: "7.5s", delay: "0.8s" },
  { left: "44%", bottom: "25%", duration: "9s", delay: "1.6s" },
  { left: "60%", bottom: "18%", duration: "6.5s", delay: "2.4s" },
  { left: "76%", bottom: "22%", duration: "8s", delay: "3.2s" },
  { left: "88%", bottom: "12%", duration: "7s", delay: "4s" },
];

export default function Hero({ onReserve }: { onReserve: () => void }) {
  const { lang, toggle, setLang, t } = useLang();
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setScrollVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
    let animId: number;
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    };
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = Math.max(-15, Math.min(15, e.gamma || 0));
      const y = Math.max(-15, Math.min(15, (e.beta || 0) - 45));
      targetX = x / 15;
      targetY = y / 15;
    };
    const update = () => {
      tiltX += (targetX - tiltX) * 0.04;
      tiltY += (targetY - tiltY) * 0.04;
      if (logoRef.current) logoRef.current.style.transform = `translate(${tiltX * 6}px,${tiltY * 6}px)`;
      if (contentRef.current) contentRef.current.style.transform = `translate(${tiltX * 3}px,${tiltY * 3}px)`;
      animId = requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("deviceorientation", handleOrientation, true);
    update();
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("deviceorientation", handleOrientation);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-glow" />
      {particles.map((p, i) => (
        <div key={i} className="ptc" style={{ left: p.left, bottom: p.bottom, animation: `fl ${p.duration} ease-in-out infinite ${p.delay}` }} />
      ))}

      <div className="lang-switch">
        <span className={`lang-option ${lang === "ru" ? "lang-active" : ""}`} onClick={() => setLang("ru")}>RU</span>
        <div className={`lang-toggle ${lang === "en" ? "en" : ""}`} onClick={toggle}><div className="lang-thumb" /></div>
        <span className={`lang-option ${lang === "en" ? "lang-active" : ""}`} onClick={() => setLang("en")}>EN</span>
      </div>

      <div className="hero-content" ref={contentRef}>
        <div className="logo-mark" ref={logoRef}><LogoSVG /></div>
        <div className="lockup-name" dangerouslySetInnerHTML={{ __html: t("\u041a\u041e\u0414&nbsp;1847", "CODE&nbsp;1847") }} />
        <div className="lockup-line" />
        <div className="lockup-sub">{t("\u0417\u0430\u043a\u0440\u044b\u0442\u044b\u0439 \u043a\u043b\u0443\u0431", "Private club")}</div>
        <div className="lockup-loc" dangerouslySetInnerHTML={{ __html: t('\u041c\u043e\u0441\u043a\u0432\u0430 \u00b7 \u0410\u0440\u0431\u0430\u0442 \u00b7 Est. <span class="nums">1847</span>', 'Moscow \u00b7 Arbat \u00b7 Est. <span class="nums">1847</span>') }} />
      </div>

      <button className="cta-hero" onClick={onReserve}>{t("\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0438\u0437\u0438\u0442", "Book a visit")}</button>

      <div className={`scroll-hint ${scrollVisible ? "visible" : ""}`}>
        <div className="scroll-hint-label">{t("\u0432\u043d\u0438\u0437", "scroll")}</div>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
