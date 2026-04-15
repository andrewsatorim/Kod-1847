import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Код 1847 — Клубное пространство",
  description: "Место встреч, вкуса и единомышленников. Арбат, Москва.",
  keywords: "код 1847, чайный клуб, москва, арбат, кальян, дегустация, закрытый клуб",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    title: "Код 1847 — Клубное пространство",
    description: "Место встреч, вкуса и единомышленников. Арбат, Москва.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider>
          <Analytics />
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
