"use client";

import { useEffect, useState } from "react";

interface Address {
  id: number;
  city_ru: string;
  city_en: string;
  street_ru: string;
  street_en: string;
  hours_ru: string;
  hours_en: string;
  latitude: number | null;
  longitude: number | null;
}

export default function MiniAppSettingsPage() {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadAddress();
  }, []);

  async function loadAddress() {
    try {
      const res = await fetch(`/api/cms/miniapp/address`);
      const data = await res.json();
      setAddress(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini App - Настройки</h1>

      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Адрес клуба (только для чтения)</h2>

          {address ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone mb-2">Город (RU)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.city_ru}</p>
                </div>
                <div>
                  <label className="block text-xs text-stone mb-2">Город (EN)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.city_en}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone mb-2">Улица (RU)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.street_ru || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs text-stone mb-2">Улица (EN)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.street_en || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone mb-2">Часы (RU)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.hours_ru || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs text-stone mb-2">Часы (EN)</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.hours_en || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone mb-2">Широта</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.latitude || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs text-stone mb-2">Долгота</label>
                  <p className="text-sm bg-panel border border-border rounded-lg p-3">{address.longitude || "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          )}
        </div>

        <div className="bg-panel border border-border rounded-xl p-6">
          <p className="text-sm text-stone">
            Для редактирования адреса и координат клуба свяжитесь с администратором.
          </p>
        </div>
      </div>
    </div>
  );
}
