"use client";

import { useState, useEffect } from "react";

type NavSection = {
  id: number;
  key: string;
  href: string;
  title_ru: string;
  title_en: string;
  nav_order: number;
  is_visible: boolean;
};

export default function NavigationPage() {
  const [sections, setSections] = useState<NavSection[]>([]);
  const [editing, setEditing] = useState<Record<number, Partial<NavSection>>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [translating, setTranslating] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/nav-sections")
      .then((r) => r.json())
      .then(setSections);
  }, []);

  function getVal<K extends keyof NavSection>(id: number, field: K, fallback: NavSection[K]): NavSection[K] {
    return (editing[id]?.[field] as NavSection[K]) ?? fallback;
  }

  function change(id: number, field: keyof NavSection, value: string | boolean | number) {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setSaved((prev) => ({ ...prev, [id]: false }));
  }

  async function autoTranslate(id: number, ru: string) {
    if (!ru.trim()) return;
    setTranslating((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ru }),
      });
      const data = await res.json();
      if (data.result) change(id, "title_en", data.result);
    } finally {
      setTranslating((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function save(section: NavSection) {
    setSaving((prev) => ({ ...prev, [section.id]: true }));
    const patch = { ...section, ...editing[section.id] };
    try {
      const res = await fetch(`/api/nav-sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditing((prev) => { const n = { ...prev }; delete n[section.id]; return n; });
        setSaved((prev) => ({ ...prev, [section.id]: true }));
        setTimeout(() => setSaved((prev) => ({ ...prev, [section.id]: false })), 2000);
      }
    } finally {
      setSaving((prev) => ({ ...prev, [section.id]: false }));
    }
  }

  const isDirty = (id: number) => editing[id] && Object.keys(editing[id]).length > 0;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-bold text-gold mb-1">Навигация сайта</h1>
      <p className="text-sm text-stone mb-6">Редактируйте названия разделов. После сохранения нажмите «Опубликовать» в боковом меню.</p>

      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.id} className={`bg-card border rounded-lg p-4 transition-colors ${isDirty(s.id) ? "border-gold/50" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-stone font-mono bg-panel px-2 py-0.5 rounded">{s.key}</span>
              <span className="text-xs text-stone">{s.href}</span>
              <div className="ml-auto flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-stone cursor-pointer">
                  <input
                    type="checkbox"
                    checked={getVal(s.id, "is_visible", s.is_visible) as boolean}
                    onChange={(e) => change(s.id, "is_visible", e.target.checked)}
                    className="accent-gold"
                  />
                  Показывать
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone mb-1">Русский</label>
                <input
                  className="w-full bg-panel border border-border rounded px-3 py-2 text-sm text-linen focus:border-gold outline-none"
                  value={getVal(s.id, "title_ru", s.title_ru) as string}
                  onChange={(e) => change(s.id, "title_ru", e.target.value)}
                  onBlur={(e) => autoTranslate(s.id, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1 flex items-center gap-1">
                  English
                  {translating[s.id] && <span className="text-gold animate-pulse">…</span>}
                </label>
                <input
                  className="w-full bg-panel border border-border rounded px-3 py-2 text-sm text-linen focus:border-gold outline-none"
                  value={getVal(s.id, "title_en", s.title_en) as string}
                  onChange={(e) => change(s.id, "title_en", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => save(s)}
                disabled={saving[s.id] || !isDirty(s.id)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  saved[s.id]
                    ? "bg-emerald-700 text-white"
                    : isDirty(s.id)
                    ? "bg-gold text-panel hover:bg-gold/80"
                    : "bg-panel text-stone cursor-not-allowed border border-border"
                }`}
              >
                {saving[s.id] ? "Сохранение..." : saved[s.id] ? "Сохранено ✓" : "Сохранить"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
