"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";

const faqData = [
  { qRu: "Как забронировать кальянную комнату?", qEn: "How to book the hookah room?", aRu: "Комната резервируется заранее через администратора клуба. В заявке указываются дата, время, количество гостей и предпочтения по миксу, если они есть.", aEn: "The room is reserved in advance through the club administrator." },
  { qRu: "Сколько человек помещается в комнате?", qEn: "How many people?", aRu: "До шести гостей за одним столом. Комната работает по принципу \u00abодин стол — одна компания\u00bb: других гостей в это время в комнате не будет.", aEn: "Up to six guests at one table." },
  { qRu: "Сколько длится вечер?", qEn: "How long?", aRu: "От полутора до двух часов на одну чашу. За вечер кальянщик готовит одну или две чаши — смена табака, посуды и углей между ними входит в сервис.", aEn: "One and a half to two hours per bowl." },
  { qRu: "Пахнет ли одежда дымом после визита?", qEn: "Does clothing smell?", aRu: "Нет. Вентиляция комнаты выведена отдельно от остальных зон клуба, воздух остаётся прозрачным, запах на одежде не задерживается.", aEn: "No. Separate ventilation." },
  { qRu: "Можно ли заказать конкретный вкус или бренд табака?", qEn: "Can I order a specific flavor?", aRu: "Да. Кальянщик собирает микс под запрос гостя — от плотной классики до лёгких фруктовых композиций. Если у вас есть любимый профиль, скажите при бронировании.", aEn: "Yes. The hookah master creates a mix based on request." },
  { qRu: "Можно ли одновременно заказать чай?", qEn: "Can I order tea?", aRu: "Да. В комнату по запросу подают чайную пару из Чайного зала, чтобы соединить два ритуала за одним вечером.", aEn: "Yes. A tea pair from the Tea Room is served upon request." },
  { qRu: "Есть ли возрастные ограничения?", qEn: "Age restrictions?", aRu: "Да. В кальянную комнату допускаются только гости старше 18 лет.", aEn: "Yes. Only guests over 18." },
];

const sessionItems = [
  { ru: "Подбор табачного микса под запрос гостя", en: "Tobacco mix selection based on guest request" },
  { ru: "Авторская чаша на углях, сменный сервис в течение вечера", en: "Signature coal bowl with change-out service" },
  { ru: "Посуда клуба — колбы ручной работы, шахты из латуни", en: "Club equipment — handmade glass bases, brass shafts" },
  { ru: "Сопровождение чайной парой по желанию", en: "Tea pairing upon request" },
  { ru: "Один стол на комнату, без соседей", en: "One table per room, no neighbors" },
];

export default function HookahRoomPage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? -1 : i);

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Place", name: "Кальянная комната — Код 1847", description: "Отдельный зал закрытого клуба на Арбате с собственной вентиляцией и кальянщиком.", url: "https://kod1847.ru/hookah-room", containedInPlace: { "@type": "LocalBusiness", name: "Код 1847", address: { "@type": "PostalAddress", streetAddress: "ул. Арбат", addressLocality: "Москва", addressCountry: "RU" } }, maximumAttendeeCapacity: 6 }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map((item) => ({ "@type": "Question", name: item.qRu, acceptedAnswer: { "@type": "Answer", text: item.aRu } })) }) }} />

      <section className="room-hero">
        <div className="room-hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_0648.jpeg" alt={t("Кальянная комната Код 1847", "Hookah Room Kod 1847")} loading="eager" />
        </div>
        <div className="room-hero-tint" />
        <p className="room-hero-text">{t("Кальянная комната \u00abКод 1847\u00bb — отдельный зал закрытого клуба на Арбате с собственной вентиляцией и кальянщиком, который собирает микс под запрос гостя.", "The Hookah Room at Kod 1847 is a separate hall with its own ventilation and a hookah master who creates a mix tailored to the guest.")}</p>
      </section>

      <div className="room-body">
        <p>{t("Кальян здесь — не фон, а повод для разговора. Приготовление начинается с вопроса о настроении: плотнее и дымнее или легче и дольше, ближе к фруктам или к табачной классике, согреть вечер или освежить полдень. Кальянщик собирает чашу под ответ, а не по прайс-листу.", "Hookah here is not background — it is a reason for conversation.")}</p>
        <p>{t("Комната оформлена в той же палитре, что и весь клуб: тёплый камень стен, тёмное дерево, свет — ровно столько, чтобы читать и видеть лицо собеседника. Вентиляция выведена отдельно от остальных зон клуба — одежда не пахнет дымом, воздух остаётся прозрачным. На столе — чайная пара из соседнего зала, если захочется соединить два ритуала.", "The room is decorated in the same palette as the entire club.")}</p>
        <p>{t("Комната подходит для вечера в компании до шести человек, деловой беседы один на один и длинных разговоров, которые не вмещаются в ресторан. Работа с чашей занимает от полутора до двух часов; за один вечер кальянщик готовит одну или две чаши — смена табака, посуды и углей между ними входит в сервис.", "The room is suitable for an evening with up to six people.")}</p>
      </div>

      <div className="room-session">
        <div className="room-session-title">{t("Что входит в сессию", "Session includes")}</div>
        <ul className="room-session-list">{sessionItems.map((item, i) => <li key={i}>{t(item.ru, item.en)}</li>)}</ul>
      </div>

      <div className="room-cta"><button className="room-cta-btn" onClick={() => setModalOpen(true)}>{t("Забронировать Кальянную комнату", "Book the Hookah Room")}</button></div>

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
