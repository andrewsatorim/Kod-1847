"use client";
import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { useReveal } from "@/hooks/useReveal";
import DiamondDivider from "./DiamondDivider";

const images = [
  "https://i.postimg.cc/rDttKj6H/IMG-0646.jpg",
  "https://i.postimg.cc/YhPWrVPR/IMG-0647.jpg",
  "https://i.postimg.cc/4xHxnFMQ/IMG-0648.jpg",
  "https://i.postimg.cc/kgPLmGJz/IMG-0651.jpg",
];

export default function Gallery() {
  const { t } = useLang();
  const ref = useReveal();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <section className="gallery-section" ref={ref} id="gallery">
      <div className="reveal">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Галерея", "Gallery")}</div>
        <div className="section-subtitle">{t("Атмосфера клуба", "Club atmosphere")}</div>
      </div>

      <div className="gallery-grid">
        {images.map((src, i) => (
          <div
            key={i}
            className="gallery-item reveal"
            style={{ transitionDelay: `${i * 100}ms` }}
            onClick={() => setLightboxSrc(src)}
          >
              <Image src={src} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>

      <div
        className={`lightbox-overlay ${lightboxSrc ? "open" : ""}`}
        onClick={() => setLightboxSrc(null)}
      >
        {lightboxSrc && (
          <Image src={lightboxSrc} alt="Enlarged view" width={1200} height={900} style={{ objectFit: "contain", maxWidth: "90vw", maxHeight: "85vh", width: "auto", height: "auto" }} />
        )}
      </div>
    </section>
  );
}
