"use client";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();
  const { t } = useLang();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button className="menu-back-btn" onClick={handleClick}>
      {t("← Назад", "← Back")}
    </button>
  );
}
