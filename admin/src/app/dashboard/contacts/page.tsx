"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";

const keyLabels: Record<string, string> = {
  address: "Адрес",
  hours: "Часы работы",
  phone: "Телефон",
  telegram: "Telegram",
  instagram: "Instagram",
  partnership_phone: "Телефон для партнёрства",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [rev, setRev] = useState(0);
  const reload = () => setRev((r) => r + 1);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => {
        setContacts(data || []);
        setLoading(false);
      });
  }, [rev]);

  async function handleSave(contact: Contact) {
    setSaving(contact.id);
    await fetch(`/api/contacts/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value_ru: contact.value_ru, value_en: contact.value_en }),
    });
    setSaving(null);
    setEditing(null);
    reload();
  }

  async function handleAdd() {
    const key = prompt("Ключ контакта (например: email, whatsapp):");
    if (!key) return;
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value_ru: "", value_en: "" }),
    });
    reload();
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить контакт?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
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
        <h1 className="text-2xl font-bold">Контакты</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => {
          const isEditing = editing?.id === contact.id;
          const current = isEditing ? editing : contact;

          return (
            <div
              key={contact.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    {keyLabels[contact.key] || contact.key}
                  </h3>
                  <span className="text-xs text-stone font-mono">{contact.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(current)}
                        disabled={saving === contact.id}
                        className="px-3 py-1.5 bg-gold text-ink font-medium rounded-lg text-xs hover:bg-gold-light transition-colors disabled:opacity-50"
                      >
                        {saving === contact.id ? "..." : "Сохранить"}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="text-xs text-stone hover:text-linen transition-colors"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditing({ ...contact })}
                        className="text-xs text-stone hover:text-gold transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="text-xs text-stone hover:text-danger transition-colors"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone mb-1">Значение (RU)</label>
                    <input
                      type="text"
                      value={current.value_ru}
                      onChange={(e) =>
                        setEditing({ ...current, value_ru: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone mb-1">Value (EN)</label>
                    <input
                      type="text"
                      value={current.value_en}
                      onChange={(e) =>
                        setEditing({ ...current, value_en: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-stone mb-0.5">RU</p>
                    <p className="text-sm">{contact.value_ru || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-0.5">EN</p>
                    <p className="text-sm">{contact.value_en || "—"}</p>
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
