"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import CanvasBackground from "./CanvasBackground";
import LogoSVG from "./LogoSVG";

export default function Hero({ onReserve }: { onReserve: () => void }) {
  const { lang, toggle, setLang, t } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setScrollVisible(true), 6500);
    return () => clearTimeout(timer);
  }, []);

  // Parallax on mouse/orientation
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
    <div className="hero" ref={heroRef}>
      <div className="bg-layer">
        <CanvasBackground />
      </div>
      <div className="vignette" />

      {/* Language switch */}
      <div className="lang-switch">
        <span
          className={`lang-option ${lang === "ru" ? "lang-active" : ""}`}
          onClick={() => setLang("ru")}
        >RU</span>
        <div className={`lang-toggle ${lang === "en" ? "en" : ""}`} onClick={toggle}>
          <div className="lang-thumb" />
        </div>
        <span
          className={`lang-option ${lang === "en" ? "lang-active" : ""}`}
          onClick={() => setLang("en")}
        >EN</span>
      </div>

      {/* Hero content */}
      <div className="hero-content" ref={contentRef}>
        <div className="logo-mark" ref={logoRef}>
          <LogoSVG />
        </div>
        <div className="lockup-name" dangerouslySetInnerHTML={{ __html: t("КОД&nbsp;1847", "CODE&nbsp;1847") }} />
        <div className="lockup-line" />
        <div className="lockup-sub">{t("Закрытый клуб", "Private club")}</div>
        <div className="lockup-loc" dangerouslySetInnerHTML={{
          __html: t(
            'Москва · Арбат · Est. <span class="nums">1847</span>',
            'Moscow · Arbat · Est. <span class="nums">1847</span>'
          )
        }} />
      </div>

      <button className="cta-hero" onClick={onReserve}>
        {t("Забронировать визит", "Book a visit")}
      </button>

      <div className={`scroll-hint ${scrollVisible ? "visible" : ""}`}>
        <div className="scroll-hint-label">{t("вниз", "scroll")}</div>
        <div className="scroll-line" />
      </div>
    </div>
  );
}
