"use client";

import { useEffect, useState } from "react";
import type { Reservation, VisitedStatus } from "@/lib/types";

const sourceLabels: Record<string, string> = {
  "/": "Главная",
  "/tea-room": "Чайный зал",
  "/hookah-room": "Кальянная",
  "/partnership": "Партнёрство",
  events: "Мероприятие",
  club_membership: "Членство",
};

const visitedLabels: Record<VisitedStatus, { label: string; cls: string }> = {
  pending: { label: "Ожидает", cls: "bg-gold/10 text-gold" },
  came: { label: "Пришёл", cls: "bg-success-dim text-success" },
  no_show: { label: "Не пришёл", cls: "bg-danger-dim text-danger" },
  cancelled: { label: "Отменено", cls: "bg-stone-dim text-stone" },
};

function sourceName(src: string): string {
  return sourceLabels[src] || src || "—";
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

export default function ReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VisitedStatus | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    const q = filter === "all" ? "" : `?visited=${filter}`;
    fetch(`/api/reservations${q}`)
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [rev, filter]);

  async function setVisited(id: number, visited: VisitedStatus) {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visited }),
    });
    reload();
  }

  async function saveNote(id: number, manager_note: string) {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manager_note }),
    });
    reload();
  }

  async function deleteReservation(id: number) {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    reload();
  }

  async function handleSyncIiko() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/reservations/sync-iiko", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg(`Обновлено: ${data.updated} из ${data.checked}`);
        reload();
      } else {
        setSyncMsg(`Ошибка: ${data.error || "неизвестно"}`);
      }
    } catch (e) {
      setSyncMsg(`Ошибка сети: ${e instanceof Error ? e.message : "неизвестно"}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(""), 5000);
    }
  }

  const counts = {
    all: items.length,
    pending: items.filter((r) => r.visited === "pending").length,
    came: items.filter((r) => r.visited === "came").length,
    no_show: items.filter((r) => r.visited === "no_show").length,
    cancelled: items.filter((r) => r.visited === "cancelled").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="text-stone text-sm mt-1">Бронирования с сайта — данные, источник и статус визита</p>
        </div>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-xs text-stone">{syncMsg}</span>}
          <button
            onClick={handleSyncIiko}
            disabled={syncing}
            className="px-4 py-2 bg-card border border-border text-linen font-medium rounded-lg hover:border-gold/40 transition-colors text-sm disabled:opacity-50"
          >
            {syncing ? "Синхронизация..." : "Синхронизировать с iiko"}
          </button>
        </div>
      </div>

      {/* Фильтр */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { v: "all" as const, l: `Все (${counts.all})` },
          { v: "pending" as const, l: `Ожидают (${counts.pending})` },
          { v: "came" as const, l: `Пришли (${counts.came})` },
          { v: "no_show" as const, l: `Не пришли (${counts.no_show})` },
          { v: "cancelled" as const, l: `Отменены (${counts.cancelled})` },
        ].map((b) => (
          <button
            key={b.v}
            onClick={() => setFilter(b.v)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
              filter === b.v
                ? "bg-gold/15 text-gold border-gold/40"
                : "bg-card text-stone border-border hover:text-linen"
            }`}
          >
            {b.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-stone">
          Заявок пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const v = visitedLabels[r.visited] || visitedLabels.pending;
            const isOpen = expanded === r.id;
            return (
              <div
                key={r.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-gold/30"
              >
                {/* Короткое описание */}
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                    <div>
                      <div className="text-xs text-stone mb-0.5">Гость</div>
                      <div className="text-linen font-medium">{r.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone mb-0.5">Телефон</div>
                      <div className="text-linen">{r.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone mb-0.5">Дата и время</div>
                      <div className="text-linen">{formatDateTime(r.date, r.time)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone mb-0.5">Гостей</div>
                      <div className="text-linen">{r.guests || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone mb-0.5">Источник</div>
                      <div className="text-linen">
                        {sourceName(r.source)}
                        {r.event_name && <span className="text-stone"> · {r.event_name}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs rounded-full ${v.cls}`}>{v.label}</span>
                  <svg
                    className={`w-5 h-5 text-stone shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Подробное описание */}
                {isOpen && (
                  <div className="border-t border-border px-5 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <Field label="Комментарий гостя">{r.comment || "—"}</Field>
                      <Field label="Согласие на обработку ПДн">{r.consent ? "Да" : "Нет"}</Field>
                      <Field label="Создана">{formatCreated(r.created_at)}</Field>
                      <Field label="Обновлена">{formatCreated(r.updated_at)}</Field>
                      <Field label="iiko статус">
                        {r.iiko_status ? (
                          <span className={r.iiko_status === "success" ? "text-success" : "text-danger"}>
                            {r.iiko_status}
                          </span>
                        ) : "—"}
                      </Field>
                      <Field label="iiko ID">{r.iiko_id || "—"}</Field>
                      {r.iiko_error && (
                        <div className="md:col-span-2">
                          <div className="text-xs text-stone mb-1">Ошибка iiko</div>
                          <pre className="text-xs text-danger bg-panel/50 border border-border rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{r.iiko_error}</pre>
                        </div>
                      )}
                    </div>

                    <NoteEditor initial={r.manager_note} onSave={(n) => saveNote(r.id, n)} />

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      <StatusButton active={r.visited === "came"} color="success" onClick={() => setVisited(r.id, "came")}>
                        Пришёл
                      </StatusButton>
                      <StatusButton active={r.visited === "no_show"} color="danger" onClick={() => setVisited(r.id, "no_show")}>
                        Не пришёл
                      </StatusButton>
                      <StatusButton active={r.visited === "cancelled"} color="stone" onClick={() => setVisited(r.id, "cancelled")}>
                        Отмена
                      </StatusButton>
                      <StatusButton active={r.visited === "pending"} color="gold" onClick={() => setVisited(r.id, "pending")}>
                        Сбросить
                      </StatusButton>
                      <div className="ml-auto">
                        <button
                          onClick={() => deleteReservation(r.id)}
                          className="px-3 py-1.5 text-xs text-stone hover:text-danger transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-stone mb-1">{label}</div>
      <div className="text-linen">{children}</div>
    </div>
  );
}

function StatusButton({
  active, color, onClick, children,
}: {
  active: boolean;
  color: "success" | "danger" | "stone" | "gold";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const colorMap = {
    success: "bg-success-dim text-success border-success/30",
    danger: "bg-danger-dim text-danger border-danger/30",
    stone: "bg-stone-dim text-stone border-stone/30",
    gold: "bg-gold/15 text-gold border-gold/30",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
        active ? colorMap[color] : "bg-panel/50 text-stone border-border hover:text-linen"
      }`}
    >
      {children}
    </button>
  );
}

function NoteEditor({ initial, onSave }: { initial: string; onSave: (n: string) => Promise<void> }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = value !== initial;

  return (
    <div>
      <div className="text-xs text-stone mb-1">Заметка менеджера</div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        placeholder="Внутренний комментарий: предпочтения, договорённости..."
        className="w-full text-sm"
      />
      {dirty && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => { setSaving(true); await onSave(value); setSaving(false); }}
            disabled={saving}
            className="px-3 py-1.5 bg-gold text-ink text-xs rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            onClick={() => setValue(initial)}
            className="px-3 py-1.5 text-xs text-stone hover:text-linen transition-colors"
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
