"use client";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

const rooms = [
  {
    id: "tea",
    href: "/tea-room",
    desktopImg: "/IMG_0646.jpeg",
    mobileImg: "/IMG_0647.jpeg",
    titleRu: "Чайный зал",
    titleEn: "Tea Room",
    descRu: "Коллекционные чаи Китая, Тайваня и Японии. Полная церемония с титестером. Камерные столы на двоих и на восемь.",
    descEn: "Collector teas from China, Taiwan, and Japan. Full ceremony with a tea master. Intimate tables for two or eight.",
  },
  {
    id: "hookah",
    href: "/hookah-room",
    desktopImg: "/IMG_0651.jpeg",
    mobileImg: "/IMG_0648.jpeg",
    titleRu: "Кальянный зал",
    titleEn: "Hookah Room",
    descRu: "Отдельный зал с собственной вентиляцией. Кальянщик собирает микс под настроение гостя. Один стол — одна компания.",
    descEn: "A separate room with its own ventilation. The hookah master builds a mix to match your mood. One table — one group.",
  },
];

export default function RoomPreviews() {
  const { t } = useLang();

  return (
    <section className="room-previews">
      {rooms.map((room) => (
        <div key={room.id} className="room-preview-card" style={{ opacity: 1, transform: 'none' }}>
          <picture className="room-preview-img">
            <source media="(min-width: 768px)" srcSet={room.desktopImg} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={room.mobileImg} alt={t(room.titleRu, room.titleEn)} loading="lazy" />
          </picture>
          <div className="room-preview-tint" />
          <div className="room-preview-content">
            <h2 className="room-preview-title">{t(room.titleRu, room.titleEn)}</h2>
            <p className="room-preview-desc">{t(room.descRu, room.descEn)}</p>
            <Link href={room.href} className="room-preview-cta">
              {t("Подробнее", "Learn more")}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
