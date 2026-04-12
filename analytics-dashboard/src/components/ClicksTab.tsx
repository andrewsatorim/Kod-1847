"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClickStats, type DateRange } from "@/lib/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const labelMap: Record<string, string> = {
  "click_reserve": "Забронировать",
  "click_pdf": "PDF меню",
  "click_phone": "Телефон",
  "click_telegram": "Telegram",
  "click_instagram": "Instagram",
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

export default function ClicksTab({ range }: { range: DateRange }) {
  const [clicks, setClicks] = useState<{ button: string; count: number }[]>([]);

  useEffect(() => {
    getClickStats(range).then(setClicks);
  }, [range]);

  const total = clicks.reduce((sum, c) => sum + c.count, 0);
  const chartData = clicks.map(c => ({ name: prettifyLabel(c.button), count: c.count }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Клики по кнопкам</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 45)}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 140 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 17%)" />
                <XAxis type="number" stroke="hsl(215 16% 57%)" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(215 16% 57%)" fontSize={12} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(224 71% 4%)", border: "1px solid hsl(216 34% 17%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(213 31% 91%)" }}
                />
                <Bar dataKey="count" fill="hsl(30 80% 55%)" radius={[0, 4, 4, 0]} name="Клики" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Нет данных</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Детализация</CardTitle></CardHeader>
        <CardContent>
          {clicks.length > 0 ? (
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                <div>Кнопка</div>
                <div className="text-right">Клики</div>
                <div className="text-right">Доля</div>
              </div>
              {clicks.map(c => (
                <div key={c.button} className="grid grid-cols-[1fr_80px_80px] gap-4 py-2 text-sm border-b border-border/50">
                  <div className="font-medium">{prettifyLabel(c.button)}</div>
                  <div className="text-right font-mono">{c.count}</div>
                  <div className="text-right text-muted-foreground">{total > 0 ? Math.round((c.count / total) * 100) : 0}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">Нет данных</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
