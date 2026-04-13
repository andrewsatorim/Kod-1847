"use client";
import { useLang } from "@/context/LanguageContext";

export default function BackButton({ href }: { href?: string }) {
  const { t } = useLang();

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else {
      window.history.back();
    }
  };

  return (
    <button className="menu-back-btn" onClick={handleClick}>
      {t("← Назад", "← Back")}
    </button>
  );
}
