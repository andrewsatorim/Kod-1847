import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Код 1847 — Аналитика",
  description: "Панель аналитики сайта Код 1847",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}
