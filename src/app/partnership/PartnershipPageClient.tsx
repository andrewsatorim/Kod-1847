"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";
import ReservationModal from "@/components/ReservationModal";
import type { PartnershipFormat, ClubEvent, Contact, TextBlock } from "@/lib/types";

const stats = [
  { value: "4", labelRu: "формата сотрудничества", labelEn: "partnership formats" },
  { value: "6 - 40", labelRu: "гостей на мероприятие", labelEn: "guests per event" },
  { value: "145", labelRu: "м² клубного пространства", labelEn: "m² of club space" },
  { value: "5", labelRu: "собственных мероприятий", labelEn: "signature events" },
];

const advantages = [
  { ru: "Уникальная атмосфера и исторический контекст", en: "Unique atmosphere and historical context" },
  { ru: "Гибкие форматы сотрудничества", en: "Flexible partnership formats" },
  { ru: "Чайное сопровождение гостей", en: "Tea service for guests" },
  { ru: "Камерность: от 6 до 40 гостей", en: "Intimacy: from 6 to 40 guests" },
];

const conditionsData = [
  { numRu: "01", titleRu: "Согласование", titleEn: "Coordination", descRu: "Дата, формат и количество гостей согласуются заранее. Мы подбираем оптимальную конфигурацию пространства.", descEn: "Date, format, and number of guests are agreed upon in advance. We select the optimal space configuration." },
  { numRu: "02", titleRu: "Подтверждение", titleEn: "Confirmation", descRu: "Клуб подтверждает мероприятие после согласования сценария. Каждое событие должно соответствовать духу пространства.", descEn: "The club confirms the event after reviewing the scenario. Each event must match the spirit of the space." },
  { numRu: "03", titleRu: "Партнёрский %", titleEn: "Partner %", descRu: "Кухня в расчёт партнёрского процента не входит. Процент рассчитывается от выручки с напитков и кальянов.", descEn: "Kitchen is not included in the partner percentage. Percentage is calculated from drink and hookah revenue." },
];

const summaryTable = [
  { formatRu: "Фиксированная аренда", formatEn: "Fixed Rental", col1Ru: "10 - 40 гостей", col1En: "10 - 40 guests", col2Ru: "Билеты у организатора", col2En: "Tickets with organizer", col3Ru: "Фиксированная стоимость", col3En: "Fixed price" },
  { formatRu: "Билетный формат", formatEn: "Ticket Format", col1Ru: "6 - 14 гостей", col1En: "6 - 14 guests", col2Ru: "Билеты у организатора", col2En: "Tickets with organizer", col3Ru: "Мин. заказ 1\u00a0300\u00a0₽/гость", col3En: "Min. order 1\u00a0300\u00a0₽/guest" },
  { formatRu: "Партнёрский формат", formatEn: "Partnership Format", col1Ru: "Бесплатно для гостей", col1En: "Free for guests", col2Ru: "Без аренды", col2En: "No rental", col3Ru: "15 - 25% организатору", col3En: "15 - 25% to organizer" },
];

const suitableFor = [
  { ru: "Дружественных встреч", en: "Friendly gatherings" },
  { ru: "Региональных и иностранных делегаций", en: "Regional and international delegations" },
  { ru: "Переговоров", en: "Negotiations" },
  { ru: "Нетворкинга", en: "Networking" },
];

interface Props {
  formats: PartnershipFormat[];
  clubEvents: ClubEvent[];
  texts: Record<string, TextBlock>;
  contacts: Record<string, Contact>;
}

export default function PartnershipPageClient({ formats, clubEvents, texts, contacts }: Props) {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);

  const txt = (key: string, fallbackRu: string, fallbackEn: string) => {
    const block = texts[key];
    return block ? t(block.value_ru, block.value_en) : t(fallbackRu, fallbackEn);
  };

  return (
    <>
      <Header />

      <section className="partner-hero">
        <DiamondDivider className="phil-visible" />
        <h1 className="partner-hero-title">{t("Партнёрство", "Partnership")}</h1>
        <p className="partner-hero-sub">{t("Пространство для камерных событий", "Space for intimate events")}</p>
        <p className="partner-hero-desc">{txt("partnership_hero",
          "«Код 1847» — клубное пространство для сессий, мастермайндов, выставок, закрытых встреч и авторских вечеров. Историческое здание 1847 года на Арбате, 145\u00a0м².",
          "Kod 1847 is a club space for sessions, masterminds, exhibitions, private meetings, and signature evenings. A historic 1847 building on Arbat, 145\u00a0m²."
        )}</p>
      </section>

      <section className="partner-stats">
        {stats.map((s, i) => (
          <div key={i} className="partner-stat">
            <div className="partner-stat-value">{s.value}</div>
            <div className="partner-stat-label">{t(s.labelRu, s.labelEn)}</div>
          </div>
        ))}
      </section>

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

      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Форматы сотрудничества", "Partnership formats")}</div>
        <div className="partner-collab-grid">
          {formats.map((f) => (
            <div key={f.id} className="partner-collab-card">
              <div className="partner-collab-num">{f.num}</div>
              <div className="partner-collab-name">{t(f.title_ru, f.title_en)}</div>
              <ul className="partner-collab-list">
                {(t((f.points_ru as string[]).join("|||"), (f.points_en as string[]).join("|||"))).split("|||").map((p, pi) => (
                  <li key={pi}>{p}</li>
                ))}
              </ul>
              {f.suit_ru && (
                <div className="partner-collab-suit">
                  <span className="partner-section-label" style={{ marginBottom: 0, fontSize: 8 }}>{t("Подходит для", "Suitable for")}</span>
                  <span className="partner-collab-suit-text">{t(f.suit_ru, f.suit_en)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Собственные мероприятия клуба", "Club signature events")}</div>
        <div className="partner-formats">
          {clubEvents.map((f) => (
            <div key={f.id} className="partner-format-card">
              <div className="partner-format-name">{t(f.name_ru, f.name_en)}</div>
              <div className="partner-format-desc">{t(f.desc_ru, f.desc_en)}</div>
              <div className="partner-format-detail">{t(f.detail_ru, f.detail_en)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-section-label">{t("Подходит для", "Suitable for")}</div>
        <div className="partner-suitable">
          {suitableFor.map((s, i) => (
            <div key={i} className="partner-suitable-item">{t(s.ru, s.en)}</div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Амбассадор", "Ambassador")}</div>
        <div className="partner-ambassador">
          <div className="partner-amb-item">
            <span className="partner-amb-highlight">{txt("ambassador_percent", "15 - 25%", "15 - 25%")}</span>
            <span>{txt("ambassador_desc", " от чека приведённого гостя", " of the referred guest's check")}</span>
          </div>
          <div className="partner-amb-item">
            <span className="partner-amb-marker" />
            <span>{txt("ambassador_perk", "За себя не платит", "No personal charges")}</span>
          </div>
        </div>
      </section>

      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Общие условия", "General conditions")}</div>
        <div className="partner-conditions">
          {conditionsData.map((c, i) => (
            <div key={i} className="partner-condition">
              <div className="partner-condition-num">{c.numRu}</div>
              <div className="partner-condition-title">{t(c.titleRu, c.titleEn)}</div>
              <div className="partner-condition-desc">{t(c.descRu, c.descEn)}</div>
            </div>
          ))}
        </div>
      </section>

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

      <section className="partner-section" style={{ paddingBottom: 80 }}>
        <div className="partner-tagline">{txt("partnership_tagline", "Доступ по ценности, не только по деньгам", "Access by value, not just by money")}</div>
        <div className="partner-contact-block">
          <div className="partner-contact-line">
            <a href={`tel:${(contacts.partnership_phone?.value_ru || "+79015359000").replace(/[^+\d]/g, "")}`} className="partner-contact-link">{contacts.partnership_phone?.value_ru || "+7 (901) 535-90-00"}</a>
          </div>
          <div className="partner-contact-line">
            <a href={contacts.telegram?.value_ru || "https://t.me/kod1847"} target="_blank" rel="noopener noreferrer" className="partner-contact-link">t.me/kod1847</a>
          </div>
        </div>
        <button className="room-cta-btn" onClick={() => setModalOpen(true)} style={{ marginTop: 32 }}>
          {t("Обсудить сотрудничество", "Discuss partnership")}
        </button>
        <div className="partner-closing">{txt("partnership_closing", "Приватность без снобизма", "Privacy without snobbery")}</div>
      </section>

      <Footer contacts={contacts} />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
