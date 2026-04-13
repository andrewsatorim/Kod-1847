"use client";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

const backMap: Record<string, string> = {
  "/tea-room": "/#rooms",
  "/hookah-room": "/#rooms",
  "/menu": "/#menu-preview",
  "/events": "/#events-preview",
  "/partnership": "/#partnership-preview",
};

export default function BackButton() {
  const { t } = useLang();
  const pathname = usePathname();
  const target = backMap[pathname] || "/";

  return (
    <a href={target} className="menu-back-btn">
      {t("← Назад", "← Back")}
    </a>
  );
}
