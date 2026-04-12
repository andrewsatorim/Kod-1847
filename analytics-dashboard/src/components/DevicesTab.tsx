"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDeviceStats, type DateRange } from "@/lib/queries";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#B89860", "#5B9A6E", "#6B8EC4", "#9A6BB8", "#C46B6B"];

const deviceNames: Record<string, string> = {
  desktop: "Десктоп",
  mobile: "Мобильные",
  tablet: "Планшеты",
  unknown: "Неизвестно",
};

const deviceDesc: Record<string, string> = {
  desktop: "Компьютеры и ноутбуки. Обычно более глубокий просмотр.",
  mobile: "Смартфоны. Основная аудитория. Критично для адаптивности сайта.",
  tablet: "Планшеты. Промежуточный формат.",
  unknown: "Устройство не определено.",
};

export default function DevicesTab({ range }: { range: DateRange }) {
  const [data, setData] = useState<{ devices: { name: string; value: number }[]; browsers: { name: string; count: number }[] }>({ devices: [], browsers: [] });

  useEffect(() => {
    getDeviceStats(range).then(setData);
  }, [range]);

  const pieData = data.devices.map(d => ({ ...d, label: deviceNames[d.name] || d.name }));
  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Устройства и браузеры</h2>
        <p className="text-stone text-sm mt-1">Техническая информация о посетителях. Помогает приоритизировать адаптацию сайта.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Devices pie */}
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Типы устройств</CardTitle>
            <CardDescription className="text-stone text-sm">
              Соотношение мобильных и десктопных посетителей. Если мобильных больше 60% — мобильная версия должна быть приоритетом.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" nameKey="label">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }}
                      formatter={(value: number) => [`${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`, "Визиты"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-6 mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-stone">{d.label}</span>
                      <span className="text-xs text-linen font-mono">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
            )}
          </CardContent>
        </Card>

        {/* Device cards with descriptions */}
        <div className="space-y-4">
          {pieData.map((d, i) => (
            <Card key={d.name} className="bg-ink-light border-stone-dim/20">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-linen font-medium">{d.label}</span>
                  <span className="ml-auto text-lg font-serif text-gold">{total > 0 ? Math.round((d.value / total) * 100) : 0}%</span>
                </div>
                <p className="text-xs text-stone-dim leading-relaxed ml-6">{deviceDesc[d.name] || ""}</p>
                <p className="text-xs text-stone-dim/60 ml-6 mt-1">{d.value} из {total} визитов</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Browsers table */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Браузеры</CardTitle>
          <CardDescription className="text-stone text-sm">
            Какие браузеры используют посетители. Если один браузер доминирует — тестируйте сайт в нём в первую очередь.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.browsers.length > 0 ? (
            <div className="space-y-0">
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 text-[10px] text-stone-dim font-sans font-medium tracking-wider uppercase pb-3 border-b border-stone-dim/20">
                <div>Браузер</div>
                <div className="text-right">Визиты</div>
                <div className="text-right">Доля</div>
              </div>
              {data.browsers.map(b => (
                <div key={b.name} className="grid grid-cols-[1fr_80px_80px] gap-4 py-3 text-sm border-b border-stone-dim/10">
                  <div className="text-linen">{b.name}</div>
                  <div className="text-right text-linen font-mono text-xs">{b.count}</div>
                  <div className="text-right text-gold text-xs">{total > 0 ? Math.round((b.count / total) * 100) : 0}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет данных</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
