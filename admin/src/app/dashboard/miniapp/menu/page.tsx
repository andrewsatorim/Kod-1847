"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;
  name_ru: string;
  name_en: string;
  sort_order: number;
}

interface MenuItem {
  id: number;
  category_id: number;
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
  sort_order: number;
}

const tabs = [
  { key: "tea", label: "Чайные залы" },
  { key: "hookah", label: "Кальянные залы" },
] as const;

export default function MiniAppMenuPage() {
  const [activeTab, setActiveTab] = useState<"tea" | "hookah">("tea");
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  async function loadCategories() {
    setCategories(null);
    try {
      const res = await fetch(`/api/cms/miniapp/menu?slug=${activeTab}`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  }

  async function saveCat() {
    if (!editingCat?.name_ru) return;
    setSaving(true);
    try {
      if (editingCat.id) {
        await fetch(`/api/cms/miniapp/menu/categories/${editingCat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCat),
        });
      } else {
        await fetch(`/api/cms/miniapp/menu/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingCat, slug: activeTab }),
        });
      }
      setEditingCat(null);
      await loadCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCat(id: number) {
    if (!confirm("Удалить категорию и все позиции в ней?")) return;
    try {
      await fetch(`/api/cms/miniapp/menu/categories/${id}`, {
        method: "DELETE",
      });
      await loadCategories();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini App - Меню</h1>

      <div className="flex gap-1 bg-panel border border-border rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-gold text-ink font-medium"
                : "text-stone hover:text-linen"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          setEditingCat({
            name_ru: "",
            name_en: "",
            sort_order: (categories || []).length + 1,
          })
        }
        className="mb-4 px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
      >
        + Категория
      </button>

      {categories === null ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : categories.length === 0 ? (
        <p className="text-stone">Нет категорий</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cat.name_ru}</h3>
                  <p className="text-xs text-stone mt-0.5">{cat.name_en}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCat({ ...cat })}
                    className="text-xs text-stone hover:text-gold transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteCat(cat.id)}
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

      {editingCat && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">
              {editingCat.id ? "Редактировать категорию" : "Новая категория"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingCat.name_ru || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, name_ru: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingCat.name_en || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, name_en: e.target.value })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Порядок</label>
                <input
                  type="number"
                  value={editingCat.sort_order ?? 0}
                  onChange={(e) => setEditingCat({ ...editingCat, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingCat(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveCat}
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
