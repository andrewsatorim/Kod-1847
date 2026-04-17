"use client";

import { useEffect, useState } from "react";
import type { MenuCategory, MenuItem } from "@/lib/types";

const tabs = [
  { key: "tea", label: "Чайное меню" },
  { key: "hookah", label: "Кальянное меню" },
  { key: "food", label: "Кухня" },
] as const;

const emptyCategory: Omit<MenuCategory, "id" | "menu_items"> = {
  tab: "tea",
  title_ru: "",
  title_en: "",
  desc_ru: "",
  desc_en: "",
  sort_order: 0,
};

const emptyItem: Omit<MenuItem, "id"> = {
  category_id: 0,
  name_ru: "",
  name_en: "",
  desc_ru: "",
  desc_en: "",
  is_flagship: false,
  sort_order: 0,
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("tea");
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<MenuCategory> | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    let active = true;
    fetch(`/api/menu-categories?tab=${activeTab}`)
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((data) => { if (active) setCategories(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setCategories([]); });
    return () => { active = false; };
  }, [activeTab, rev]);

  const loading = categories === null;

  async function saveCat() {
    if (!editingCat) return;
    setSaving(true);
    if (editingCat.id) {
      const { id, menu_items: _mi, ...rest } = editingCat as MenuCategory;
      void _mi;
      await fetch(`/api/menu-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    } else {
      await fetch("/api/menu-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingCat, tab: activeTab }),
      });
    }
    setSaving(false);
    setEditingCat(null);
    reload();
  }

  async function deleteCat(id: number) {
    if (!confirm("Удалить категорию и все позиции в ней?")) return;
    await fetch(`/api/menu-categories/${id}`, { method: "DELETE" });
    reload();
  }

  async function saveItem() {
    if (!editingItem) return;
    setSaving(true);
    if (editingItem.id) {
      const { id, ...rest } = editingItem as MenuItem;
      await fetch(`/api/menu-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    } else {
      await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    }
    setSaving(false);
    setEditingItem(null);
    reload();
  }

  async function deleteItem(id: number) {
    if (!confirm("Удалить позицию?")) return;
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
    reload();
  }

  function setCatField(key: string, value: string | number) {
    setEditingCat((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function setItemField(key: string, value: string | number | boolean) {
    setEditingItem((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Меню</h1>

      {/* Tabs */}
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
            ...emptyCategory,
            tab: activeTab as "tea" | "hookah" | "food",
            sort_order: (categories || []).length + 1,
          })
        }
        className="mb-4 px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
      >
        + Категория
      </button>

      {loading ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : (categories || []).length === 0 ? (
        <p className="text-stone">Нет категорий</p>
      ) : (
        <div className="space-y-4">
          {(categories || []).map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="font-semibold">{cat.title_ru}</h3>
                  <p className="text-xs text-stone mt-0.5">{cat.title_en}</p>
                  {cat.desc_ru && (
                    <p className="text-xs text-stone mt-1 max-w-xl">{cat.desc_ru}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-xs text-stone">#{cat.sort_order}</span>
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

              {/* Items */}
              <div className="divide-y divide-border/50">
                {(cat.menu_items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-panel/30">
                    <div className="flex items-center gap-3">
                      {item.is_flagship && (
                        <span className="w-2 h-2 bg-gold rounded-full shrink-0" title="Флагман" />
                      )}
                      <div>
                        <p className="text-sm">{item.name_ru}</p>
                        <p className="text-xs text-stone">{item.name_en}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-xs text-stone">#{item.sort_order}</span>
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="text-xs text-stone hover:text-gold transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-xs text-stone hover:text-danger transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div className="px-5 py-3 border-t border-border/50">
                <button
                  onClick={() =>
                    setEditingItem({
                      ...emptyItem,
                      category_id: cat.id,
                      sort_order: (cat.menu_items?.length || 0) + 1,
                    })
                  }
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                >
                  + Добавить позицию
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
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
                  value={editingCat.title_ru || ""}
                  onChange={(e) => setCatField("title_ru", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingCat.title_en || ""}
                  onChange={(e) => setCatField("title_en", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editingCat.desc_ru || ""}
                  onChange={(e) => setCatField("desc_ru", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editingCat.desc_en || ""}
                  onChange={(e) => setCatField("desc_en", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Порядок</label>
                <input
                  type="number"
                  value={editingCat.sort_order ?? 0}
                  onChange={(e) => setCatField("sort_order", parseInt(e.target.value) || 0)}
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

      {/* Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">
              {editingItem.id ? "Редактировать позицию" : "Новая позиция"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone mb-1">Название (RU)</label>
                <input
                  type="text"
                  value={editingItem.name_ru || ""}
                  onChange={(e) => setItemField("name_ru", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Название (EN)</label>
                <input
                  type="text"
                  value={editingItem.name_en || ""}
                  onChange={(e) => setItemField("name_en", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (RU)</label>
                <textarea
                  value={editingItem.desc_ru || ""}
                  onChange={(e) => setItemField("desc_ru", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-stone mb-1">Описание (EN)</label>
                <textarea
                  value={editingItem.desc_en || ""}
                  onChange={(e) => setItemField("desc_en", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone mb-1">Порядок</label>
                  <input
                    type="number"
                    value={editingItem.sort_order ?? 0}
                    onChange={(e) => setItemField("sort_order", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_flagship ?? false}
                      onChange={(e) => setItemField("is_flagship", e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm">Флагман</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-sm text-stone hover:text-linen transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveItem}
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
