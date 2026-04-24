"use client";

import { useEffect, useState } from "react";

interface I18nEntry {
  id: number;
  key: string;
  lang: "ru" | "en";
  value: string;
  section?: string;
}

export default function MiniAppTextsPage() {
  const [entries, setEntries] = useState<I18nEntry[] | null>(null);
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [editingEntry, setEditingEntry] = useState<Partial<I18nEntry> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [lang]);

  async function loadEntries() {
    setEntries(null);
    try {
      const res = await fetch(`/api/cms/miniapp/i18n?lang=${lang}`);
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
      setEntries([]);
    }
  }

  async function saveEntry() {
    if (!editingEntry?.key) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/miniapp/i18n`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEntry),
      });
      setEditingEntry(null);
      await loadEntries();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini App - Тексты и переводы</h1>

      <div className="flex gap-2 mb-6">
        {(["ru", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              lang === l
                ? "bg-gold text-ink font-medium"
                : "text-stone hover:text-linen bg-panel border border-border"
            }`}
          >
            {l === "ru" ? "Русский" : "English"}
          </button>
        ))}
      </div>

      {entries === null ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : entries.length === 0 ? (
        <p className="text-stone">Нет текстов</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.key}</p>
                <p className="text-sm text-stone mt-1">{entry.value || "—"}</p>
              </div>
              <button
                onClick={() => setEditingEntry({ ...entry })}
                className="text-xs text-stone hover:text-gold transition-colors ml-4 shrink-0"
              >
                Редактировать
              </button>
            </div>
          ))}
        </div>
      )}

      {editingEntry && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">Редактировать текст</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone mb-1">Ключ</label>
                <input
                  type="text"
                  value={editingEntry.key || ""}
                  disabled
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Значение</label>
                <textarea
                  value={editingEntry.value || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, value: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingEntry(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveEntry}
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
