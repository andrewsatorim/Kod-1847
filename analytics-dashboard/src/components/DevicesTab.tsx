"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeviceStats, type DateRange } from "@/lib/queries";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["hsl(220, 70%, 50%)", "hsl(160, 60%, 45%)", "hsl(30, 80%, 55%)", "hsl(280, 65%, 60%)", "hsl(340, 75%, 55%)"];

const deviceNames: Record<string, string> = {
  desktop: "Десктоп",
  mobile: "Мобильные",
  tablet: "Планшеты",
  unknown: "Неизвестно",
};

export default function DevicesTab({ range }: { range: DateRange }) {
  const [data, setData] = useState<{ devices: { name: string; value: number }[]; browsers: { name: string; count: number }[] }>({ devices: [], browsers: [] });

  useEffect(() => {
    getDeviceStats(range).then(setData);
  }, [range]);

  const pieData = data.devices.map(d => ({ ...d, name: deviceNames[d.name] || d.name }));
  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Устройства</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(224 71% 4%)", border: "1px solid hsl(216 34% 17%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(213 31% 91%)" }}
                    formatter={(value: number) => [`${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`, "Визитов"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Нет данных</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Браузеры</CardTitle></CardHeader>
          <CardContent>
            {data.browsers.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_60px_60px] gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                  <div>Браузер</div>
                  <div className="text-right">Визиты</div>
                  <div className="text-right">Доля</div>
                </div>
                {data.browsers.map(b => (
                  <div key={b.name} className="grid grid-cols-[1fr_60px_60px] gap-4 py-2.5 text-sm border-b border-border/50">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-right font-mono">{b.count}</div>
                    <div className="text-right text-muted-foreground">{total > 0 ? Math.round((b.count / total) * 100) : 0}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">Нет данных</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
