"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";

const faqData = [
  { qRu: "Как забронировать стол?", qEn: "How to book a table?", aRu: "Стол резервируется заранее через администратора клуба. В заявке указываются дата, время, количество гостей и предпочтения по чаю, если они есть. Подтверждение приходит в течение дня.", aEn: "The table is reserved in advance through the club administrator. The request includes the date, time, number of guests, and tea preferences if any. Confirmation is sent within the day." },
  { qRu: "Сколько длится чайная сессия?", qEn: "How long is a tea session?", aRu: "От полутора до трёх часов. Продолжительность зависит от числа сортов и формата встречи — короткая дегустация одного чая или длинный разговор на нескольких проливках.", aEn: "From one and a half to three hours." },
  { qRu: "Нужно ли разбираться в чае, чтобы прийти в первый раз?", qEn: "Do I need to know about tea?", aRu: "Нет. Титестер ведёт гостя через всю сессию: объясняет, что вы пьёте, как правильно держать гайвань, на что обращать внимание. Первый визит — это и есть формат знакомства.", aEn: "No. The tea master guides the guest through the entire session." },
  { qRu: "Можно ли прийти одному?", qEn: "Can I come alone?", aRu: "Да. Зал работает и с одиночными гостями: это частый формат для работы с документами, чтения или спокойного вечера.", aEn: "Yes. The room also works with solo guests." },
  { qRu: "Можно ли объединить чайный зал и кальянную комнату в один визит?", qEn: "Can I combine both rooms?", aRu: "Да. Гости клуба часто переходят между залами в течение вечера. Удобный порядок обсуждается при бронировании.", aEn: "Yes. Club guests often move between rooms during the evening." },
  { qRu: "Есть ли детское меню или можно ли с детьми?", qEn: "Can I bring children?", aRu: "\u00abКод 1847\u00bb — клуб для взрослых. Детей в залы не допускают.", aEn: "Kod 1847 is an adults-only club." },
  { qRu: "Входит ли еда в сессию?", qEn: "Is food included?", aRu: "К чаю подают сезонные сладости от кондитера клуба. Полноценной кухни в зале нет — акцент на чайном опыте.", aEn: "Seasonal sweets are served. No full kitchen." },
];

const sessionItems = [
  { ru: "Подбор сорта титестером по запросу гостя", en: "Tea variety selection by the tea master" },
  { ru: "Полная церемония пролива на выбранной посуде", en: "Full infusion ceremony with selected teaware" },
  { ru: "5\u201312 проливок одного или нескольких сортов", en: "5\u201312 infusions" },
  { ru: "Комментарии мастера о происхождении, выдержке, технологии", en: "Master's commentary on origin and technique" },
  { ru: "Сезонные сладости от кондитера клуба", en: "Seasonal sweets from the club's pastry chef" },
];

export default function TeaRoomPage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? -1 : i);

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Place", name: "Чайный зал — Код 1847", description: "Закрытый клуб на Арбате, где гостям подают коллекционные чаи в формате полной церемонии с титестером.", url: "https://kod1847.ru/tea-room", containedInPlace: { "@type": "LocalBusiness", name: "Код 1847", address: { "@type": "PostalAddress", streetAddress: "ул. Арбат", addressLocality: "Москва", addressCountry: "RU" } }, maximumAttendeeCapacity: 8 }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map((item) => ({ "@type": "Question", name: item.qRu, acceptedAnswer: { "@type": "Answer", text: item.aRu } })) }) }} />

      <section className="room-hero">
        <div className="room-hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_0646.jpeg" alt={t("Чайный зал Код 1847", "Tea Room Kod 1847")} loading="eager" />
        </div>
        <div className="room-hero-tint" />
        <p className="room-hero-text">{t("Чайный зал \u00abКод 1847\u00bb — закрытый клуб на Арбате, где гостям подают коллекционные чаи Китая, Тайваня и Японии в формате полной церемонии с титестером.", "The Tea Room at Kod 1847 is a private club on Arbat, where guests are served collector teas from China, Taiwan, and Japan in a full ceremony format with a tea master.")}</p>
      </section>

      <div className="room-body">
        <p>{t("За дверью — тишина, приглушённый свет и аромат выдержанного пуэра. Здесь не заказывают чай по меню в привычном смысле: разговор начинается с вопроса, какой сегодня у вас день. От ответа зависит всё остальное — будет ли это плотный шу, пробуждающий дянь хун или многолетний шэн из частной коллекции клуба.", "Behind the door — silence, dim light, and the aroma of aged pu-erh.")}</p>
        <p>{t("Зал рассчитан на камерные встречи: от разговора вдвоём до закрытого стола на восемь гостей. Посуда — исинская глина, фарфор Цзиндэчжэня, стекло ручной работы. Вода подбирается под минеральный профиль чая — от этого зависит, раскроется ли лист так, как задумано мастером. Каждая проливка — отдельный разговор: титестер объясняет, что вы пьёте, откуда лист, почему он ведёт себя именно так.", "The room is designed for intimate gatherings.")}</p>
        <p>{t("Сюда приходят поработать с документами под гайвань, провести деловую встречу, где важна тишина, или закрыть вечер после кальянной комнаты. Резервировать стол лучше заранее — сессия длится от полутора до трёх часов.", "Guests come here to work on documents over a gaiwan.")}</p>
      </div>

      <div className="room-session">
        <div className="room-session-title">{t("Что входит в сессию", "Session includes")}</div>
        <ul className="room-session-list">{sessionItems.map((item, i) => <li key={i}>{t(item.ru, item.en)}</li>)}</ul>
      </div>

      <div className="room-cta"><button className="room-cta-btn" onClick={() => setModalOpen(true)}>{t("Забронировать стол в Чайном зале", "Book a table in the Tea Room")}</button></div>

      <div className="room-faq">
        <div className="room-faq-title">{t("Частые вопросы", "FAQ")}</div>
        {faqData.map((item, i) => (
          <div key={i} className="faq-item">
            <button className={`faq-q ${openFaq === i ? "open" : ""}`} onClick={() => toggleFaq(i)}><h3>{t(item.qRu, item.qEn)}</h3><span className="faq-icon">+</span></button>
            <div className={`faq-a ${openFaq === i ? "open" : ""}`}><p>{t(item.aRu, item.aEn)}</p></div>
          </div>
        ))}
      </div>

      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
