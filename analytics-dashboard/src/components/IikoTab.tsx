"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { isIikoConfigured, ensureOrgId } from "@/lib/iiko";
import {
  getOrganizationInfo,
  getNomenclature,
  getStopLists,
  getOrdersByDate,
  getEmployees,
  getDiscounts,
  getPaymentTypes,
  getRestaurantSections,
  getReserves,
  computeRevenueSummary,
  computeTopProducts,
  computePaymentBreakdown,
  computeReserveSummary,
  type IikoOrganization,
  type IikoProduct,
  type IikoProductGroup,
  type IikoEmployee,
  type IikoDiscount,
  type IikoPaymentType,
  type IikoStopListItem,
  type RevenueSummary,
  type TopProduct,
  type PaymentBreakdown,
  type ReserveSummary,
  type IikoReserveSection,
} from "@/lib/iiko-queries";
import type { DateRange } from "@/lib/queries";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#B89860", "#5B9A6E", "#6B8EC4", "#9A6BB8", "#C46B6B", "#C4A86B", "#6BC4B8", "#B86B9A"];

type SubTab = "revenue" | "menu" | "employees" | "reserves" | "discounts";

const subTabs: { value: SubTab; label: string }[] = [
  { value: "revenue", label: "Выручка" },
  { value: "menu", label: "Меню" },
  { value: "employees", label: "Сотрудники" },
  { value: "reserves", label: "Бронирования" },
  { value: "discounts", label: "Скидки и оплаты" },
];

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

function fmtCurrency(n: number): string {
  return n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
}

// ── Not Configured State ─────────────────────────────────────

function NotConfigured() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-linen">iiko</h2>
        <p className="text-stone text-sm mt-1">Интеграция с системой автоматизации заведения</p>
      </div>
      <Card className="bg-ink-light border-stone-dim/20">
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">&#9881;</div>
          <h3 className="font-serif text-lg text-linen mb-2">iiko не подключён</h3>
          <p className="text-sm text-stone max-w-md mx-auto mb-6">
            Для подключения добавьте переменные окружения в Vercel:
          </p>
          <div className="bg-ink-lighter rounded-lg p-4 max-w-sm mx-auto text-left">
            <code className="text-xs text-gold block">NEXT_PUBLIC_IIKO_API_LOGIN=ваш_ключ</code>
            <code className="text-xs text-gold block mt-1">NEXT_PUBLIC_IIKO_ORGANIZATION_ID=uuid</code>
          </div>
          <p className="text-xs text-stone-dim mt-4">
            API-ключ можно получить в настройках iikoWeb &rarr; Интеграции &rarr; Cloud API
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Revenue Sub-Tab ──────────────────────────────────────────

function RevenueSection({ revenue, topProducts, payments }: {
  revenue: RevenueSummary | null;
  topProducts: TopProduct[];
  payments: PaymentBreakdown[];
}) {
  if (!revenue) return <LoadingCards count={4} />;

  const cards = [
    { title: "Выручка", value: fmtCurrency(revenue.totalRevenue), sub: "за период", desc: "Общая сумма закрытых заказов из iiko за выбранный период." },
    { title: "Заказы", value: fmt(revenue.totalOrders), sub: "закрытых", desc: "Количество завершённых заказов (столовое обслуживание)." },
    { title: "Средний чек", value: fmtCurrency(revenue.avgCheck), sub: "на заказ", desc: "Средняя сумма одного заказа. Ключевой показатель для оценки среднего дохода." },
    { title: "Гости", value: fmt(revenue.totalGuests), sub: `${fmtCurrency(revenue.avgRevenuePerGuest)} на гостя`, desc: "Общее количество гостей и средняя выручка на одного гостя." },
  ];

  return (
    <div className="space-y-8">
      {/* KPI cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
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
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Выручка по дням</CardTitle>
          <CardDescription className="text-stone text-sm">
            Динамика дневной выручки. Позволяет увидеть пиковые дни и сезонность.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {revenue.revenueByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenue.revenueByDay}>
                <defs>
                  <linearGradient id="iikoGoldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B89860" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B89860" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis dataKey="date" stroke="#6B6760" fontSize={11} fontFamily="Raleway" tickFormatter={v => v.slice(5)} />
                <YAxis stroke="#6B6760" fontSize={11} fontFamily="Raleway" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }}
                  labelStyle={{ color: "#F5F0E8" }}
                  formatter={(value: number) => [fmtCurrency(value), "Выручка"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B89860" strokeWidth={2} fill="url(#iikoGoldGrad)" name="Выручка" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-stone-dim text-sm">Нет данных за выбранный период</div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Популярные позиции</CardTitle>
            <CardDescription className="text-stone text-sm">
              Топ позиций по выручке. Показывает, что приносит больше всего дохода.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_70px_90px] gap-4 text-[10px] text-stone-dim font-sans font-medium tracking-wider uppercase pb-3 border-b border-stone-dim/20">
                  <div>Позиция</div>
                  <div className="text-right">Кол-во</div>
                  <div className="text-right">Выручка</div>
                </div>
                {topProducts.slice(0, 15).map(p => (
                  <div key={p.name} className="grid grid-cols-[1fr_70px_90px] gap-4 py-2.5 text-sm border-b border-stone-dim/10">
                    <div className="text-linen truncate">{p.name}</div>
                    <div className="text-right text-stone font-mono text-xs">{fmt(p.quantity)}</div>
                    <div className="text-right text-gold text-xs">{fmtCurrency(p.revenue)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-stone-dim text-sm">Нет данных</div>
            )}
          </CardContent>
        </Card>

        {/* Payment breakdown */}
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Способы оплаты</CardTitle>
            <CardDescription className="text-stone text-sm">
              Как гости предпочитают оплачивать заказы.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={payments} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="total" nameKey="name">
                      {payments.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }}
                      formatter={(value: number) => [fmtCurrency(value), "Сумма"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 justify-center">
                  {payments.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-stone">{p.name}</span>
                      <span className="text-xs text-linen font-mono">{fmtCurrency(p.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-stone-dim text-sm">Нет данных</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Menu Sub-Tab ─────────────────────────────────────────────

function MenuSection({ products, groups, stopList }: {
  products: IikoProduct[];
  groups: IikoProductGroup[];
  stopList: IikoStopListItem[];
}) {
  const stopSet = new Set(stopList.map(s => s.productId));
  const dishes = products.filter(p => p.type === "Dish" || p.type === "Good");
  const groupMap = Object.fromEntries(groups.map(g => [g.id, g.name]));

  const byCategory: Record<string, IikoProduct[]> = {};
  for (const p of dishes) {
    const cat = groupMap[p.groupId || ""] || "Без категории";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  }

  const sorted = Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Позиций в меню</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(dishes.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Активные блюда и товары в номенклатуре iiko.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Категорий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(groups.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Групп товаров в структуре меню.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Стоп-лист</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-serif ${stopList.length > 0 ? "text-red-400" : "text-green-400"}`}>
              {stopList.length > 0 ? fmt(stopList.length) : "Пусто"}
            </div>
            <p className="text-xs text-stone-dim mt-3">Позиций, недоступных для заказа прямо сейчас.</p>
          </CardContent>
        </Card>
      </div>

      {/* Stop list items */}
      {stopList.length > 0 && (
        <Card className="bg-ink-light border-red-900/30">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-red-400">Стоп-лист</CardTitle>
            <CardDescription className="text-stone text-sm">Позиции, которые сейчас недоступны для гостей.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {stopList.map(s => {
                const prod = products.find(p => p.id === s.productId);
                return (
                  <div key={s.productId} className="flex items-center justify-between rounded-lg border border-red-900/20 bg-ink-lighter/50 px-4 py-2.5">
                    <span className="text-sm text-linen">{prod?.name || s.productId}</span>
                    <span className="text-xs text-red-400 font-mono">{s.balance === 0 ? "0" : s.balance}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu by category */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Меню по категориям</CardTitle>
          <CardDescription className="text-stone text-sm">
            Полный перечень активных позиций из номенклатуры iiko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sorted.length > 0 ? (
            <div className="space-y-6">
              {sorted.map(([cat, items]) => (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm text-gold font-medium">{cat}</h4>
                    <span className="text-[10px] text-stone-dim">{items.length} поз.</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {items.sort((a, b) => a.order - b.order).map(p => (
                      <div key={p.id} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${stopSet.has(p.id) ? "border-red-900/30 bg-red-950/20" : "border-stone-dim/15 bg-ink-lighter/50"}`}>
                        <span className={`text-sm ${stopSet.has(p.id) ? "text-red-300 line-through" : "text-linen"}`}>{p.name}</span>
                        {p.price > 0 && <span className="text-xs text-stone font-mono ml-2">{fmtCurrency(p.price)}</span>}
                      </div>
                    ))}
                  </div>
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

// ── Employees Sub-Tab ────────────────────────────────────────

function EmployeesSection({ employees }: { employees: IikoEmployee[] }) {
  const byRole: Record<string, IikoEmployee[]> = {};
  for (const e of employees) {
    for (const r of e.roles || [{ name: "Без роли" }]) {
      const role = r.name || "Без роли";
      if (!byRole[role]) byRole[role] = [];
      byRole[role].push(e);
    }
  }

  const sorted = Object.entries(byRole).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Всего сотрудников</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(employees.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Активные сотрудники в системе iiko.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Ролей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(sorted.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Уникальных ролей/должностей.</p>
          </CardContent>
        </Card>
      </div>

      {/* By role */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Сотрудники по ролям</CardTitle>
          <CardDescription className="text-stone text-sm">Распределение персонала по должностям.</CardDescription>
        </CardHeader>
        <CardContent>
          {sorted.length > 0 ? (
            <div className="space-y-6">
              {sorted.map(([role, emps]) => (
                <div key={role}>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm text-gold font-medium">{role}</h4>
                    <span className="text-[10px] text-stone-dim">{emps.length} чел.</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {emps.map(e => (
                      <div key={e.id} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-2.5">
                        <span className="text-sm text-linen">{e.lastName} {e.firstName}{e.middleName ? ` ${e.middleName}` : ""}</span>
                        {e.code && <span className="text-[10px] text-stone-dim font-mono ml-2">{e.code}</span>}
                      </div>
                    ))}
                  </div>
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

// ── Reserves Sub-Tab ─────────────────────────────────────────

function ReservesSection({ reserveSummary, sections }: {
  reserveSummary: ReserveSummary | null;
  sections: IikoReserveSection[];
}) {
  if (!reserveSummary) return <LoadingCards count={3} />;

  const cards = [
    { title: "Бронирований", value: fmt(reserveSummary.totalReserves), sub: "за период", desc: "Общее число бронирований столов через iiko." },
    { title: "Гостей", value: fmt(reserveSummary.totalGuests), sub: "забронировано мест", desc: "Суммарное количество гостей по всем бронированиям." },
    { title: "Среднее время", value: `${reserveSummary.avgDurationMin} мин`, sub: "длительность визита", desc: "Средняя запланированная продолжительность бронирования." },
  ];

  const totalTables = sections.reduce((s, sec) => s + (sec.tables?.length || 0), 0);
  const totalSeats = sections.reduce((s, sec) => s + sec.tables.reduce((ts, t) => ts + (t.seatingCapacity || 0), 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(c => (
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
        ))}
      </div>

      {/* Reserves by day chart */}
      {reserveSummary.reservesByDay.length > 0 && (
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Бронирования по дням</CardTitle>
            <CardDescription className="text-stone text-sm">Динамика количества бронирований и гостей.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reserveSummary.reservesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                <XAxis dataKey="date" stroke="#6B6760" fontSize={11} fontFamily="Raleway" tickFormatter={v => v.slice(5)} />
                <YAxis stroke="#6B6760" fontSize={11} fontFamily="Raleway" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111114", border: "1px solid #2A2A2F", borderRadius: 8, fontFamily: "Raleway", fontSize: 12 }} />
                <Bar dataKey="count" fill="#B89860" radius={[4, 4, 0, 0]} name="Бронирований" />
                <Bar dataKey="guests" fill="#5B9A6E" radius={[4, 4, 0, 0]} name="Гостей" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Restaurant sections & tables */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Залы и столы</CardTitle>
          <CardDescription className="text-stone text-sm">
            {fmt(totalTables)} столов на {fmt(totalSeats)} посадочных мест в {sections.length} залах.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sections.length > 0 ? (
            <div className="space-y-6">
              {sections.map(sec => (
                <div key={sec.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm text-gold font-medium">{sec.name}</h4>
                    <span className="text-[10px] text-stone-dim">{sec.tables.length} столов</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {sec.tables.filter(t => !t.isDeleted).map(t => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-2.5">
                        <span className="text-sm text-linen">{t.name || `Стол ${t.number}`}</span>
                        <span className="text-xs text-stone font-mono">{t.seatingCapacity} мест</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет данных о залах</div>
          )}
        </CardContent>
      </Card>

      {/* Status breakdown */}
      {reserveSummary.statusBreakdown.length > 0 && (
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-linen">Статусы бронирований</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {reserveSummary.statusBreakdown.map(s => (
                <div key={s.status} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-3">
                  <span className="text-sm text-linen">{s.status}</span>
                  <span className="text-sm font-serif text-gold">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Discounts & Payments Sub-Tab ─────────────────────────────

function DiscountsSection({ discounts, paymentTypes }: {
  discounts: IikoDiscount[];
  paymentTypes: IikoPaymentType[];
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Скидок / надбавок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(discounts.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Настроенных скидок и надбавок в системе iiko.</p>
          </CardContent>
        </Card>
        <Card className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-sans font-medium text-stone tracking-wide uppercase">Типов оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-linen">{fmt(paymentTypes.length)}</div>
            <p className="text-xs text-stone-dim mt-3">Доступных способов оплаты для гостей.</p>
          </CardContent>
        </Card>
      </div>

      {/* Discounts list */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Скидки и надбавки</CardTitle>
          <CardDescription className="text-stone text-sm">Все настроенные в iiko скидки, промо-акции и надбавки.</CardDescription>
        </CardHeader>
        <CardContent>
          {discounts.length > 0 ? (
            <div className="space-y-0">
              <div className="grid grid-cols-[1fr_100px_80px] gap-4 text-[10px] text-stone-dim font-sans font-medium tracking-wider uppercase pb-3 border-b border-stone-dim/20">
                <div>Название</div>
                <div className="text-right">Тип</div>
                <div className="text-right">Значение</div>
              </div>
              {discounts.map(d => (
                <div key={d.id} className="grid grid-cols-[1fr_100px_80px] gap-4 py-2.5 text-sm border-b border-stone-dim/10">
                  <div className="text-linen">{d.name}</div>
                  <div className="text-right text-stone text-xs">
                    {d.isAutomatic ? "Авто" : d.isManual ? "Ручная" : "Другое"}
                  </div>
                  <div className="text-right text-gold text-xs">
                    {d.mode === "Percent" ? `${d.percent}%` : d.mode === "FixedSum" ? fmtCurrency(d.sum) : d.mode}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-stone-dim text-sm">Нет скидок</div>
          )}
        </CardContent>
      </Card>

      {/* Payment types list */}
      <Card className="bg-ink-light border-stone-dim/20">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-linen">Типы оплаты</CardTitle>
          <CardDescription className="text-stone text-sm">Доступные способы приёма платежей.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentTypes.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {paymentTypes.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-stone-dim/15 bg-ink-lighter/50 px-4 py-3">
                  <span className="text-sm text-linen">{p.name}</span>
                  <span className="text-[10px] text-stone-dim font-mono">{p.paymentTypeKind}</span>
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

// ── Loading skeleton ─────────────────────────────────────────

function LoadingCards({ count }: { count: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-ink-light border-stone-dim/20">
          <CardHeader className="pb-2"><div className="h-3 w-20 bg-ink-lighter animate-pulse rounded" /></CardHeader>
          <CardContent><div className="h-8 w-16 bg-ink-lighter animate-pulse rounded" /></CardContent>
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main IikoTab
// ══════════════════════════════════════════════════════════════

export default function IikoTab({ range }: { range: DateRange }) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [org, setOrg] = useState<IikoOrganization | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [payments, setPayments] = useState<PaymentBreakdown[]>([]);
  const [products, setProducts] = useState<IikoProduct[]>([]);
  const [groups, setGroups] = useState<IikoProductGroup[]>([]);
  const [stopList, setStopList] = useState<IikoStopListItem[]>([]);
  const [employees, setEmployees] = useState<IikoEmployee[]>([]);
  const [discounts, setDiscounts] = useState<IikoDiscount[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<IikoPaymentType[]>([]);
  const [sections, setSections] = useState<IikoReserveSection[]>([]);
  const [reserveSummary, setReserveSummary] = useState<ReserveSummary | null>(null);

  const configured = isIikoConfigured();

  const loadData = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);

    try {
      // Auto-discover organization ID first
      await ensureOrgId();

      // Parallel load
      const [orgRes, nomenclature, stopRes, ordersRes, empRes, discRes, ptRes, sectionsRes] = await Promise.all([
        getOrganizationInfo().catch(() => []),
        getNomenclature().catch(() => ({ products: [], groups: [], productCategories: [] })),
        getStopLists().catch(() => []),
        getOrdersByDate(range.from, range.to).catch(() => []),
        getEmployees().catch(() => []),
        getDiscounts().catch(() => []),
        getPaymentTypes().catch(() => []),
        getRestaurantSections().catch(() => []),
      ]);

      if (orgRes.length > 0) setOrg(orgRes[0]);
      setProducts(nomenclature.products);
      setGroups(nomenclature.groups);
      setStopList(stopRes);
      setEmployees(empRes);
      setDiscounts(discRes);
      setPaymentTypes(ptRes);
      setSections(sectionsRes);

      // Compute revenue from orders
      const revSummary = computeRevenueSummary(ordersRes);
      setRevenue(revSummary);
      setTopProducts(computeTopProducts(ordersRes));
      setPayments(computePaymentBreakdown(ordersRes));

      // Load reserves
      const sectionIds = sectionsRes.map(s => s.id);
      if (sectionIds.length > 0) {
        const reserves = await getReserves(sectionIds, range.from, range.to).catch(() => []);
        setReserveSummary(computeReserveSummary(reserves));
      } else {
        setReserveSummary({ totalReserves: 0, totalGuests: 0, avgDurationMin: 0, reservesByDay: [], statusBreakdown: [] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных из iiko");
    } finally {
      setLoading(false);
    }
  }, [configured, range]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!configured) return <NotConfigured />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-linen">iiko</h2>
          <p className="text-stone text-sm mt-1">
            {org ? `${org.name} \u2014 ${org.restaurantAddress}` : "Данные из системы автоматизации заведения"}
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-stone text-xs">
            <div className="w-3 h-3 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
            Загрузка...
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <Card className="bg-red-950/30 border-red-900/40">
          <CardContent className="py-4">
            <p className="text-sm text-red-300">{error}</p>
            <button onClick={loadData} className="mt-2 text-xs text-gold hover:text-linen transition-colors">
              Повторить загрузку
            </button>
          </CardContent>
        </Card>
      )}

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-ink-light rounded-md p-0.5 border border-stone-dim/20 w-fit">
        {subTabs.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveSubTab(t.value)}
            className={`px-4 py-2 text-xs font-sans rounded transition-colors ${
              activeSubTab === t.value
                ? "bg-gold/15 text-gold"
                : "text-stone hover:text-linen"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSubTab === "revenue" && (
        <RevenueSection revenue={revenue} topProducts={topProducts} payments={payments} />
      )}
      {activeSubTab === "menu" && (
        <MenuSection products={products} groups={groups} stopList={stopList} />
      )}
      {activeSubTab === "employees" && (
        <EmployeesSection employees={employees} />
      )}
      {activeSubTab === "reserves" && (
        <ReservesSection reserveSummary={reserveSummary} sections={sections} />
      )}
      {activeSubTab === "discounts" && (
        <DiscountsSection discounts={discounts} paymentTypes={paymentTypes} />
      )}
    </div>
  );
}
