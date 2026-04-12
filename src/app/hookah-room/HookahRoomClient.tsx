"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import type { TextBlock, FaqItem } from "@/lib/types";

const defaultFaq: FaqItem[] = [
  { qRu: "Как забронировать кальянную комнату?", qEn: "How to book?", aRu: "Комната резервируется заранее через администратора клуба. В заявке указываются дата, время, количество гостей и предпочтения по миксу, если они есть.", aEn: "Reserved in advance through the club administrator." },
  { qRu: "Сколько человек помещается?", qEn: "How many people?", aRu: "До шести гостей за одним столом. Комната работает по принципу «один стол — одна компания».", aEn: "Up to six guests." },
  { qRu: "Сколько длится вечер?", qEn: "How long?", aRu: "От полутора до двух часов на одну чашу. За вечер кальянщик готовит одну или две чаши.", aEn: "One and a half to two hours per bowl." },
  { qRu: "Пахнет ли одежда дымом?", qEn: "Does clothing smell?", aRu: "Нет. Вентиляция отдельная, воздух прозрачный.", aEn: "No. Separate ventilation." },
  { qRu: "Можно ли заказать конкретный вкус?", qEn: "Specific flavor?", aRu: "Да. Кальянщик собирает микс под запрос.", aEn: "Yes." },
  { qRu: "Можно ли заказать чай?", qEn: "Can I order tea?", aRu: "Да. В комнату подают чайную пару из Чайного зала.", aEn: "Yes." },
  { qRu: "Возрастные ограничения?", qEn: "Age?", aRu: "Да. Только старше 18 лет.", aEn: "18+ only." },
];

const defaultSessionRu = ["Подбор табачного микса под запрос гостя","Авторская чаша на углях, сменный сервис","Посуда клуба — колбы ручной работы, шахты из латуни","Сопровождение чайной парой по желанию","Один стол на комнату, без соседей"];
const defaultSessionEn = ["Tobacco mix selection","Signature coal bowl with change-out","Handmade glass, brass shafts","Tea pairing upon request","One table, no neighbors"];

interface Props {
  texts: Record<string, TextBlock>;
}

export default function HookahRoomClient({ texts }: Props) {
  const { t, lang } = useLang();
  const [openFaq, setOpenFaq] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? -1 : i);

  const txt = (key: string, fallbackRu: string, fallbackEn: string) => {
    const block = texts[key];
    return block ? t(block.value_ru, block.value_en) : t(fallbackRu, fallbackEn);
  };

  let sessionItems: string[];
  try {
    const raw = texts["hookah_room_session_items"];
    if (raw) {
      const arr = JSON.parse(lang === "ru" ? raw.value_ru : raw.value_en);
      sessionItems = Array.isArray(arr) ? arr : (lang === "ru" ? defaultSessionRu : defaultSessionEn);
    } else {
      sessionItems = lang === "ru" ? defaultSessionRu : defaultSessionEn;
    }
  } catch {
    sessionItems = lang === "ru" ? defaultSessionRu : defaultSessionEn;
  }

  let faqData: FaqItem[];
  try {
    const raw = texts["hookah_room_faq"];
    if (raw) {
      const arr = JSON.parse(raw.value_ru);
      faqData = Array.isArray(arr) && arr.length > 1 ? arr : defaultFaq;
    } else {
      faqData = defaultFaq;
    }
  } catch {
    faqData = defaultFaq;
  }

  return (
    <>
      <Header />
      <section className="room-hero">
        <div className="room-hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_0651.jpeg" alt={t("Кальянная комната Код 1847", "Hookah Room Kod 1847")} loading="eager" />
        </div>
        <div className="room-hero-tint" />
        <p className="room-hero-text">{txt("hookah_room_hero", "Кальянная комната «Код 1847» — отдельный зал закрытого клуба на Арбате с собственной вентиляцией и кальянщиком, который собирает микс под запрос гостя.", "The Hookah Room at Kod 1847 is a separate hall with its own ventilation and a hookah master who creates a mix tailored to the guest.")}</p>
      </section>
      <div className="room-body">
        <p>{txt("hookah_room_body_1", "Кальян здесь — не фон, а повод для разговора.", "Hookah here is not background — it is a reason for conversation.")}</p>
        <p>{txt("hookah_room_body_2", "Комната оформлена в той же палитре, что и весь клуб.", "The room is decorated in the club's palette.")}</p>
        <p>{txt("hookah_room_body_3", "Комната подходит для вечера в компании до шести человек.", "The room suits an evening with up to six people.")}</p>
      </div>
      <div className="room-session">
        <div className="room-session-title">{t("Что входит в сессию", "Session includes")}</div>
        <ul className="room-session-list">{sessionItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
      <div className="room-cta"><button className="room-cta-btn" onClick={() => setModalOpen(true)}>{t("Забронировать визит", "Book a visit")}</button></div>
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
