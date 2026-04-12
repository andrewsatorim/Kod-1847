"use client";

import { useState, useSyncExternalStore } from "react";
import { format, subDays } from "date-fns";
import { isAuthenticated, logout } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import OverviewTab from "@/components/OverviewTab";
import PagesTab from "@/components/PagesTab";
import BookingsTab from "@/components/BookingsTab";
import ClicksTab from "@/components/ClicksTab";
import DevicesTab from "@/components/DevicesTab";
import SourcesTab from "@/components/SourcesTab";
import { BarChart3, LogOut } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Код 1847 — Аналитика</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={period} onChange={e => setPeriod(e.target.value as Period)} className="w-[160px]">
                <option value="today">Сегодня</option>
                <option value="7d">7 дней</option>
                <option value="30d">30 дней</option>
                <option value="90d">90 дней</option>
                <option value="custom">Произвольный</option>
              </Select>
              {period === "custom" && (
                <>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <span className="text-muted-foreground">—</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </>
              )}
            </div>
            <button
              onClick={() => { logout(); setAuthedOverride(false); }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="pages">Страницы</TabsTrigger>
            <TabsTrigger value="bookings">Заявки</TabsTrigger>
            <TabsTrigger value="clicks">Клики</TabsTrigger>
            <TabsTrigger value="devices">Устройства</TabsTrigger>
            <TabsTrigger value="sources">Источники</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab range={range} /></TabsContent>
          <TabsContent value="pages"><PagesTab range={range} /></TabsContent>
          <TabsContent value="bookings"><BookingsTab range={range} /></TabsContent>
          <TabsContent value="clicks"><ClicksTab range={range} /></TabsContent>
          <TabsContent value="devices"><DevicesTab range={range} /></TabsContent>
          <TabsContent value="sources"><SourcesTab range={range} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
