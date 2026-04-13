"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";
import ReservationModal from "@/components/ReservationModal";

const stats = [
  { value: "3", labelRu: "формата сотрудничества", labelEn: "partnership formats" },
  { value: "6 - 50", labelRu: "гостей на мероприятие", labelEn: "guests per event" },
  { value: "145", labelRu: "м² клубного пространства", labelEn: "m² of club space" },
];

const advantages = [
  { ru: "Уникальная атмосфера и исторический контекст", en: "Unique atmosphere and historical context" },
  { ru: "Гибкие форматы сотрудничества", en: "Flexible partnership formats" },
  { ru: "Чайное сопровождение гостей", en: "Tea service for guests" },
  { ru: "Камерность: от 6 до 50 гостей", en: "Intimacy: from 6 to 50 guests" },
];

const partnershipFormats = [
  {
    numRu: "01", titleRu: "Фиксированная аренда", titleEn: "Fixed Venue Rental",
    pointsRu: [
      "Билеты и сбор полностью остаются у организатора",
      "Клуб предоставляет площадку за фиксированную стоимость",
      "Может быть включено чайное сопровождение",
      "Гости могут заказывать напитки, десерты и кальяны по желанию",
      "Заказы оплачиваются отдельно",
    ],
    pointsEn: [
      "Tickets and fees stay entirely with the organizer",
      "Club provides venue for a fixed fee",
      "Tea service can be included",
      "Guests may order drinks, desserts, and hookah",
      "Orders are charged separately",
    ],
    suitRu: "10 - 50 гостей: выставки, лекции, презентации, закрытые показы",
    suitEn: "10 - 50 guests: exhibitions, lectures, presentations, private screenings",
  },
  {
    numRu: "02", titleRu: "Билетный формат", titleEn: "Ticket Format",
    pointsRu: [
      "Билеты и сбор полностью остаются у организатора",
      "Площадка без фиксированной аренды",
      "Условие клуба: каждый гость заказывает напитки (1\u00a0300\u00a0₽)",
      "Дополнительные заказы оплачиваются отдельно",
    ],
    pointsEn: [
      "Tickets and fees stay entirely with the organizer",
      "No fixed venue rental",
      "Club condition: each guest orders drinks (1\u00a0300\u00a0₽)",
      "Additional orders are charged separately",
    ],
    suitRu: "6 - 14 гостей: сессии, разборы, мастермайнды, камерные встречи",
    suitEn: "6 - 14 guests: sessions, reviews, masterminds, intimate meetings",
  },
  {
    numRu: "03", titleRu: "Партнёрский формат", titleEn: "Partnership Format",
    pointsRu: [
      "Мероприятие для гостей бесплатное",
      "Площадка без аренды",
      "Клуб зарабатывает на напитках, десертах и кальянах",
      "Может быть включено чайное сопровождение",
      "Организатор получает 15 - 25% от выручки",
      "Организатор за себя не платит",
    ],
    pointsEn: [
      "Event is free for guests",
      "No venue rental",
      "Club earns from drinks, desserts, and hookah",
      "Tea service can be included",
      "Organizer receives 15 - 25% of revenue",
      "Organizer pays nothing for themselves",
    ],
    suitRu: "",
    suitEn: "",
  },
];

const conditions = [
  {
    numRu: "01", titleRu: "Согласование", titleEn: "Coordination",
    descRu: "Дата, формат и количество гостей согласуются заранее. Мы подбираем оптимальную конфигурацию пространства.",
    descEn: "Date, format, and number of guests are agreed upon in advance. We select the optimal space configuration.",
  },
  {
    numRu: "02", titleRu: "Подтверждение", titleEn: "Confirmation",
    descRu: "Клуб подтверждает мероприятие после согласования сценария. Каждое событие должно соответствовать духу пространства.",
    descEn: "The club confirms the event after reviewing the scenario. Each event must match the spirit of the space.",
  },
  {
    numRu: "03", titleRu: "Партнёрский %", titleEn: "Partner %",
    descRu: "Кухня в расчёт партнёрского процента не входит. Процент рассчитывается от выручки с напитков и кальянов.",
    descEn: "Kitchen is not included in the partner percentage. Percentage is calculated from drink and hookah revenue.",
  },
];

const summaryTable = [
  {
    formatRu: "Фиксированная аренда", formatEn: "Fixed Rental",
    col1Ru: "10 - 50 гостей", col1En: "10 - 50 guests",
    col2Ru: "Билеты у организатора", col2En: "Tickets with organizer",
    col3Ru: "Фиксированная стоимость", col3En: "Fixed price",
  },
  {
    formatRu: "Билетный формат", formatEn: "Ticket Format",
    col1Ru: "6 - 14 гостей", col1En: "6 - 14 guests",
    col2Ru: "Билеты у организатора", col2En: "Tickets with organizer",
    col3Ru: "Мин. заказ 1\u00a0300\u00a0₽/гость", col3En: "Min. order 1\u00a0300\u00a0₽/guest",
  },
  {
    formatRu: "Партнёрский формат", formatEn: "Partnership Format",
    col1Ru: "Бесплатно для гостей", col1En: "Free for guests",
    col2Ru: "Без аренды", col2En: "No rental",
    col3Ru: "15 - 25% организатору", col3En: "15 - 25% to organizer",
  },
];

export default function PartnershipPage() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <button className="menu-back-btn" onClick={() => window.location.replace("/#partnership-preview")}>← Назад</button>

      {/* Hero */}
      <section className="partner-hero">
        <DiamondDivider className="phil-visible" />
        <h1 className="partner-hero-title">{t("Партнёрство", "Partnership")}</h1>
        <p className="partner-hero-sub">{t("Пространство для камерных событий", "Space for intimate events")}</p>
        <p className="partner-hero-desc">{t(
          "«Код 1847» — клубное пространство для сессий, мастермайндов, выставок, закрытых встреч и авторских вечеров. Историческое здание 1847 года на Арбате, 145\u00a0м².",
          "Kod 1847 is a club space for sessions, masterminds, exhibitions, private meetings, and signature evenings. A historic 1847 building on Arbat, 145\u00a0m²."
        )}</p>
      </section>

      {/* Stats */}
      <section className="partner-stats">
        {stats.map((s, i) => (
          <div key={i} className="partner-stat">
            <div className="partner-stat-value">{s.value}</div>
            <div className="partner-stat-label">{t(s.labelRu, s.labelEn)}</div>
          </div>
        ))}
      </section>

      {/* Advantages */}
      <section className="partner-section">
        <div className="partner-section-label">{t("Преимущества для организатора", "Organizer advantages")}</div>
        <div className="partner-advantages">
          {advantages.map((a, i) => (
            <div key={i} className="partner-adv-item">
              <span className="partner-adv-marker" />
              <span>{t(a.ru, a.en)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Formats */}
      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Форматы сотрудничества", "Partnership formats")}</div>
        <div className="partner-collab-grid">
          {partnershipFormats.map((f, i) => (
            <div key={i} className="partner-collab-card">
              <div className="partner-collab-num">{f.numRu}</div>
              <div className="partner-collab-name">{t(f.titleRu, f.titleEn)}</div>
              <ul className="partner-collab-list">
                {(t(f.pointsRu.join("|||"), f.pointsEn.join("|||"))).split("|||").map((p, pi) => (
                  <li key={pi}>{p}</li>
                ))}
              </ul>
              {f.suitRu && (
                <div className="partner-collab-suit">
                  <span className="partner-section-label" style={{ marginBottom: 0, fontSize: 8 }}>{t("Подходит для", "Suitable for")}</span>
                  <span className="partner-collab-suit-text">{t(f.suitRu, f.suitEn)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ambassador */}
      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Амбассадор", "Ambassador")}</div>
        <div className="partner-ambassador">
          <div className="partner-amb-item">
            <span className="partner-amb-highlight">15 - 25%</span>
            <span>{t(" от чека приведённого гостя", " of the referred guest's check")}</span>
          </div>
          <div className="partner-amb-item">
            <span className="partner-amb-marker" />
            <span>{t("За себя не платит", "No personal charges")}</span>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Общие условия", "General conditions")}</div>
        <div className="partner-conditions">
          {conditions.map((c, i) => (
            <div key={i} className="partner-condition">
              <div className="partner-condition-num">{c.numRu}</div>
              <div className="partner-condition-title">{t(c.titleRu, c.titleEn)}</div>
              <div className="partner-condition-desc">{t(c.descRu, c.descEn)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary Table */}
      <section className="partner-section">
        <div className="partner-section-label">{t("Краткая сводка форматов", "Format summary")}</div>
        <div className="partner-summary">
          {summaryTable.map((row, i) => (
            <div key={i} className="partner-summary-row">
              <div className="partner-summary-format">{t(row.formatRu, row.formatEn)}</div>
              <div className="partner-summary-details">
                <span>{t(row.col1Ru, row.col1En)}</span>
                <span>{t(row.col2Ru, row.col2En)}</span>
                <span>{t(row.col3Ru, row.col3En)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tagline + CTA + Contact */}
      <section className="partner-section" style={{ paddingBottom: 80 }}>
        <div className="partner-tagline">{t("Доступ по ценности, не только по деньгам", "Access by value, not just by money")}</div>
        <div className="partner-contact-block">
          <div className="partner-contact-line">
            <a href="tel:+79015359000" className="partner-contact-link" onClick={() => trackEvent("click_phone", { location: "partnership" })}>+7 (901) 535-90-00</a>
          </div>
          <div className="partner-contact-line">
            <a href="https://t.me/kod1847" target="_blank" rel="noopener noreferrer" className="partner-contact-link" onClick={() => trackEvent("click_telegram", { location: "partnership" })}>t.me/kod1847</a>
          </div>
        </div>
        <button className="room-cta-btn" onClick={() => { trackEvent("click_reserve", { location: "partnership" }); setModalOpen(true); }} style={{ marginTop: 32 }}>
          {t("Обсудить сотрудничество", "Discuss partnership")}
        </button>
        <div className="partner-closing">{t("Приватность без снобизма", "Privacy without snobbery")}</div>
      </section>

      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
