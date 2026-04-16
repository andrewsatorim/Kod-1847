import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Код 1847 — Админ-панель",
  description: "Управление контентом сайта Код 1847",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
