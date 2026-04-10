import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Членство — Код 1847 · Закрытый клуб",
  description: "Три уровня членства: разовое посещение, член клуба, резидент. Подайте заявку на вступление в клуб «Код 1847».",
  openGraph: {
    title: "Членство — Код 1847",
    description: "Заявка на членство в частном чайном клубе на Арбате.",
  },
};

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
