"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/lib/types";

const emptyEvent: Omit<Event, "id" | "created_at"> = {
  day: "",
  month_ru: "",
  month_en: "",
  name_ru: "",
  name_en: "",
  desc_ru: "",
  desc_en: "",
  time: "",
  tag_ru: "",
  tag_en: "",
  sort_order: 0,
  is_active: true,
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Partial<Event> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, [rev]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    if (editing.id) {
      const { id, created_at: _ca, ...rest } = editing as Event;
      void _ca;
      await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    } else {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    }

    setSaving(false);
    setEditing(null);
    reload();
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить мероприятие?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    reload();
  }

  async function toggleActive(event: Event) {
    await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, is_active: !event.is_active }),
    });
    reload();
  }

  function setField(key: string, value: string | number | boolean) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-stone">
        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        Загрузка...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Мероприятия</h1>
        <button
          onClick={() => setEditing({ ...emptyEvent, sort_order: events.length + 1 })}
          className="px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          + Добавить
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-stone text-left">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Время</th>
              <th className="px-4 py-3 font-medium">Тег</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-border/50 hover:bg-panel/50">
                <td className="px-4 py-3 text-stone">{ev.sort_order}</td>
                <td className="px-4 py-3">
                  {ev.day} {ev.month_ru}
                </td>
                <td className="px-4 py-3">{ev.name_ru}</td>
                <td className="px-4 py-3 text-stone">{ev.time}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded-full">
                    {ev.tag_ru}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(ev)}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      ev.is_active
                        ? "bg-success-dim text-success"
                        : "bg-danger-dim text-danger"
                    }`}
                  >
                    {ev.is_active ? "Активно" : "Скрыто"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => setEditing({ ...ev })}
                    className="text-stone hover:text-gold transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-stone hover:text-danger transition-colors"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-stone">
                  Нет мероприятий
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">
              {editing.id ? "Редактировать мероприятие" : "Новое мероприятие"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone mb-1">День</label>
                <input
                  type="text"
                  value={editing.day || ""}
                  onChange={(e) => setField("day", e.target.value)}
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Время</label>
                <input
                  type="text"
                  value={editing.time || ""}
                  onChange={(e) => setField("time", e.target.value)}
                  placeholder="18:00"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Месяц (RU)</label>
                <input
                  type="text"
                  value={editing.month_ru || ""}
                  onChange={(e) => setField("month_ru", e.target.value)}
                  placeholder="Апрель"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Месяц (EN)</label>
                <input
                  type="text"
                  value={editing.month_en || ""}
                  onChange={(e) => setField("month_en", e.target.value)}
                  placeholder="April"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editing.name_ru || ""}
                  onChange={(e) => setField("name_ru", e.target.value)}
                  placeholder="Чайная дегустация"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editing.name_en || ""}
                  onChange={(e) => setField("name_en", e.target.value)}
                  placeholder="Tea Tasting"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editing.desc_ru || ""}
                  onChange={(e) => setField("desc_ru", e.target.value)}
                  rows={2}
                  placeholder="Описание мероприятия"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editing.desc_en || ""}
                  onChange={(e) => setField("desc_en", e.target.value)}
                  rows={2}
                  placeholder="Event description"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Тег (RU)</label>
                <input
                  type="text"
                  value={editing.tag_ru || ""}
                  onChange={(e) => setField("tag_ru", e.target.value)}
                  placeholder="Дегустация"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Тег (EN)</label>
                <input
                  type="text"
                  value={editing.tag_en || ""}
                  onChange={(e) => setField("tag_en", e.target.value)}
                  placeholder="Tasting"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Порядок</label>
                <input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setField("sort_order", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(e) => setField("is_active", e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm">Активно (показывать на сайте)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
