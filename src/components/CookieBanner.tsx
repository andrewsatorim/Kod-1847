"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie_consent";
const CONSENT_DATE_KEY = "cookie_consent_date";
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

function loadYandexMetrika() {
  if (typeof window === "undefined") return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = +new Date();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t) as HTMLScriptElement;
    a = e.getElementsByTagName(t)[0] as HTMLScriptElement;
    k.async = true;
    k.src = r;
    a.parentNode?.insertBefore(k, a);
  })(
    window,
    document,
    "script",
    "https://mc.yandex.ru/metrika/tag.js",
    "ym"
  );
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (window as any).ym("XXXXXXXX", "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    const dateStr = localStorage.getItem(CONSENT_DATE_KEY);

    if (consent && dateStr) {
      const elapsed = Date.now() - new Date(dateStr).getTime();
      if (elapsed < TWELVE_MONTHS_MS) {
        if (consent === "accepted") {
          loadYandexMetrika();
        }
        return;
      }
    }
    setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    loadYandexMetrika();
    setHiding(true);
    setTimeout(() => setVisible(false), 400);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    setHiding(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`cookie-banner ${hiding ? "cookie-banner--hiding" : ""}`}
      role="dialog"
      aria-label="Уведомление о cookie"
    >
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          Мы используем файлы cookie для улучшения работы сайта и анализа
          посещаемости. Подробнее&nbsp;— в{" "}
          <Link href="/cookies" className="cookie-banner__link">
            Политике&nbsp;cookies
          </Link>
          .
        </p>
        <div className="cookie-banner__actions">
          <button
            className="cookie-banner__btn cookie-banner__btn--accept"
            onClick={handleAccept}
          >
            Принять
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--decline"
            onClick={handleDecline}
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}
