"use client";

import { useState, useSyncExternalStore } from "react";
import { format, subDays } from "date-fns";
import { isAuthenticated, logout } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewTab from "@/components/OverviewTab";
import PagesTab from "@/components/PagesTab";
import BookingsTab from "@/components/BookingsTab";
import ClicksTab from "@/components/ClicksTab";
import DevicesTab from "@/components/DevicesTab";
import SourcesTab from "@/components/SourcesTab";
import IikoTab from "@/components/IikoTab";
import type { DateRange } from "@/lib/queries";

type Period = "today" | "7d" | "30d" | "90d" | "custom";

function getRange(period: Period, customFrom?: string, customTo?: string): DateRange {
  const today = format(new Date(), "yyyy-MM-dd");
  switch (period) {
    case "today": return { from: today, to: today };
    case "7d": return { from: format(subDays(new Date(), 7), "yyyy-MM-dd"), to: today };
    case "30d": return { from: format(subDays(new Date(), 30), "yyyy-MM-dd"), to: today };
    case "90d": return { from: format(subDays(new Date(), 90), "yyyy-MM-dd"), to: today };
    case "custom": return { from: customFrom || today, to: customTo || today };
  }
}

const subscribe = () => () => {};
function useAuth() {
  return useSyncExternalStore(subscribe, () => isAuthenticated(), () => false);
}

const periods: { value: Period; label: string }[] = [
  { value: "today", label: "Сегодня" },
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "90d", label: "90 дней" },
  { value: "custom", label: "Период" },
];

export default function DashboardPage() {
  const authedFromStore = useAuth();
  const [authedOverride, setAuthedOverride] = useState<boolean | null>(null);
  const authed = authedOverride ?? authedFromStore;
  const [period, setPeriod] = useState<Period>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthedOverride(true)} />;
  }

  const range = getRange(period, customFrom, customTo);

  return (
    <div className="min-h-screen" style={{ background: "#08080A" }}>
      {/* Header */}
      <header className="border-b border-stone-dim/20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-xl text-linen tracking-wide">Код 1847</h1>
            <span className="text-gold text-[10px] font-sans tracking-[0.2em] uppercase mt-0.5">Аналитика</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-1 bg-ink-light rounded-md p-0.5">
              {periods.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1.5 text-xs font-sans rounded transition-colors ${
                    period === p.value
                      ? "bg-gold/15 text-gold"
                      : "text-stone hover:text-linen"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {period === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                  className="h-8 rounded border border-stone-dim/30 bg-ink-light px-2 text-xs text-linen" />
                <span className="text-stone-dim text-xs">—</span>
                <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                  className="h-8 rounded border border-stone-dim/30 bg-ink-light px-2 text-xs text-linen" />
              </div>
            )}
            <button
              onClick={() => { logout(); setAuthedOverride(false); }}
              className="text-xs text-stone-dim hover:text-linen transition-colors font-sans ml-2"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-8 bg-ink-light border border-stone-dim/20">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="pages">Страницы</TabsTrigger>
            <TabsTrigger value="bookings">Заявки</TabsTrigger>
            <TabsTrigger value="clicks">Клики</TabsTrigger>
            <TabsTrigger value="devices">Устройства</TabsTrigger>
            <TabsTrigger value="sources">Источники</TabsTrigger>
            <TabsTrigger value="iiko">iiko</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab range={range} /></TabsContent>
          <TabsContent value="pages"><PagesTab range={range} /></TabsContent>
          <TabsContent value="bookings"><BookingsTab range={range} /></TabsContent>
          <TabsContent value="clicks"><ClicksTab range={range} /></TabsContent>
          <TabsContent value="devices"><DevicesTab range={range} /></TabsContent>
          <TabsContent value="sources"><SourcesTab range={range} /></TabsContent>
          <TabsContent value="iiko"><IikoTab range={range} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
