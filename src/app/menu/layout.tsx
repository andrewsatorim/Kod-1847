import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Карта — Код 1847 · Чайный и кальянный клуб",
  description: "Полная карта клуба: редкие сорта чая, авторские кальянные купажи, церемонии и закуски. Москва, Арбат.",
  openGraph: {
    title: "Карта — Код 1847",
    description: "Чайная карта, кальянная карта, кухня клуба «Код 1847».",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
