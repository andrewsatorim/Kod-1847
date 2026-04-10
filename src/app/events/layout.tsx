import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мероприятия — Код 1847 · Расписание событий",
  description: "Дегустации, джаз-вечера, дымные церемонии, мастер-классы и закрытые ужины. Расписание мероприятий клуба «Код 1847».",
  openGraph: {
    title: "Мероприятия — Код 1847",
    description: "Расписание событий частного чайного клуба на Арбате.",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
