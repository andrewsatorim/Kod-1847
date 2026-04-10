"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";

const faqData = [
  {
    qRu: "Как забронировать стол?",
    qEn: "How to book a table?",
    aRu: "Стол резервируется заранее через администратора клуба. В заявке указываются дата, время, количество гостей и предпочтения по чаю, если они есть. Подтверждение приходит в течение дня.",
    aEn: "The table is reserved in advance through the club administrator. The request includes the date, time, number of guests, and tea preferences if any. Confirmation is sent within the day.",
  },
  {
    qRu: "Сколько длится чайная сессия?",
    qEn: "How long is a tea session?",
    aRu: "От полутора до трёх часов. Продолжительность зависит от числа сортов и формата встречи — короткая дегустация одного чая или длинный разговор на нескольких проливках.",
    aEn: "From one and a half to three hours. The duration depends on the number of varieties and the format — a short tasting of one tea or a long conversation over multiple infusions.",
  },
  {
    qRu: "Нужно ли разбираться в чае, чтобы прийти в первый раз?",
    qEn: "Do I need to know about tea to visit for the first time?",
    aRu: "Нет. Титестер ведёт гостя через всю сессию: объясняет, что вы пьёте, как правильно держать гайвань, на что обращать внимание. Первый визит — это и есть формат знакомства.",
    aEn: "No. The tea master guides the guest through the entire session: explains what you are drinking, how to hold the gaiwan, what to pay attention to. The first visit is an introduction format.",
  },
  {
    qRu: "Можно ли прийти одному?",
    qEn: "Can I come alone?",
    aRu: "Да. Зал работает и с одиночными гостями: это частый формат для работы с документами, чтения или спокойного вечера.",
    aEn: "Yes. The room also works with solo guests: this is a common format for working with documents, reading, or a quiet evening.",
  },
  {
    qRu: "Можно ли объединить чайный зал и кальянную комнату в один визит?",
    qEn: "Can I combine the tea room and hookah room in one visit?",
    aRu: "Да. Гости клуба часто переходят между залами в течение вечера. Удобный порядок обсуждается при бронировании.",
    aEn: "Yes. Club guests often move between rooms during the evening. The convenient order is discussed during booking.",
  },
  {
    qRu: "Есть ли детское меню или можно ли с детьми?",
    qEn: "Is there a children's menu or can I bring children?",
    aRu: "\"Код 1847\" — клуб для взрослых. Детей в залы не допускают.",
    aEn: "\"Kod 1847\" is an adults-only club. Children are not admitted.",
  },
  {
    qRu: "Входит ли еда в сессию?",
    qEn: "Is food included in the session?",
    aRu: "К чаю подают сезонные сладости от кондитера клуба. Полноценной кухни в зале нет — акцент на чайном опыте.",
    aEn: "Seasonal sweets from the club's pastry chef are served with tea. There is no full kitchen — the focus is on the tea experience.",
  },
];

const sessionItems = [
  { ru: "Подбор сорта титестером по запросу гостя", en: "Tea variety selection by the tea master based on guest request" },
  { ru: "Полная церемония пролива на выбранной посуде", en: "Full infusion ceremony with selected teaware" },
  { ru: "5–12 проливок одного или нескольких сортов", en: "5–12 infusions of one or several varieties" },
  { ru: "Комментарии мастера о происхождении, выдержке, технологии", en: "Master's commentary on origin, aging, and technique" },
  { ru: "Сезонные сладости от кондитера клуба", en: "Seasonal sweets from the club's pastry chef" },
];

export default function TeaRoomPage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleFaq = (i: number) => {
    setOpenFaq(openFaq === i ? -1 : i);
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Код 1847 — Чайный зал",
            description: "Закрытый чайный зал на Арбате с коллекционными чаями и полной церемонией",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Арбат",
              addressLocality: "Москва",
              addressCountry: "RU",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.qRu,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.aRu,
              },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="room-hero">
        <div className="room-hero-img">
          <img
            src="https://raw.githubusercontent.com/andrewsatorim/Kod-1847/main/IMG_0647.jpeg"
            alt={t("Чайный зал Код 1847", "Tea Room Kod 1847")}
            loading="eager"
          />
        </div>
        <div className="room-hero-tint" />
        <p className="room-hero-text">
          {t(
            "Чайный зал «Код 1847» — закрытый клуб на Арбате, где гостям подают коллекционные чаи Китая, Тайваня и Японии в формате полной церемонии с титестером.",
            "The Tea Room at Kod 1847 is a private club on Arbat, where guests are served collector teas from China, Taiwan, and Japan in a full ceremony format with a tea master."
          )}
        </p>
      </section>

      {/* Main text */}
      <div className="room-body">
        <p>
          {t(
            "За дверью — тишина, приглушённый свет и аромат выдержанного пуэра. Здесь не заказывают чай по меню в привычном смысле: разговор начинается с вопроса, какой сегодня у вас день. От ответа зависит всё остальное — будет ли это плотный шу, пробуждающий дянь хун или многолетний шэн из частной коллекции клуба.",
            "Behind the door — silence, dim light, and the aroma of aged pu-erh. Here, tea is not ordered from a menu in the usual sense: the conversation begins with a question about your day. Everything else depends on the answer — whether it will be a rich shu, an invigorating dian hong, or a years-aged sheng from the club's private collection."
          )}
        </p>
        <p>
          {t(
            "Зал рассчитан на камерные встречи: от разговора вдвоём до закрытого стола на восемь гостей. Посуда — исинская глина, фарфор Цзиндэчжэня, стекло ручной работы. Вода подбирается под минеральный профиль чая — от этого зависит, раскроется ли лист так, как задумано мастером. Каждая проливка — отдельный разговор: титестер объясняет, что вы пьёте, откуда лист, почему он ведёт себя именно так.",
            "The room is designed for intimate gatherings: from a conversation for two to a private table for eight guests. The teaware is Yixing clay, Jingdezhen porcelain, and handmade glass. Water is selected to match the mineral profile of the tea — this determines whether the leaf opens as the master intended. Each infusion is a separate conversation: the tea master explains what you are drinking, where the leaf comes from, and why it behaves the way it does."
          )}
        </p>
        <p>
          {t(
            "Сюда приходят поработать с документами под гайвань, провести деловую встречу, где важна тишина, или закрыть вечер после кальянной комнаты. Резервировать стол лучше заранее — сессия длится от полутора до трёх часов.",
            "Guests come here to work on documents over a gaiwan, hold a business meeting where silence matters, or end the evening after the hookah room. It is best to reserve a table in advance — a session lasts from one and a half to three hours."
          )}
        </p>
      </div>

      {/* Session includes */}
      <div className="room-session">
        <div className="room-session-title">
          {t("Сессия включает", "Session includes")}
        </div>
        <ul className="room-session-list">
          {sessionItems.map((item, i) => (
            <li key={i}>{t(item.ru, item.en)}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="room-cta">
        <button className="room-cta-btn" onClick={() => setModalOpen(true)}>
          {t("Забронировать стол в Чайном зале", "Book a table in the Tea Room")}
        </button>
      </div>

      {/* FAQ */}
      <div className="room-faq">
        <div className="room-faq-title">
          {t("Частые вопросы", "Frequently Asked Questions")}
        </div>
        {faqData.map((item, i) => (
          <div key={i} className="faq-item">
            <button
              className={`faq-q ${openFaq === i ? "open" : ""}`}
              onClick={() => toggleFaq(i)}
            >
              <h3>{t(item.qRu, item.qEn)}</h3>
              <span className="faq-icon">+</span>
            </button>
            <div className={`faq-a ${openFaq === i ? "open" : ""}`}>
              <p>{t(item.aRu, item.aEn)}</p>
            </div>
          </div>
        ))}
      </div>

      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
