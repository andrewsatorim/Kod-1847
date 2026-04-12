"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopPages, type DateRange } from "@/lib/queries";

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
  "/hookah-room": "Кальянная комн��та",
  "/menu": "Меню",
  "/events": "Мероприятия",
  "/partnership": "Партнёрство",
  "/club": "Членство",
};

export default function PagesTab({ range }: { range: DateRange }) {
  const [pages, setPages] = useState<Awaited<ReturnType<typeof getTopPages>>>([]);

  useEffect(() => {
    getTopPages(range).then(setPages);
  }, [range]);

  const total = pages.reduce((sum, p) => sum + p.views, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ страниц по просмотрам</CardTitle>
      </CardHeader>
      <CardContent>
        {pages.length > 0 ? (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_100px_80px] gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
              <div>Страница</div>
              <div className="text-right">Просмотры</div>
              <div className="text-right">Ср. время</div>
              <div className="text-right">Доля</div>
            </div>
            {pages.map((p) => (
              <div key={p.page} className="grid grid-cols-[1fr_80px_100px_80px] gap-4 py-2 text-sm border-b border-border/50">
                <div>
                  <span className="font-medium">{pageNames[p.page] || p.page}</span>
                  <span className="text-muted-foreground ml-2 text-xs">{p.page}</span>
                </div>
                <div className="text-right font-mono">{p.views}</div>
                <div className="text-right text-muted-foreground">{formatDuration(p.avgTime)}</div>
                <div className="text-right text-muted-foreground">
                  {total > 0 ? Math.round((p.views / total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Нет данных за выбранный период</div>
        )}
      </CardContent>
    </Card>
  );
}
