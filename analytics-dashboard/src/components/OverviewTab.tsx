"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getOverviewStats, getPageviewsByDay, type DateRange, type OverviewStats } from "@/lib/queries";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}м ${s}с`;
}

export default function OverviewTab({ range }: { range: DateRange }) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([]);

  useEffect(() => {
    getOverviewStats(range).then(setStats);
    getPageviewsByDay(range).then(setChartData);
  }, [range]);

  const cards = stats ? [
    {
      title: "Посетители",
      value: stats.totalSessions.toLocaleString(),
      sub: `${stats.totalPageviews} просмотров страниц`,
      desc: "Уникальные сессии за период. Каждый визит на сайт считается отдельной сессией.",
    },
    {
      title: "Среднее время",
      value: formatDuration(stats.avgDuration),
      sub: "на сайте",
      desc: "Сколько в среднем посетитель проводит времени от первого до последнего действия на сайте.",
    },
    {
      title: "Bounce Rate",
      value: `${stats.bounceRate}%`,
      sub: "просмотр одной страницы",
      desc: "Процент визитов, при которых гость просмотрел только одну страницу и ушёл.",
    },
    {
      title: "Конверсия",
      value: `${stats.conversionRate}%`,
      sub: `${stats.totalBookings} заявок`,
      desc: "Отношение отправленных заявок на бронирование к общему числу визитов.",
    },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="font-serif text-2xl text-linen">Обзор</h2>
        <p className="text-stone text-sm mt-1">Ключевые показатели эффективности сайта за выбранный период</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats ? cards.map((c) => (
          <Card key={c.title} className="bg-ink-light border-stone-dim/20 hover:border-gold/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif text-linen">{c.value}</div>
              <p className="text-xs text-gold mt-1">{c.sub}</p>
              <p className="text-xs text-stone-dim mt-3 leading-relaxed">{c.desc}</p>
            </CardContent>
          </Card>
        )) : Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-ink-light border-stone-dim/20">
            <CardHeader className="pb-2"><div className="h-3 w-20 bg-ink-lighter animate-pulse rounded" /></CardHeader>
            <CardContent><div className="h-8 w-16 bg-ink-lighter animate-pulse rounded" /></CardContent>
          </Card>
        ))}
      </div>

      {/* Pageviews chart */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Динамика посещений</CardTitle>
          <CardDescription className="text-stone text-sm">
            Количество просмотров страниц по дням. Показывает активность аудитории и позволяет отслеживать тренды — рост, спад или стабильность трафика.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B89860" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B89860" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis dataKey="date" stroke="#6B6760" fontSize={11} fontFamily="Raleway" tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6B6760" fontSize={11} fontFamily="Raleway" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }}
                  labelStyle={{ color: "#F5F0E8" }}
                  itemStyle={{ color: "#B89860" }}
                />
                <Area type="monotone" dataKey="views" stroke="#B89860" strokeWidth={2} fill="url(#goldGradient)" name="Просмотры" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-stone-dim font-sans text-sm">
              Нет данных за выбранный период
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
