"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getBookingsByDay, getBookingSources, getOverviewStats, type DateRange } from "@/lib/queries";
import {
  listBookingRequests,
  updateBookingStatus,
  updateBookingNote,
  deleteBookingRequest,
  syncBookingWithIiko,
  type BookingRequest,
  type VisitStatus,
} from "@/lib/booking-requests";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sourceNames: Record<string, string> = {
  "/": "Главная",
  "/tea-room": "Чайный зал",
  "/hookah-room": "Кальянная комната",
  "/partnership": "Партнёрство",
  events: "Мероприятия",
  club_membership: "Членство",
};

const statusLabels: Record<VisitStatus | "all", string> = {
  all: "Все",
  pending: "Ожидают",
  came: "Пришли",
  no_show: "Не пришли",
  cancelled: "Отменены",
};

const statusBadge: Record<VisitStatus, { label: string; className: string }> = {
  pending: { label: "Ожидает", className: "bg-gold/10 text-gold border-gold/30" },
  came: { label: "Пришёл", className: "bg-green-500/10 text-green-400 border-green-500/30" },
  no_show: { label: "Не пришёл", className: "bg-red-500/10 text-red-400 border-red-500/30" },
  cancelled: { label: "Отменено", className: "bg-stone/10 text-stone border-stone/30" },
};

const iikoLabels: Record<BookingRequest["iiko_status"], string> = {
  not_synced: "Не синхронизировано",
  pending: "Синхронизация...",
  synced: "В iiko",
  failed: "Ошибка iiko",
};

function formatDateTime(d: string) {
  try {
    return new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return d; }
}

function formatVisit(date: string | null, time: string | null) {
  if (!date && !time) return "—";
  const d = date ? new Date(date + "T00:00:00").toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
  return [d, time].filter(Boolean).join(" · ");
}

function BookingCard({ b, onChange }: { b: BookingRequest; onChange: (next: BookingRequest | null) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(b.manager_note || "");
  const [savingNote, setSavingNote] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setNote(b.manager_note || ""); }, [b.manager_note]);

  const setStatus = async (s: VisitStatus | null) => {
    setBusy(true);
    const target: VisitStatus = s ?? "pending";
    const ok = await updateBookingStatus(b.id, target);
    setBusy(false);
    if (ok) onChange({ ...b, visit_status: target });
  };

  const saveNote = async () => {
    setSavingNote(true);
    const ok = await updateBookingNote(b.id, note);
    setSavingNote(false);
    if (ok) onChange({ ...b, manager_note: note });
  };

  const remove = async () => {
    if (!confirm(`Удалить заявку от ${b.guest_name}?`)) return;
    setBusy(true);
    const ok = await deleteBookingRequest(b.id);
    setBusy(false);
    if (ok) onChange(null);
  };

  const sync = async () => {
    setSyncing(true);
    const updated = await syncBookingWithIiko(b);
    setSyncing(false);
    if (updated) onChange(updated);
  };

  const badge = statusBadge[b.visit_status];

  return (
    <div className="rounded-lg border border-stone-dim/15 bg-ink-lighter/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-3 grid grid-cols-12 items-center gap-3 hover:bg-ink-light/40 transition-colors"
      >
        <div className="col-span-12 md:col-span-3">
          <div className="text-sm text-linen font-medium">{b.guest_name || "—"}</div>
          <div className="text-xs text-stone-dim mt-0.5">{b.phone || "—"}</div>
        </div>
        <div className="col-span-6 md:col-span-3 text-xs text-stone">{formatVisit(b.visit_date, b.visit_time)}</div>
        <div className="col-span-3 md:col-span-1 text-xs text-stone text-right md:text-left">
          {b.guests_count != null ? `${b.guests_count} гост.` : "—"}
        </div>
        <div className="col-span-3 md:col-span-3 text-xs text-stone-dim truncate">{sourceNames[b.source] || b.source}{b.source_detail ? ` · ${b.source_detail}` : ""}</div>
        <div className="col-span-12 md:col-span-2 flex md:justify-end">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${badge.className}`}>{badge.label}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-stone-dim/15 px-4 py-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-xs">
            <Row label="Согласие на обработку ПДн" value={b.consent_pdn ? "Дано" : "Не дано"} valueClass={b.consent_pdn ? "text-green-400" : "text-red-400"} />
            <Row label="Дата создания" value={formatDateTime(b.created_at)} />
            {b.email && <Row label="Email" value={b.email} />}
            {b.comment && <Row label="Комментарий" value={b.comment} />}
            <Row label="iiko статус" value={iikoLabels[b.iiko_status]} />
            {b.iiko_id && <Row label="iiko ID" value={b.iiko_id} valueClass="font-mono break-all" />}
            {b.iiko_error && <Row label="Ошибка iiko" value={b.iiko_error} valueClass="text-red-400" />}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-stone-dim">Заметка менеджера</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                onBlur={() => { if ((b.manager_note || "") !== note) saveNote(); }}
                placeholder="Внутренние заметки по заявке"
                className="mt-1 w-full min-h-[72px] rounded-md border border-stone-dim/20 bg-ink-light px-3 py-2 text-xs text-linen placeholder:text-stone-dim/60 focus:outline-none focus:border-gold/50"
              />
              {savingNote && <div className="text-[10px] text-stone-dim mt-1">Сохранение...</div>}
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionBtn onClick={() => setStatus("came")} disabled={busy || b.visit_status === "came"} variant="green">Пришёл</ActionBtn>
              <ActionBtn onClick={() => setStatus("no_show")} disabled={busy || b.visit_status === "no_show"} variant="red">Не пришёл</ActionBtn>
              <ActionBtn onClick={() => setStatus("cancelled")} disabled={busy || b.visit_status === "cancelled"} variant="stone">Отмена</ActionBtn>
              <ActionBtn onClick={() => setStatus("pending")} disabled={busy || b.visit_status === "pending"} variant="outline">Сбросить</ActionBtn>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-dim/10">
              <ActionBtn onClick={sync} disabled={syncing || b.iiko_status === "pending"} variant="gold">
                {syncing ? "Синхронизация..." : b.iiko_status === "synced" ? "Пересоздать в iiko" : "Отправить в iiko"}
              </ActionBtn>
              <ActionBtn onClick={remove} disabled={busy} variant="danger">Удалить</ActionBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass = "text-linen" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <span className="text-stone-dim">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function ActionBtn({ children, onClick, disabled, variant }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; variant: "green" | "red" | "stone" | "outline" | "gold" | "danger" }) {
  const map: Record<string, string> = {
    green: "bg-green-500/15 text-green-300 border-green-500/40 hover:bg-green-500/25",
    red: "bg-red-500/15 text-red-300 border-red-500/40 hover:bg-red-500/25",
    stone: "bg-stone/15 text-linen-dim border-stone/40 hover:bg-stone/25",
    outline: "bg-transparent text-stone border-stone-dim/40 hover:bg-ink-light/40",
    gold: "bg-gold/15 text-gold border-gold/40 hover:bg-gold/25",
    danger: "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md border text-[11px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${map[variant]}`}
    >
      {children}
    </button>
  );
}

export default function BookingsTab({ range }: { range: DateRange }) {
  const [bookings, setBookings] = useState<{ date: string; bookings: number }[]>([]);
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);
  const [stats, setStats] = useState<{ totalBookings: number; conversionRate: string; totalSessions: number } | null>(null);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VisitStatus | "all">("all");
  const [bulkSyncing, setBulkSyncing] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    listBookingRequests(range).then(rs => { setRequests(rs); setLoading(false); });
  }, [range]);

  useEffect(() => {
    getBookingsByDay(range).then(setBookings);
    getBookingSources(range).then(setSources);
    getOverviewStats(range).then(s => setStats({ totalBookings: s.totalBookings, conversionRate: s.conversionRate, totalSessions: s.totalSessions }));
    reload();
  }, [range, reload]);

  const counts = useMemo(() => {
    const c: Record<VisitStatus | "all", number> = { all: requests.length, pending: 0, came: 0, no_show: 0, cancelled: 0 };
    for (const r of requests) c[r.visit_status]++;
    return c;
  }, [requests]);

  const filtered = useMemo(() => filter === "all" ? requests : requests.filter(r => r.visit_status === filter), [requests, filter]);

  const handleCardChange = (id: number, next: BookingRequest | null) => {
    setRequests(prev => next ? prev.map(r => r.id === id ? next : r) : prev.filter(r => r.id !== id));
  };

  const syncAllPending = async () => {
    const pending = requests.filter(r => r.iiko_status !== "synced" && r.iiko_status !== "pending" && r.consent_pdn);
    if (pending.length === 0) { alert("Нет заявок для синхронизации"); return; }
    if (!confirm(`Отправить в iiko ${pending.length} заявок?`)) return;
    setBulkSyncing(true);
    for (const r of pending) {
      const updated = await syncBookingWithIiko(r);
      if (updated) setRequests(prev => prev.map(x => x.id === updated.id ? updated : x));
    }
    setBulkSyncing(false);
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
            С какой страницы сайта посетитель отправил форму бронирования.
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

      {/* Bookings list */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Список заявок</CardTitle>
          <CardDescription className="text-stone text-sm">
            Все заявки с сайта за выбранный период. Раскройте карточку, чтобы изменить статус визита или оставить заметку менеджера.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              type="button"
              onClick={syncAllPending}
              disabled={bulkSyncing}
              className="px-3 py-1.5 rounded-md border border-gold/40 bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 disabled:opacity-50"
            >
              {bulkSyncing ? "Синхронизация..." : "Синхронизировать с iiko"}
            </button>
            <button
              type="button"
              onClick={reload}
              className="px-3 py-1.5 rounded-md border border-stone-dim/30 bg-transparent text-stone text-xs font-medium hover:bg-ink-lighter/40"
            >
              Обновить
            </button>
            <div className="flex flex-wrap gap-2 ml-auto">
              {(["all", "pending", "came", "no_show", "cancelled"] as const).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-md border text-[11px] font-medium transition-colors ${
                    filter === k
                      ? "bg-gold/15 text-gold border-gold/40"
                      : "bg-transparent text-stone border-stone-dim/30 hover:bg-ink-lighter/40"
                  }`}
                >
                  {statusLabels[k]} ({counts[k]})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-stone-dim text-sm">Загрузка...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-stone-dim text-sm">Заявок за выбранный период нет</div>
          ) : (
            <div className="space-y-2">
              {filtered.map(b => (
                <BookingCard key={b.id} b={b} onChange={(next) => handleCardChange(b.id, next)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
