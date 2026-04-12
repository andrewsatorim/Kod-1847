"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingsByDay, getBookingSources, getOverviewStats, type DateRange } from "@/lib/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function BookingsTab({ range }: { range: DateRange }) {
  const [bookings, setBookings] = useState<{ date: string; bookings: number }[]>([]);
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);
  const [stats, setStats] = useState<{ totalBookings: number; conversionRate: string } | null>(null);

  useEffect(() => {
    getBookingsByDay(range).then(setBookings);
    getBookingSources(range).then(setSources);
    getOverviewStats(range).then(s => setStats({ totalBookings: s.totalBookings, conversionRate: s.conversionRate }));
  }, [range]);

  const sourceNames: Record<string, string> = {
    "/": "Главная",
    "/tea-room": "Чайный зал",
    "/hookah-room": "Кальянная комната",
    "/partnership": "Партнёрство",
    events: "Мероприятия",
    club_membership: "Членство",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Всего заявок</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalBookings ?? "..."}</div>
            <p className="text-xs text-muted-foreground mt-1">за выбранный период</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Конверсия</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.conversionRate ?? "..."}%</div>
            <p className="text-xs text-muted-foreground mt-1">визиты → заявки</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Заявки по дням</CardTitle></CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 17%)" />
                <XAxis dataKey="date" stroke="hsl(215 16% 57%)" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="hsl(215 16% 57%)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(224 71% 4%)", border: "1px solid hsl(216 34% 17%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(213 31% 91%)" }}
                />
                <Bar dataKey="bookings" fill="hsl(160 60% 45%)" radius={[4, 4, 0, 0]} name="Заявки" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Нет данных</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Источники заявок</CardTitle></CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {sources.map(s => (
                <div key={s.source} className="flex items-center gap-2 rounded-lg border px-3 py-2">
                  <Badge variant="secondary">{s.count}</Badge>
                  <span className="text-sm">{sourceNames[s.source] || s.source}</span>
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
