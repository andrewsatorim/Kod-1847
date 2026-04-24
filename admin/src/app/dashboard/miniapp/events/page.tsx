"use client";

import { useEffect, useState } from "react";

interface Event {
  id: number;
  event_date: string;
  event_time: string;
  category: string;
  title_ru: string;
  title_en: string;
  desc_ru: string;
  desc_en: string;
  hall: string | null;
  seats_total: number;
  seats_taken: number;
  is_active: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export default function MiniAppEventsPage() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setEvents(null);
    try {
      const res = await fetch(`/api/cms/miniapp/events`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      setEvents([]);
    }
  }

  async function saveEvent() {
    if (!editingEvent?.title_ru || !editingEvent?.event_date) return;
    setSaving(true);
    try {
      if (editingEvent.id) {
        await fetch(`/api/cms/miniapp/events/${editingEvent.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEvent),
        });
      } else {
        await fetch(`/api/cms/miniapp/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEvent),
        });
      }
      setEditingEvent(null);
      await loadEvents();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: number) {
    if (!confirm("Удалить событие?")) return;
    try {
      await fetch(`/api/cms/miniapp/events/${id}`, {
        method: "DELETE",
      });
      await loadEvents();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini App - События</h1>

      <button
        onClick={() =>
          setEditingEvent({
            event_date: new Date().toISOString().split("T")[0],
            event_time: "18:00",
            category: "",
            title_ru: "",
            title_en: "",
            desc_ru: "",
            desc_en: "",
            hall: null,
            seats_total: 0,
            seats_taken: 0,
            is_active: true,
            is_visible: true,
          })
        }
        className="mb-4 px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
      >
        + Событие
      </button>

      {events === null ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : events.length === 0 ? (
        <p className="text-stone">Нет событий</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title_ru}</h3>
                  <p className="text-xs text-stone mt-0.5">
                    {event.event_date} {event.event_time} • {event.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEvent({ ...event })}
                    className="text-xs text-stone hover:text-gold transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-xs text-stone hover:text-danger transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-lg font-bold mb-4">
              {editingEvent.id ? "Редактировать событие" : "Новое событие"}
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-xs text-stone mb-1">Дата</label>
                <input
                  type="date"
                  value={editingEvent.event_date || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Время</label>
                <input
                  type="time"
                  value={editingEvent.event_time || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_time: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Категория</label>
                <input
                  type="text"
                  value={editingEvent.category || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingEvent.title_ru || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingEvent.title_en || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editingEvent.desc_ru || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, desc_ru: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editingEvent.desc_en || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, desc_en: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveEvent}
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
