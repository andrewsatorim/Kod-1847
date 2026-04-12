"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getClickStats, type DateRange } from "@/lib/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const labelMap: Record<string, string> = {
  "click_reserve": "Забронировать",
  "click_pdf": "PDF меню",
  "click_phone": "Телефон",
  "click_telegram": "Telegram",
  "click_instagram": "Instagram",
};

const descMap: Record<string, string> = {
  "click_reserve": "Клик по кнопке бронирования — главный конверсионный элемент сайта",
  "click_pdf": "Скачивание PDF-меню — интерес к ассортименту клуба",
  "click_phone": "Клик по номеру телефона — намерение позвонить",
  "click_telegram": "Переход в Telegram — предпочитают мессенджер",
  "click_instagram": "Переход в Instagram — интерес к визуальному контенту",
};

function prettifyLabel(raw: string): string {
  for (const [key, label] of Object.entries(labelMap)) {
    if (raw.startsWith(key)) {
      const extra = raw.replace(key, "").replace(/^\s*\(/, " (");
      return label + extra;
    }
  }
  if (raw.startsWith("PDF: ")) {
    return `PDF: ${raw.slice(5) === "tea" ? "Чайная карта" : "Кальянная карта"}`;
  }
  return raw;
}

function getDesc(raw: string): string {
  for (const [key, desc] of Object.entries(descMap)) {
    if (raw.startsWith(key)) return desc;
  }
  if (raw.startsWith("PDF:")) return descMap["click_pdf"];
  return "";
}

export default function ClicksTab({ range }: { range: DateRange }) {
  const [clicks, setClicks] = useState<{ button: string; count: number }[]>([]);

  useEffect(() => {
    getClickStats(range).then(setClicks);
  }, [range]);

  const total = clicks.reduce((sum, c) => sum + c.count, 0);
  const chartData = clicks.map(c => ({ name: prettifyLabel(c.button), count: c.count }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Клики по элементам</h2>
        <p className="text-stone text-sm mt-1">Какие кнопки и ссылки нажимают посетители. Показывает намерения аудитории.</p>
      </div>

      {/* Chart */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Распределение кликов</CardTitle>
          <CardDescription className="text-stone text-sm">
            Горизонтальная диаграмма отражает популярность каждого интерактивного элемента. Кнопка «Забронировать» — ключевой индикатор конверсии.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(250, chartData.length * 50)}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 140 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis type="number" stroke="#6B6760" fontSize={11} fontFamily="Raleway" allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#9A958B" fontSize={12} fontFamily="Raleway" width={130} />
                <Tooltip contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }} />
                <Bar dataKey="count" fill="#B89860" radius={[0, 4, 4, 0]} name="Клики" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>

      {/* Cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clicks.map(c => (
          <Card key={c.button} className="bg-ink-light border-stone-dim/20 hover:border-gold/30 transition-colors">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-linen">{prettifyLabel(c.button)}</span>
                <span className="text-lg font-serif text-gold">{c.count}</span>
              </div>
              <div className="w-full bg-ink-lighter rounded-full h-1.5 mb-3">
                <div className="bg-gold/60 h-1.5 rounded-full" style={{ width: `${total > 0 ? (c.count / total) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-stone-dim leading-relaxed">{getDesc(c.button)}</p>
              <p className="text-[10px] text-stone-dim/60 mt-1">{total > 0 ? Math.round((c.count / total) * 100) : 0}% от всех кликов</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
