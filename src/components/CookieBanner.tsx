"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function loadYandexMetrika() {
  if (typeof window === "undefined") return;
  // Yandex.Metrika — counter number placeholder XXXXXXXX
  (function (d: Document) {
    const s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://mc.yandex.ru/metrika/tag.js";
    s.onload = () => {
      if (typeof window.ym === "function") {
        window.ym("XXXXXXXX", "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      }
    };
    const f = d.getElementsByTagName("script")[0];
    f?.parentNode?.insertBefore(s, f);
  })(document);
}

function getConsent(): { status: string | null; expired: boolean } {
  if (typeof window === "undefined") return { status: null, expired: true };
  const status = localStorage.getItem("cookie_consent");
  const dateStr = localStorage.getItem("cookie_consent_date");
  if (!status || !dateStr) return { status: null, expired: true };
  const consentDate = new Date(dateStr);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - consentDate.getFullYear()) * 12 + (now.getMonth() - consentDate.getMonth());
  return { status, expired: monthsDiff >= 12 };
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const { status, expired } = getConsent();
    if (status === "accepted" && !expired) {
      loadYandexMetrika();
      return;
    }
    if (status === "declined" && !expired) {
      return;
    }
    // Show banner
    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    loadYandexMetrika();
    hide();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    hide();
  };

  const hide = () => {
    setAnimating(false);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div className={`cookie-banner ${animating ? "cookie-banner--visible" : ""}`} role="dialog" aria-label="Уведомление о cookie">
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          Мы используем файлы cookie для улучшения работы сайта и анализа посещаемости.
          Подробнее — в <Link href="/cookies" className="cookie-banner__link">Политике cookies</Link>.
        </p>
        <div className="cookie-banner__actions">
          <button onClick={handleAccept} className="cookie-banner__btn cookie-banner__btn--accept">Принять</button>
          <button onClick={handleDecline} className="cookie-banner__btn cookie-banner__btn--decline">Отклонить</button>
        </div>
      </div>
    </div>
  );
}
