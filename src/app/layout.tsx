import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Код 1847 — Частный чайный клуб · Арбат, Москва",
  description: "Закрытый клуб в историческом здании на Арбате. Чайные дегустации, редкие сорта, приватная обстановка. Членство — по рекомендации действующего участника.",
  keywords: "код 1847, чайный клуб, москва, арбат, кальян, дегустация, закрытый клуб",
  openGraph: {
    title: "Код 1847 — Частный чайный клуб",
    description: "Пространство доверия и смысла. Арбат, Москва.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
