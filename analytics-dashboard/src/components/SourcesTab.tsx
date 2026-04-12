"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReferrerStats, type DateRange } from "@/lib/queries";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["hsl(220, 70%, 50%)", "hsl(160, 60%, 45%)", "hsl(30, 80%, 55%)", "hsl(280, 65%, 60%)", "hsl(340, 75%, 55%)", "hsl(190, 60%, 50%)", "hsl(50, 70%, 50%)"];

export default function SourcesTab({ range }: { range: DateRange }) {
  const [sources, setSources] = useState<{ source: string; count: number }[]>([]);

  useEffect(() => {
    getReferrerStats(range).then(setSources);
  }, [range]);

  const total = sources.reduce((sum, s) => sum + s.count, 0);
  const pieData = sources.map(s => ({ name: s.source, value: s.count }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Источники трафика</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>По количеству визитов</CardTitle></CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sources} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 17%)" />
                  <XAxis type="number" stroke="hsl(215 16% 57%)" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="source" stroke="hsl(215 16% 57%)" fontSize={12} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(224 71% 4%)", border: "1px solid hsl(216 34% 17%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(213 31% 91%)" }}
                  />
                  <Bar dataKey="count" fill="hsl(280 65% 60%)" radius={[0, 4, 4, 0]} name="Визиты" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Нет данных</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Детализация</CardTitle></CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                <div>Источник</div>
                <div className="text-right">Визиты</div>
                <div className="text-right">Доля</div>
              </div>
              {sources.map(s => (
                <div key={s.source} className="grid grid-cols-[1fr_80px_80px] gap-4 py-2 text-sm border-b border-border/50">
                  <div className="font-medium">{s.source}</div>
                  <div className="text-right font-mono">{s.count}</div>
                  <div className="text-right text-muted-foreground">{total > 0 ? Math.round((s.count / total) * 100) : 0}%</div>
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
