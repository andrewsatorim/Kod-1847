"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getBookingsByDay, getBookingSources, getOverviewStats, type DateRange } from "@/lib/queries";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BookingsTab({ range }: { range: DateRange }) {
  const [bookings, setBookings] = useState<{ date: string; bookings: number }[]>([]);
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);
  const [stats, setStats] = useState<{ totalBookings: number; conversionRate: string; totalSessions: number } | null>(null);

  useEffect(() => {
    getBookingsByDay(range).then(setBookings);
    getBookingSources(range).then(setSources);
    getOverviewStats(range).then(s => setStats({ totalBookings: s.totalBookings, conversionRate: s.conversionRate, totalSessions: s.totalSessions }));
  }, [range]);

  const sourceNames: Record<string, string> = {
    "/": "Главная",
    "/tea-room": "Чайный зал",
    "/hookah-room": "Кальянная комната",
    "/partnership": "Партнёрство",
    events: "Мероприятия",
    club_membership: "Членство",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Заявки на бронирование</h2>
        <p className="text-stone text-sm mt-1">Все отправленные формы бронирования и заявки на членство</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Всего заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{stats?.totalBookings ?? "..."}</div>
            <p className="text-xs text-stone-dim mt-3 leading-relaxed">Общее количество отправленных форм бронирования за выбранный период.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Конверсия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-gold">{stats?.conversionRate ?? "..."}%</div>
            <p className="text-xs text-stone-dim mt-3 leading-relaxed">Процент посетителей, оставивших заявку. Формула: заявки / визиты × 100.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Визиты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{stats?.totalSessions ?? "..."}</div>
            <p className="text-xs text-stone-dim mt-3 leading-relaxed">Общее число уникальных сессий, из которых рассчитывается конверсия.</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Заявки по дням</CardTitle>
          <CardDescription className="text-stone text-sm">
            Динамика поступления заявок. Пики могут совпадать с мероприятиями, публикациями в соцсетях или рекламными кампаниями.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={bookings}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B9A6E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5B9A6E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis dataKey="date" stroke="#6B6760" fontSize={11} fontFamily="Raleway" tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6B6760" fontSize={11} fontFamily="Raleway" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }} />
                <Area type="monotone" dataKey="bookings" stroke="#5B9A6E" strokeWidth={2} fill="url(#greenGrad)" name="Заявки" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>

      {/* Sources */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Откуда приходят заявки</CardTitle>
          <CardDescription className="text-stone text-sm">
            С какой страницы сайта посетитель отправил форму бронирования. Помогает понять, какие разделы лучше конвертируют.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sources.map(s => (
                <div key={s.source} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-3">
                  <span className="text-sm text-linen">{sourceNames[s.source] || s.source}</span>
                  <span className="text-sm font-serif text-gold">{s.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
