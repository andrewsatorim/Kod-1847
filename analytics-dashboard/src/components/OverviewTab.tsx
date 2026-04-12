"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverviewStats, getPageviewsByDay, type DateRange } from "@/lib/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Clock, MousePointerClick, TrendingUp } from "lucide-react";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}м ${s}с`;
}

export default function OverviewTab({ range }: { range: DateRange }) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getOverviewStats>> | null>(null);
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([]);

  useEffect(() => {
    getOverviewStats(range).then(setStats);
    getPageviewsByDay(range).then(setChartData);
  }, [range]);

  const cards = stats
    ? [
        { title: "Посетители", value: stats.totalSessions.toLocaleString(), icon: Users, sub: `${stats.totalPageviews} просмотров` },
        { title: "Среднее время", value: formatDuration(stats.avgDuration), icon: Clock, sub: "на сайте" },
        { title: "Bounce Rate", value: `${stats.bounceRate}%`, icon: MousePointerClick, sub: "одна страница" },
        { title: "Конверсия", value: `${stats.conversionRate}%`, icon: TrendingUp, sub: `${stats.totalBookings} заявок` },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats ? cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </CardContent>
          </Card>
        )) : Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></CardHeader>
            <CardContent><div className="h-8 w-16 bg-muted animate-pulse rounded" /></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Посещения по дням</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 17%)" />
                <XAxis dataKey="date" stroke="hsl(215 16% 57%)" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="hsl(215 16% 57%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(224 71% 4%)", border: "1px solid hsl(216 34% 17%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(213 31% 91%)" }}
                />
                <Bar dataKey="views" fill="hsl(220 70% 50%)" radius={[4, 4, 0, 0]} name="Просмотры" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Нет данных за выбранный период
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
