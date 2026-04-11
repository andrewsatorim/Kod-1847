"use client";
import { useLang } from "@/context/LanguageContext";
import DiamondDivider from "./DiamondDivider";
import Link from "next/link";

export default function PartnershipPreview() {
  const { t } = useLang();

  return (
    <section className="partner-preview" id="partnership-preview">
      <div className="partner-preview-bg" />
      <div className="partner-preview-glow" />
      <DiamondDivider className="phil-visible" />
      <div className="section-title" style={{ position: "relative", zIndex: 2 }}>
        {t("Партнёрство", "Partnership")}
      </div>
      <div className="section-subtitle" style={{ position: "relative", zIndex: 2 }}>
        {t("Пространство для камерных событий", "Space for intimate events")}
      </div>
      <div className="partner-preview-stats">
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">4</span>
          <span className="partner-preview-stat-label">{t("формата", "formats")}</span>
        </div>
        <div className="partner-preview-divider" />
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">6–40</span>
          <span className="partner-preview-stat-label">{t("гостей", "guests")}</span>
        </div>
        <div className="partner-preview-divider" />
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">145 <span style={{ fontSize: 16 }}>{t("м²", "m²")}</span></span>
          <span className="partner-preview-stat-label">{t("пространство", "space")}</span>
        </div>
      </div>
      <Link href="/partnership" className="view-all-link" style={{ position: "relative", zIndex: 2 }}>
        {t("Подробнее", "Learn more")}
      </Link>
    </section>
  );
}
