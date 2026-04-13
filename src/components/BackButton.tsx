"use client";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

export default function BackButton() {
  const router = useRouter();
  const { t } = useLang();

  return (
    <button className="menu-back-btn" onClick={() => router.back()}>
      {t("← Назад", "← Back")}
    </button>
  );
}
