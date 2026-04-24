"use client";

import { useEffect, useState } from "react";

interface Hall {
  id: number;
  slug: string;
  caption_ru: string;
  caption_en: string;
  title_ru: string;
  title_en: string;
  description_ru: string;
  description_en: string;
  seats: number;
  sort_order: number;
  is_visible: boolean;
  city_ru: string;
  city_en: string;
  street_ru: string;
  street_en: string;
  hours_ru: string;
  hours_en: string;
}

export default function MiniAppHallsPage() {
  const [halls, setHalls] = useState<Hall[] | null>(null);
  const [editingHall, setEditingHall] = useState<Partial<Hall> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHalls();
  }, []);

  async function loadHalls() {
    setHalls(null);
    try {
      const res = await fetch(`/api/cms/miniapp/halls`);
      const data = await res.json();
      setHalls(data);
    } catch (error) {
      console.error(error);
      setHalls([]);
    }
  }

  async function saveHall() {
    if (!editingHall?.id) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/miniapp/halls/${editingHall.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingHall),
      });
      setEditingHall(null);
      await loadHalls();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini App - Залы</h1>

      {halls === null ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : halls.length === 0 ? (
        <p className="text-stone">Нет залов</p>
      ) : (
        <div className="space-y-4">
          {halls.map((hall) => (
            <div key={hall.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{hall.title_ru}</h3>
                  <p className="text-xs text-stone mt-0.5">{hall.title_en}</p>
                  <p className="text-xs text-stone mt-1">Тип: {hall.slug}</p>
                </div>
                <button
                  onClick={() => setEditingHall({ ...hall })}
                  className="text-xs text-stone hover:text-gold transition-colors"
                >
                  Изменить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingHall && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-lg font-bold mb-4">Редактировать зал</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingHall.title_ru || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, title_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingHall.title_en || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editingHall.description_ru || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, description_ru: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editingHall.description_en || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, description_en: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Город (RU)</label>
                <input
                  type="text"
                  value={editingHall.city_ru || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, city_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Город (EN)</label>
                <input
                  type="text"
                  value={editingHall.city_en || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, city_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Улица (RU)</label>
                <input
                  type="text"
                  value={editingHall.street_ru || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, street_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Улица (EN)</label>
                <input
                  type="text"
                  value={editingHall.street_en || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, street_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Время работы (RU)</label>
                <input
                  type="text"
                  value={editingHall.hours_ru || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, hours_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Время работы (EN)</label>
                <input
                  type="text"
                  value={editingHall.hours_en || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, hours_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Места</label>
                <input
                  type="number"
                  value={editingHall.seats ?? 0}
                  onChange={(e) => setEditingHall({ ...editingHall, seats: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingHall(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveHall}
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
