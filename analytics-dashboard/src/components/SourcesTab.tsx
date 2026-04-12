"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getReferrerStats, type DateRange } from "@/lib/queries";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#B89860", "#5B9A6E", "#6B8EC4", "#9A6BB8", "#C46B6B", "#6BC4A8", "#C4A86B"];

const sourceDesc: Record<string, string> = {
  "Прямой заход": "Посетитель ввёл адрес напрямую в браузере или перешёл из закладок. Показатель узнаваемости бренда.",
  "Google": "Переход из поисковой выдачи Google. Показатель SEO-эффективности.",
  "Яндекс": "Переход из поисковой выдачи Яндекса. Основной русскоязычный поисковик.",
  "Telegram": "Переход из Telegram — канал, чат или личное сообщение со ссылкой.",
  "Instagram": "Переход из Instagram — сторис, посты или профиль.",
  "VKontakte": "Переход из VKontakte.",
  "Facebook": "Переход из Facebook.",
};

export default function SourcesTab({ range }: { range: DateRange }) {
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);

  useEffect(() => {
    getReferrerStats(range).then(setSources);
  }, [range]);

  const total = sources.reduce((sum, s) => sum + s.count, 0);
  const pieData = sources.map(s => ({ name: s.source, value: s.count }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">Источники трафика</h2>
        <p className="text-stone text-sm mt-1">Откуда посетители узнают о сайте. Помогает оценить эффективность каналов продвижения.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie chart */}
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Структура трафика</CardTitle>
            <CardDescription className="text-stone text-sm">
              Визуальное распределение по источникам. Здоровый сайт имеет разнообразные каналы, а не зависимость от одного.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }}
                      formatter={(value: number) => [`${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`, "Визиты"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-stone">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
            )}
          </CardContent>
        </Card>

        {/* Bar chart */}
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">По количеству визитов</CardTitle>
            <CardDescription className="text-stone text-sm">
              Абсолютные числа позволяют сравнить каналы по объёму трафика.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sources} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                  <XAxis type="number" stroke="#6B6760" fontSize={11} fontFamily="Raleway" allowDecimals={false} />
                  <YAxis type="category" dataKey="source" stroke="#9A958B" fontSize={12} fontFamily="Raleway" width={90} />
                  <Tooltip contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#6B8EC4" radius={[0, 4, 4, 0]} name="Визиты" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-stone-dim text-sm">Нет данных</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source cards with descriptions */}
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((s, i) => (
          <Card key={s.source} className="bg-ink-light border-stone-dim/20 hover:border-gold/30 transition-colors">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-sm text-linen">{s.source}</span>
                <span className="ml-auto text-lg font-serif text-gold">{s.count}</span>
              </div>
              <div className="w-full bg-ink-lighter rounded-full h-1.5 mb-3 ml-6 mr-6" style={{ width: "calc(100% - 1.5rem)" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%`, background: COLORS[i % COLORS.length] }} />
              </div>
              <p className="text-xs text-stone-dim leading-relaxed ml-6">
                {sourceDesc[s.source] || `Переход с ${s.source}.`}
              </p>
              <p className="text-[10px] text-stone-dim/60 ml-6 mt-1">{total > 0 ? Math.round((s.count / total) * 100) : 0}% от всего трафика</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
