"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";

const faqData = [
  { qRu: "Как забронировать кальянную комнату?", qEn: "How to book?", aRu: "Комната резервируется заранее через администратора клуба. В заявке указываются дата, время, количество гостей и предпочтения по миксу, если они есть.", aEn: "Reserved in advance through the club administrator." },
  { qRu: "Сколько человек помещается?", qEn: "How many people?", aRu: "До шести гостей за одним столом. Комната работает по принципу \u00abодин стол \u2014 одна компания\u00bb.", aEn: "Up to six guests." },
  { qRu: "Сколько длится вечер?", qEn: "How long?", aRu: "От полутора до двух часов на одну чашу. За вечер кальянщик готовит одну или две чаши.", aEn: "One and a half to two hours per bowl." },
  { qRu: "Пахнет ли одежда дымом?", qEn: "Does clothing smell?", aRu: "Нет. Вентиляция отдельная, воздух прозрачный.", aEn: "No. Separate ventilation." },
  { qRu: "Можно ли заказать конкретный вкус?", qEn: "Specific flavor?", aRu: "Да. Кальянщик собирает микс под запрос.", aEn: "Yes." },
  { qRu: "Можно ли заказать чай?", qEn: "Can I order tea?", aRu: "Да. В комнату подают чайную пару из Чайного зала.", aEn: "Yes." },
  { qRu: "Возрастные ограничения?", qEn: "Age?", aRu: "Да. Только старше 18 лет.", aEn: "18+ only." },
];

const sessionItems = [
  { ru: "Подбор табачного микса под запрос гостя", en: "Tobacco mix selection" },
  { ru: "Авторская чаша на углях, сменный сервис", en: "Signature coal bowl with change-out" },
  { ru: "Посуда клуба \u2014 колбы ручной работы, шахты из латуни", en: "Handmade glass, brass shafts" },
  { ru: "Сопровождение чайной парой по желанию", en: "Tea pairing upon request" },
  { ru: "Один стол на комнату, без соседей", en: "One table, no neighbors" },
];

export default function HookahRoomPage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? -1 : i);

  return (
    <>
      <Header />
      <button className="menu-back-btn" onClick={() => window.location.replace("/#rooms")}>← Назад</button>
      <section className="room-hero">
        <div className="room-hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_0651.jpeg" alt={t("Кальянная комната Код 1847", "Hookah Room Kod 1847")} loading="eager" />
        </div>
        <div className="room-hero-tint" />
        <p className="room-hero-text">{t("Кальянная комната \u00abКод 1847\u00bb \u2014 отдельный зал закрытого клуба на Арбате с собственной вентиляцией и кальянщиком, который собирает микс под запрос гостя.", "The Hookah Room at Kod 1847 is a separate hall with its own ventilation and a hookah master who creates a mix tailored to the guest.")}</p>
      </section>
      <div className="room-body">
        <p>{t("Кальян здесь \u2014 не фон, а повод для разговора. Приготовление начинается с вопроса о настроении: плотнее и дымнее или легче и дольше, ближе к фруктам или к табачной классике, согреть вечер или освежить полдень. Кальянщик собирает чашу под ответ, а не по прайс-листу.", "Hookah here is not background \u2014 it is a reason for conversation.")}</p>
        <p>{t("Комната оформлена в той же палитре, что и весь клуб: тёплый камень стен, тёмное дерево, свет \u2014 ровно столько, чтобы читать и видеть лицо собеседника. Вентиляция выведена отдельно \u2014 одежда не пахнет дымом, воздух прозрачный. На столе \u2014 чайная пара из соседнего зала.", "The room is decorated in the club's palette.")}</p>
        <p>{t("Комната подходит для вечера в компании до шести человек. Работа с чашей занимает от полутора до двух часов; за один вечер кальянщик готовит одну или две чаши \u2014 смена табака, посуды и углей входит в сервис.", "The room suits an evening with up to six people.")}</p>
      </div>
      <div className="room-session">
        <div className="room-session-title">{t("Что входит в сессию", "Session includes")}</div>
        <ul className="room-session-list">{sessionItems.map((item, i) => <li key={i}>{t(item.ru, item.en)}</li>)}</ul>
      </div>
      <div className="room-cta"><button className="room-cta-btn" onClick={() => { trackEvent("click_reserve", { location: "hookah-room" }); setModalOpen(true); }}>{t("Забронировать визит", "Book a visit")}</button></div>
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
