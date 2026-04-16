"use client";

import { useEffect, useState } from "react";
import type { TextBlock } from "@/lib/types";

const keyLabels: Record<string, string> = {
  philosophy: "Философия",
  hero_subtitle: "Подзаголовок главной",
  tea_room_title: "Чайная комната — заголовок",
  tea_room_desc: "Чайная комната — описание",
  hookah_room_title: "Кальянная комната — заголовок",
  hookah_room_desc: "Кальянная комната — описание",
  menu_subtitle: "Меню — подзаголовок",
  events_subtitle: "Мероприятия — подзаголовок",
  partnership_subtitle: "Партнёрство — подзаголовок",
  club_subtitle: "Клуб — подзаголовок",
  contact_subtitle: "Контакты — подзаголовок",
};

export default function TextsPage() {
  const [texts, setTexts] = useState<TextBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ value_ru: string; value_en: string }>({
    value_ru: "",
    value_en: "",
  });
  const [saving, setSaving] = useState(false);
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    fetch("/api/texts")
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((data) => { setTexts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [rev]);

  function startEdit(text: TextBlock) {
    setEditingId(text.id);
    setEditData({ value_ru: text.value_ru, value_en: text.value_en });
  }

  async function handleSave(id: number) {
    setSaving(true);
    await fetch(`/api/texts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value_ru: editData.value_ru, value_en: editData.value_en }),
    });
    setSaving(false);
    setEditingId(null);
    reload();
  }

  async function handleAdd() {
    const key = prompt("Ключ текстового блока (например: footer_note):");
    if (!key) return;
    await fetch("/api/texts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value_ru: "", value_en: "" }),
    });
    reload();
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить текстовый блок?")) return;
    await fetch(`/api/texts/${id}`, { method: "DELETE" });
    reload();
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
        <h1 className="text-2xl font-bold">Тексты</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {texts.map((text) => {
          const isEditing = editingId === text.id;

          return (
            <div
              key={text.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    {keyLabels[text.key] || text.key}
                  </h3>
                  <span className="text-xs text-stone font-mono">{text.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(text.id)}
                        disabled={saving}
                        className="px-3 py-1.5 bg-gold text-ink font-medium rounded-lg text-xs hover:bg-gold-light transition-colors disabled:opacity-50"
                      >
                        {saving ? "..." : "Сохранить"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-stone hover:text-linen transition-colors"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(text)}
                        className="text-xs text-stone hover:text-gold transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(text.id)}
                        className="text-xs text-stone hover:text-danger transition-colors"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone mb-1">Текст (RU)</label>
                    <textarea
                      value={editData.value_ru}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, value_ru: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone mb-1">Text (EN)</label>
                    <textarea
                      value={editData.value_en}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, value_en: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-stone mb-0.5">RU</p>
                    <p className="text-sm whitespace-pre-wrap">
                      {text.value_ru || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-0.5">EN</p>
                    <p className="text-sm whitespace-pre-wrap">
                      {text.value_en || "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
