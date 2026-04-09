"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "ru" | "en";

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
  t: (ru: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  toggle: () => {},
  setLang: () => {},
  t: (ru) => ru,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");
  const toggle = useCallback(() => setLang((l) => (l === "ru" ? "en" : "ru")), []);
  const t = useCallback((ru: string, en: string) => (lang === "ru" ? ru : en), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
