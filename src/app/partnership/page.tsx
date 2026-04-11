"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";
import ReservationModal from "@/components/ReservationModal";

const stats = [
  { valueRu: "4", labelRu: "формата сотрудничества", labelEn: "partnership formats" },
  { valueRu: "6—40", labelRu: "гостей на мероприятие", labelEn: "guests per event" },
  { valueRu: "145", labelRu: "м² клубного пространства", labelEn: "m² of club space" },
  { valueRu: "5", labelRu: "собственных мероприятий", labelEn: "signature events" },
];

const advantages = [
  { ru: "Уникальная атмосфера и исторический контекст", en: "Unique atmosphere and historical context" },
  { ru: "Гибкие форматы сотрудничества", en: "Flexible partnership formats" },
  { ru: "Чайное сопровождение гостей", en: "Tea service for guests" },
  { ru: "Камерность: от 6 до 40 гостей", en: "Intimacy: from 6 to 40 guests" },
];

const formats = [
  {
    nameRu: "Пятничный «Открытый» стол", nameEn: "Friday Open Table",
    descRu: "Варка чая на огне, пролив 3—5 чаев. Идеально для общения и знакомства.",
    descEn: "Fire-brewed tea, 3–5 tea infusions. Ideal for socializing.",
    detailRu: "До 20 гостей · 3 часа", detailEn: "Up to 20 guests · 3 hours",
  },
  {
    nameRu: "КиноЧай", nameEn: "CineTea",
    descRu: "Совместный просмотр глубокого кинематографа и обсуждение с модератором и экспертами.",
    descEn: "Screening of art-house cinema with moderated discussion.",
    detailRu: "До 20 гостей · 2—3 часа · 2 раза в месяц", detailEn: "Up to 20 guests · 2–3 hours · Twice a month",
  },
  {
    nameRu: "Чайное действие", nameEn: "Tea Experience",
    descRu: "Погружение в чайные традиции и историю. Серьёзные переговоры с тактичным разливом.",
    descEn: "Immersion into tea traditions and history. Thoughtful meetings with tactful service.",
    detailRu: "До 8 гостей · 1,5—2 часа · 3—5 чаев", detailEn: "Up to 8 guests · 1.5–2 hours · 3–5 teas",
  },
  {
    nameRu: "Стилизованные чаепития", nameEn: "Themed Tea Ceremonies",
    descRu: "Самоварное, чаоджоуское, тайваньское чаепития. Вау-эффект и новые эмоции.",
    descEn: "Samovar, Chaozhou, Taiwanese tea ceremonies. Wow-effect and new emotions.",
    detailRu: "3—12 гостей · 1,5—2 часа", detailEn: "3–12 guests · 1.5–2 hours",
  },
];

const suitableFor = [
  { ru: "Дружественных встреч", en: "Friendly gatherings" },
  { ru: "Региональных и иностранных делегаций", en: "Regional and international delegations" },
  { ru: "Переговоров", en: "Negotiations" },
  { ru: "Нетворкинга", en: "Networking" },
];

export default function PartnershipPage() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="partner-hero">
        <DiamondDivider className="phil-visible" />
        <h1 className="partner-hero-title">{t("Партнёрство", "Partnership")}</h1>
        <p className="partner-hero-sub">{t("Пространство для камерных событий", "Space for intimate events")}</p>
        <p className="partner-hero-desc">{t(
          "«Код 1847» — клубное пространство для сессий, мастермайндов, выставок, закрытых встреч и авторских вечеров. Историческое здание 1847 года на Арбате.",
          "Kod 1847 is a club space for sessions, masterminds, exhibitions, private meetings, and signature evenings. A historic 1847 building on Arbat."
        )}</p>
      </section>

      {/* Stats */}
      <section className="partner-stats">
        {stats.map((s, i) => (
          <div key={i} className="partner-stat">
            <div className="partner-stat-value">{s.valueRu}</div>
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
              <span className="partner-adv-dash">—</span>
              <span>{t(a.ru, a.en)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="partner-section">
        <DiamondDivider className="phil-visible" />
        <div className="partner-section-title">{t("Форматы мероприятий", "Event formats")}</div>
        <div className="partner-formats">
          {formats.map((f, i) => (
            <div key={i} className="partner-format-card">
              <div className="partner-format-name">{t(f.nameRu, f.nameEn)}</div>
              <div className="partner-format-desc">{t(f.descRu, f.descEn)}</div>
              <div className="partner-format-detail">{t(f.detailRu, f.detailEn)}</div>
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
            <span className="partner-amb-highlight">15—25%</span>
            <span>{t(" от чека приведённого гостя", " of the referred guest's check")}</span>
          </div>
          <div className="partner-amb-item">
            <span className="partner-amb-dash">—</span>
            <span>{t("За себя не платит", "No personal charges")}</span>
          </div>
        </div>
      </section>

      {/* Suitable for */}
      <section className="partner-section">
        <div className="partner-section-label">{t("Подходит для", "Suitable for")}</div>
        <div className="partner-suitable">
          {suitableFor.map((s, i) => (
            <div key={i} className="partner-suitable-item">{t(s.ru, s.en)}</div>
          ))}
        </div>
      </section>

      {/* Tagline + CTA */}
      <section className="partner-section" style={{ paddingBottom: 80 }}>
        <div className="partner-tagline">{t("Чай и кальян — инструменты, а не самоцель", "Tea and hookah are tools, not the goal")}</div>
        <button className="room-cta-btn" onClick={() => setModalOpen(true)} style={{ marginTop: 40 }}>
          {t("Обсудить сотрудничество", "Discuss partnership")}
        </button>
      </section>

      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
