"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";

const images = [
  "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg",
  "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg",
  "https://i.postimg.cc/4xHxnFMQ/IMG-0648.jpg",
  "https://i.postimg.cc/kgPLmGJz/IMG-0651.jpg",
];

export default function Gallery() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="gallery-section" ref={ref} id="gallery">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Галерея", "Gallery")}</div>
        <div className="section-subtitle">{t("Атмосфера клуба", "Club atmosphere")}</div>
      </div>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <div key={i} className="gallery-item reveal" style={{ transitionDelay: `${i * 100}ms` }} onClick={() => setLightboxSrc(src)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
      <div className={`lightbox-overlay ${lightboxSrc ? "open" : ""}`} onClick={() => setLightboxSrc(null)}>
        {lightboxSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lightboxSrc} alt="Enlarged view" />
        )}
      </div>
    </section>
  );
}
