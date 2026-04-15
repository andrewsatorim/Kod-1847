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
        {t("\u041f\u0430\u0440\u0442\u043d\u0451\u0440\u0441\u0442\u0432\u043e", "Partnership")}
      </div>
      <div className="section-subtitle" style={{ position: "relative", zIndex: 2 }}>
        {t("\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u043a\u0430\u043c\u0435\u0440\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439", "Space for intimate events")}
      </div>
      <div className="partner-preview-stats">
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">145 <span style={{ fontSize: 16 }}>{t("\u043c\u00b2", "m\u00b2")}</span></span>
          <span className="partner-preview-stat-label">{t("\u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e", "space")}</span>
        </div>
        <div className="partner-preview-divider" />
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">6 - 50</span>
          <span className="partner-preview-stat-label">{t("\u0433\u043e\u0441\u0442\u0435\u0439", "guests")}</span>
        </div>
        <div className="partner-preview-divider" />
        <div className="partner-preview-stat">
          <span className="partner-preview-stat-num">3</span>
          <span className="partner-preview-stat-label">{t("\u0444\u043e\u0440\u043c\u0430\u0442\u0430", "formats")}</span>
        </div>
      </div>
      <Link href="/partnership" className="view-all-link" style={{ position: "relative", zIndex: 2 }}>
        {t("\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435", "Learn more")}
      </Link>
    </section>
  );
}
