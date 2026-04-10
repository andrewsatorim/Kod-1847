"use client";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

const rooms = [
  {
    id: "tea",
    href: "/tea-room",
    desktopImg: "/IMG_0646.jpeg",
    mobileImg: "/IMG_0647.jpeg",
    titleRu: "\u0427\u0430\u0439\u043d\u044b\u0439 \u0437\u0430\u043b",
    titleEn: "Tea Room",
    descRu: "\u041a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u043e\u043d\u043d\u044b\u0435 \u0447\u0430\u0438 \u041a\u0438\u0442\u0430\u044f, \u0422\u0430\u0439\u0432\u0430\u043d\u044f \u0438 \u042f\u043f\u043e\u043d\u0438\u0438. \u041f\u043e\u043b\u043d\u0430\u044f \u0446\u0435\u0440\u0435\u043c\u043e\u043d\u0438\u044f \u0441 \u0442\u0438\u0442\u0435\u0441\u0442\u0435\u0440\u043e\u043c. \u041a\u0430\u043c\u0435\u0440\u043d\u044b\u0435 \u0441\u0442\u043e\u043b\u044b \u043d\u0430 \u0434\u0432\u043e\u0438\u0445 \u0438 \u043d\u0430 \u0432\u043e\u0441\u0435\u043c\u044c.",
    descEn: "Collector teas from China, Taiwan, and Japan. Full ceremony with a tea master. Intimate tables for two or eight.",
  },
  {
    id: "hookah",
    href: "/hookah-room",
    desktopImg: "/IMG_0651.jpeg",
    mobileImg: "/IMG_0648.jpeg",
    titleRu: "\u041a\u0430\u043b\u044c\u044f\u043d\u043d\u0430\u044f \u043a\u043e\u043c\u043d\u0430\u0442\u0430",
    titleEn: "Hookah Room",
    descRu: "\u041e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u0437\u0430\u043b \u0441 \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0439 \u0432\u0435\u043d\u0442\u0438\u043b\u044f\u0446\u0438\u0435\u0439. \u041a\u0430\u043b\u044c\u044f\u043d\u0449\u0438\u043a \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u0442 \u043c\u0438\u043a\u0441 \u043f\u043e\u0434 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 \u0433\u043e\u0441\u0442\u044f. \u041e\u0434\u0438\u043d \u0441\u0442\u043e\u043b \u2014 \u043e\u0434\u043d\u0430 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u044f.",
    descEn: "A separate room with its own ventilation. The hookah master builds a mix to match your mood. One table \u2014 one group.",
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
              {t("\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435", "Learn more")}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
