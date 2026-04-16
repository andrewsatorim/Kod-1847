"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTopPages, type DateRange, type PageStat } from "@/lib/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDuration(seconds: number): string {
  if (seconds === 0) return "—";
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}м ${s}с`;
}

const pageNames: Record<string, string> = {
  "/": "Главная",
  "/tea-room": "Чайный зал",
  "/hookah-room": "Кальянная комната",
  "/menu": "Меню",
  "/events": "Мероприятия",
  "/partnership": "Партнёрство",
  "/club": "Членство",
};

export default function PagesTab({ range }: { range: DateRange }) {
  const [pages, setPages] = useState<PageStat[]>([]);

  useEffect(() => {
    getTopPages(range).then(setPages);
  }, [range]);

  const total = pages.reduce((sum, p) => sum + p.views, 0);
  const chartData = pages.slice(0, 7).map(p => ({ name: pageNames[p.page] || p.page, views: p.views }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Страницы</h2>
        <p className="text-stone text-sm mt-1">Какие разделы сайта привлекают наибольшее внимание посетителей</p>
      </div>

      {/* Bar chart */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Популярность страниц</CardTitle>
          <CardDescription className="text-stone text-sm">
            Распределение просмотров по разделам сайта. Помогает понять, какой контент наиболее востребован у гостей.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis type="number" stroke="#6B6760" fontSize={11} fontFamily="Raleway" />
                <YAxis type="category" dataKey="name" stroke="#9A958B" fontSize={12} fontFamily="Raleway" width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }} />
                <Bar dataKey="views" fill="#B89860" radius={[0, 4, 4, 0]} name="Просмотры" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Детализация по страницам</CardTitle>
          <CardDescription className="text-stone text-sm">
            Среднее время на странице показывает глубину вовлечённости. Высокое время — гость читает контент. Низкое — уходит быстро.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pages.length > 0 ? (
            <div className="space-y-0">
              <div className="grid grid-cols-[1fr_80px_100px_80px] gap-4 text-[10px] text-stone-dim font-sans font-medium tracking-wider uppercase pb-3 border-b border-stone-dim/20">
                <div>Страница</div>
                <div className="text-right">Просмотры</div>
                <div className="text-right">Ср. время</div>
                <div className="text-right">Доля</div>
              </div>
              {pages.map((p) => (
                <div key={p.page} className="grid grid-cols-[1fr_80px_100px_80px] gap-4 py-3 text-sm border-b border-stone-dim/10 hover:bg-ink-lighter/50 transition-colors">
                  <div>
                    <span className="text-linen">{pageNames[p.page] || p.page}</span>
                    <span className="text-stone-dim ml-2 text-xs">{p.page}</span>
                  </div>
                  <div className="text-right text-linen font-mono text-xs">{p.views}</div>
                  <div className="text-right text-stone">{formatDuration(p.avgTime)}</div>
                  <div className="text-right text-gold text-xs">{total > 0 ? Math.round((p.views / total) * 100) : 0}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет данных за выбранный период</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
