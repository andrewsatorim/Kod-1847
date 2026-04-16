"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PartnershipFormat, ClubEvent } from "@/lib/types";

export default function PartnershipPage() {
  const [formats, setFormats] = useState<PartnershipFormat[]>([]);
  const [clubEvents, setClubEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFormat, setEditingFormat] = useState<Partial<PartnershipFormat> | null>(null);
  const [editingClubEvent, setEditingClubEvent] = useState<Partial<ClubEvent> | null>(null);
  const [saving, setSaving] = useState(false);
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    Promise.all([
      supabase.from("partnership_formats").select("*").order("sort_order"),
      supabase.from("club_events").select("*").order("sort_order"),
    ]).then(([fmts, evts]) => {
      setFormats((fmts.data as PartnershipFormat[]) || []);
      setClubEvents((evts.data as ClubEvent[]) || []);
      setLoading(false);
    });
  }, [rev]);

  async function saveFormat() {
    if (!editingFormat) return;
    setSaving(true);

    const payload = {
      ...editingFormat,
      points_ru:
        typeof editingFormat.points_ru === "string"
          ? JSON.parse(editingFormat.points_ru as unknown as string)
          : editingFormat.points_ru,
      points_en:
        typeof editingFormat.points_en === "string"
          ? JSON.parse(editingFormat.points_en as unknown as string)
          : editingFormat.points_en,
    };

    if (payload.id) {
      const { id, ...rest } = payload;
      await supabase.from("partnership_formats").update(rest).eq("id", id);
    } else {
      const { id: _unused, ...rest } = payload;
      void _unused;
      await supabase.from("partnership_formats").insert(rest);
    }
    setSaving(false);
    setEditingFormat(null);
    reload();
  }

  async function deleteFormat(id: number) {
    if (!confirm("Удалить формат?")) return;
    await supabase.from("partnership_formats").delete().eq("id", id);
    reload();
  }

  async function saveClubEvent() {
    if (!editingClubEvent) return;
    setSaving(true);
    if (editingClubEvent.id) {
      const { id, ...rest } = editingClubEvent as ClubEvent;
      await supabase.from("club_events").update(rest).eq("id", id);
    } else {
      await supabase.from("club_events").insert(editingClubEvent);
    }
    setSaving(false);
    setEditingClubEvent(null);
    reload();
  }

  async function deleteClubEvent(id: number) {
    if (!confirm("Удалить клубное событие?")) return;
    await supabase.from("club_events").delete().eq("id", id);
    reload();
  }

  function setFormatField(key: string, value: unknown) {
    setEditingFormat((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function setClubEventField(key: string, value: string | number) {
    setEditingClubEvent((prev) => (prev ? { ...prev, [key]: value } : prev));
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
      <h1 className="text-2xl font-bold mb-6">Партнёрство</h1>

      {/* Partnership Formats */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Форматы сотрудничества</h2>
          <button
            onClick={() =>
              setEditingFormat({
                num: String(formats.length + 1).padStart(2, "0"),
                title_ru: "",
                title_en: "",
                points_ru: [],
                points_en: [],
                suit_ru: "",
                suit_en: "",
                sort_order: formats.length + 1,
              })
            }
            className="px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            + Добавить
          </button>
        </div>

        <div className="space-y-3">
          {formats.map((fmt) => (
            <div key={fmt.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold font-bold">{fmt.num}</span>
                    <h3 className="font-semibold">{fmt.title_ru}</h3>
                  </div>
                  <p className="text-xs text-stone mb-2">{fmt.title_en}</p>
                  <ul className="text-sm text-stone space-y-0.5">
                    {(fmt.points_ru || []).map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                  {fmt.suit_ru && (
                    <p className="text-xs text-stone mt-2 italic">{fmt.suit_ru}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => setEditingFormat({ ...fmt })}
                    className="text-xs text-stone hover:text-gold transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteFormat(fmt.id)}
                    className="text-xs text-stone hover:text-danger transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Club Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Клубные мероприятия</h2>
          <button
            onClick={() =>
              setEditingClubEvent({
                name_ru: "",
                name_en: "",
                desc_ru: "",
                desc_en: "",
                detail_ru: "",
                detail_en: "",
                sort_order: clubEvents.length + 1,
              })
            }
            className="px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            + Добавить
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-stone text-left">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Описание</th>
                <th className="px-4 py-3 font-medium">Детали</th>
                <th className="px-4 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {clubEvents.map((ev) => (
                <tr key={ev.id} className="border-b border-border/50 hover:bg-panel/50">
                  <td className="px-4 py-3 text-stone">{ev.sort_order}</td>
                  <td className="px-4 py-3">{ev.name_ru}</td>
                  <td className="px-4 py-3 text-stone max-w-xs truncate">{ev.desc_ru}</td>
                  <td className="px-4 py-3 text-stone text-xs">{ev.detail_ru}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingClubEvent({ ...ev })}
                      className="text-stone hover:text-gold transition-colors"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => deleteClubEvent(ev.id)}
                      className="text-stone hover:text-danger transition-colors"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Format Modal */}
      {editingFormat && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">
              {editingFormat.id ? "Редактировать формат" : "Новый формат"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone mb-1">Номер</label>
                <input
                  type="text"
                  value={editingFormat.num || ""}
                  onChange={(e) => setFormatField("num", e.target.value)}
                  placeholder="01"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Порядок</label>
                <input
                  type="number"
                  value={editingFormat.sort_order ?? 0}
                  onChange={(e) => setFormatField("sort_order", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingFormat.title_ru || ""}
                  onChange={(e) => setFormatField("title_ru", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingFormat.title_en || ""}
                  onChange={(e) => setFormatField("title_en", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">
                  Пункты (RU) — каждый с новой строки
                </label>
                <textarea
                  value={
                    Array.isArray(editingFormat.points_ru)
                      ? editingFormat.points_ru.join("\n")
                      : ""
                  }
                  onChange={(e) =>
                    setFormatField(
                      "points_ru",
                      e.target.value.split("\n").filter((s) => s.trim())
                    )
                  }
                  rows={4}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">
                  Пункты (EN) — each on a new line
                </label>
                <textarea
                  value={
                    Array.isArray(editingFormat.points_en)
                      ? editingFormat.points_en.join("\n")
                      : ""
                  }
                  onChange={(e) =>
                    setFormatField(
                      "points_en",
                      e.target.value.split("\n").filter((s) => s.trim())
                    )
                  }
                  rows={4}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Подходит для (RU)</label>
                <input
                  type="text"
                  value={editingFormat.suit_ru || ""}
                  onChange={(e) => setFormatField("suit_ru", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone mb-1">Suitable for (EN)</label>
                <input
                  type="text"
                  value={editingFormat.suit_en || ""}
                  onChange={(e) => setFormatField("suit_en", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingFormat(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveFormat}
                disabled={saving}
                className="px-5 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Club Event Modal */}
      {editingClubEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">
              {editingClubEvent.id ? "Редактировать событие" : "Новое событие"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingClubEvent.name_ru || ""}
                  onChange={(e) => setClubEventField("name_ru", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingClubEvent.name_en || ""}
                  onChange={(e) => setClubEventField("name_en", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editingClubEvent.desc_ru || ""}
                  onChange={(e) => setClubEventField("desc_ru", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editingClubEvent.desc_en || ""}
                  onChange={(e) => setClubEventField("desc_en", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Детали (RU)</label>
                <input
                  type="text"
                  value={editingClubEvent.detail_ru || ""}
                  onChange={(e) => setClubEventField("detail_ru", e.target.value)}
                  placeholder="До 20 гостей · 3 часа"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Details (EN)</label>
                <input
                  type="text"
                  value={editingClubEvent.detail_en || ""}
                  onChange={(e) => setClubEventField("detail_en", e.target.value)}
                  placeholder="Up to 20 guests · 3 hours"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Порядок</label>
                <input
                  type="number"
                  value={editingClubEvent.sort_order ?? 0}
                  onChange={(e) => setClubEventField("sort_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingClubEvent(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveClubEvent}
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
