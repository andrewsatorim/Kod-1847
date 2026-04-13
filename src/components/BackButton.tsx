"use client";
import { useLang } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

const backMap: Record<string, string> = {
  "/tea-room": "rooms",
  "/hookah-room": "rooms",
  "/menu": "menu-preview",
  "/events": "events-preview",
  "/partnership": "partnership-preview",
};

export default function BackButton() {
  const { t } = useLang();
  const pathname = usePathname();
  const targetId = backMap[pathname] || "";

  const handleClick = () => {
    sessionStorage.setItem("scrollTo", targetId);
    window.location.href = "/";
  };

  return (
    <button className="menu-back-btn" onClick={handleClick}>
      {t("← На главную", "← Back")}
    </button>
  );
}
