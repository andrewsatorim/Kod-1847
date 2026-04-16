"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getBookingsByDay,
  getBookingSources,
  getOverviewStats,
  getReservations,
  type DateRange,
  type ReservationItem,
  type VisitedStatus,
} from "@/lib/queries";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sourceNames: Record<string, string> = {
  "/": "Главная",
  "/tea-room": "Чайный зал",
  "/hookah-room": "Кальянная",
  "/partnership": "Партнёрство",
  events: "Мероприятия",
  club_membership: "Членство",
};

const visitedMeta: Record<VisitedStatus, { label: string; dot: string; cls: string }> = {
  pending: { label: "Ожидает", dot: "#B89860", cls: "bg-gold/10 text-gold" },
  came: { label: "Пришёл", dot: "#5B9A6E", cls: "bg-[#5B9A6E]/15 text-[#7AB588]" },
  no_show: { label: "Не пришёл", dot: "#C46B6B", cls: "bg-[#C46B6B]/15 text-[#D98585]" },
  cancelled: { label: "Отменено", dot: "#6B6760", cls: "bg-stone-dim/20 text-stone" },
};

function sourceLabel(src: string): string {
  return sourceNames[src] || src || "—";
}

function formatDateTime(date: string, time: string): string {
  if (!date) return "—";
  const parts = date.split("-");
  const d = parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : date;
  return time ? `${d}, ${time}` : d;
}

function formatCreated(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export default function BookingsTab({ range }: { range: DateRange }) {
  const [bookings, setBookings] = useState<{ date: string; bookings: number }[]>([]);
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);
  const [stats, setStats] = useState<{ totalBookings: number; conversionRate: string; totalSessions: number } | null>(null);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [filter, setFilter] = useState<VisitedStatus | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getBookingsByDay(range).then(setBookings);
    getBookingSources(range).then(setSources);
    getOverviewStats(range).then(s => setStats({ totalBookings: s.totalBookings, conversionRate: s.conversionRate, totalSessions: s.totalSessions }));
    getReservations(range).then(setReservations);
  }, [range]);

  const filtered = filter === "all" ? reservations : reservations.filter(r => r.visited === filter);

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.visited === "pending").length,
    came: reservations.filter(r => r.visited === "came").length,
    no_show: reservations.filter(r => r.visited === "no_show").length,
    cancelled: reservations.filter(r => r.visited === "cancelled").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Заявки на бронирование</h2>
        <p className="text-stone text-sm mt-1">Все отправленные формы бронирования и заявки на членство</p>
      </div>

      {/* KPI */}
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

      {/* График */}
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

      {/* Источники */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Откуда приходят заявки</CardTitle>
          <CardDescription className="text-stone text-sm">
            С какой страницы сайта посетитель отправил форму бронирования.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sources.map(s => (
                <div key={s.source} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-3">
                  <span className="text-sm text-linen">{sourceLabel(s.source)}</span>
                  <span className="text-sm font-serif text-gold">{s.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>

      {/* Список карточек заявок */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Список заявок</CardTitle>
          <CardDescription className="text-stone text-sm">
            Все заявки с сайта за выбранный период — имя, телефон, дата визита, источник и отметка о визите.
            Управление статусом и заметками — в админ-панели.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-5 flex-wrap">
            {[
              { v: "all" as const, l: `Все (${counts.all})` },
              { v: "pending" as const, l: `Ожидают (${counts.pending})` },
              { v: "came" as const, l: `Пришли (${counts.came})` },
              { v: "no_show" as const, l: `Не пришли (${counts.no_show})` },
              { v: "cancelled" as const, l: `Отменены (${counts.cancelled})` },
            ].map(b => (
              <button
                key={b.v}
                onClick={() => setFilter(b.v)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors border font-sans ${
                  filter === b.v
                    ? "bg-gold/15 text-gold border-gold/40"
                    : "bg-ink-lighter/50 text-stone border-stone-dim/20 hover:text-linen"
                }`}
              >
                {b.l}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-stone-dim text-sm">
              {reservations.length === 0 ? "Заявок за выбранный период нет" : "Нет заявок с таким статусом"}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(r => {
                const v = visitedMeta[r.visited] || visitedMeta.pending;
                const isOpen = expanded === r.id;
                return (
                  <div
                    key={r.id}
                    className="rounded-lg border border-stone-dim/15 bg-ink-lighter/40 overflow-hidden transition-colors hover:border-gold/30"
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className="w-full flex items-center gap-4 px-4 py-3 text-left"
                    >
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center text-xs">
                        <div>
                          <div className="text-stone-dim mb-0.5 uppercase tracking-wide text-[10px]">Гость</div>
                          <div className="text-linen font-medium text-sm">{r.name}</div>
                        </div>
                        <div>
                          <div className="text-stone-dim mb-0.5 uppercase tracking-wide text-[10px]">Телефон</div>
                          <div className="text-linen text-sm">{r.phone}</div>
                        </div>
                        <div>
                          <div className="text-stone-dim mb-0.5 uppercase tracking-wide text-[10px]">Дата и время</div>
                          <div className="text-linen text-sm">{formatDateTime(r.date, r.time)}</div>
                        </div>
                        <div>
                          <div className="text-stone-dim mb-0.5 uppercase tracking-wide text-[10px]">Гостей</div>
                          <div className="text-linen text-sm">{r.guests || "—"}</div>
                        </div>
                        <div>
                          <div className="text-stone-dim mb-0.5 uppercase tracking-wide text-[10px]">Источник</div>
                          <div className="text-linen text-sm">
                            {sourceLabel(r.source)}
                            {r.event_name && <span className="text-stone"> · {r.event_name}</span>}
                          </div>
                        </div>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 text-[11px] rounded-full font-sans ${v.cls}`}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: v.dot }} />
                        {v.label}
                      </span>
                      <svg
                        className={`w-4 h-4 text-stone shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="border-t border-stone-dim/15 px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <Field label="Комментарий гостя">{r.comment || "—"}</Field>
                        <Field label="Заметка менеджера">{r.manager_note || "—"}</Field>
                        <Field label="Согласие на обработку ПДн">{r.consent ? "Да" : "Нет"}</Field>
                        <Field label="Создана">{formatCreated(r.created_at)}</Field>
                        <Field label="iiko статус">
                          {r.iiko_status
                            ? <span className={r.iiko_status === "success" ? "text-[#7AB588]" : "text-[#D98585]"}>{r.iiko_status}</span>
                            : "—"}
                        </Field>
                        <Field label="iiko ID">{r.iiko_id || "—"}</Field>
                        {r.iiko_error && (
                          <div className="md:col-span-2">
                            <div className="text-stone-dim mb-1 uppercase tracking-wide text-[10px]">Ошибка iiko</div>
                            <pre className="text-[#D98585] bg-ink/50 border border-stone-dim/15 rounded p-2 overflow-x-auto whitespace-pre-wrap">{r.iiko_error}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-stone-dim mb-1 uppercase tracking-wide text-[10px]">{label}</div>
      <div className="text-linen">{children}</div>
    </div>
  );
}
