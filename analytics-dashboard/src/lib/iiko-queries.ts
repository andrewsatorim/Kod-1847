import { iikoPost, getOrgId, getOrgIds } from "./iiko";

// ══════════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════════

export interface IikoOrganization {
  id: string;
  name: string;
  country: string;
  restaurantAddress: string;
  latitude: number;
  longitude: number;
  phone: string;
  currencyIsoName: string;
}

export interface IikoProduct {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  type: string; // "Dish" | "Good" | "Modifier"
  groupId: string | null;
  productCategoryId: string | null;
  price: number;
  order: number;
  isDeleted: boolean;
}

export interface IikoProductGroup {
  id: string;
  name: string;
  parentGroup: string | null;
  isDeleted: boolean;
  order: number;
}

export interface IikoProductCategory {
  id: string;
  name: string;
}

export interface IikoCustomer {
  id: string;
  name: string;
  surname: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  sex: number; // 0=NotSpecified, 1=Male, 2=Female
  walletBalances: { id: string; name: string; type: number; balance: number }[];
  cards: { id: string; track: string; number: string; validToDate: string | null }[];
  categories: { id: string; name: string }[];
  comment: string | null;
}

export interface IikoOrderItem {
  product: { id: string; name: string };
  amount: number;
  price: number;
  resultSum: number;
  type: string;
}

export interface IikoOrder {
  id: string;
  externalNumber: string | null;
  status: string;
  creationStatus: string;
  whenCreated: string;
  whenClosed: string | null;
  sum: number;
  number: number;
  items: IikoOrderItem[];
  payments: { sum: number; paymentType: { id: string; name: string }; isProcessedExternally: boolean }[];
  guests: { count: number };
  table?: { id: string; name: string } | null;
}

export interface IikoEmployee {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
  code: string | null;
  isDeleted: boolean;
  roles: { code: string; name: string }[];
}

export interface IikoDiscount {
  id: string;
  name: string;
  percent: number;
  isCategorisedDiscount: boolean;
  mode: string;
  sum: number;
  canBeAppliedSelectively: boolean;
  isManual: boolean;
  isAutomatic: boolean;
}

export interface IikoPaymentType {
  id: string;
  code: string;
  name: string;
  paymentProcessingType: string;
  paymentTypeKind: string;
  isDeleted: boolean;
}

export interface IikoReserveSection {
  id: string;
  name: string;
  terminalGroupId: string;
  tables: { id: string; number: number; name: string; seatingCapacity: number; isDeleted: boolean }[];
}

export interface IikoReserve {
  id: string;
  tableIds: string[];
  estimatedStartTime: string;
  durationInMinutes: number;
  guestsCount: number;
  status: string;
  customer: { name: string; phone: string } | null;
  comment: string | null;
}

export interface IikoStopListItem {
  productId: string;
  balance: number;
}

// ══════════════════════════════════════════════════════════════
// API Calls
// ══════════════════════════════════════════════════════════════

// ── Organization ─────────────────────────────────────────────

export async function getOrganizationInfo(): Promise<IikoOrganization[]> {
  const res = await iikoPost<{ organizations: IikoOrganization[] }>("/api/1/organizations", {
    organizationIds: getOrgIds(),
    returnAdditionalInfo: true,
  });
  return res.organizations;
}

// ── Menu / Nomenclature ──────────────────────────────────────

export async function getNomenclature(): Promise<{
  products: IikoProduct[];
  groups: IikoProductGroup[];
  productCategories: IikoProductCategory[];
}> {
  const res = await iikoPost<{
    products: IikoProduct[];
    groups: IikoProductGroup[];
    productCategories: IikoProductCategory[];
  }>("/api/1/nomenclature", {
    organizationId: getOrgId(),
  });
  return {
    products: (res.products || []).filter(p => !p.isDeleted),
    groups: (res.groups || []).filter(g => !g.isDeleted),
    productCategories: res.productCategories || [],
  };
}

// ── Stop Lists (Out of Stock) ────────────────────────────────

export async function getStopLists(): Promise<IikoStopListItem[]> {
  const res = await iikoPost<{
    terminalGroupStopLists: { organizationId: string; items: { terminalGroupId: string; items: IikoStopListItem[] }[] }[];
  }>("/api/1/stop_lists", {
    organizationIds: getOrgIds(),
  });
  const all: IikoStopListItem[] = [];
  for (const org of res.terminalGroupStopLists || []) {
    for (const tg of org.items || []) {
      all.push(...(tg.items || []));
    }
  }
  return all;
}

// ── Orders (Table Service) ───────────────────────────────────

export async function getOrdersByDate(dateFrom: string, dateTo: string): Promise<IikoOrder[]> {
  const res = await iikoPost<{ orders: IikoOrder[] }>("/api/1/deliveries/by_delivery_date_and_status", {
    organizationIds: getOrgIds(),
    deliveryDateFrom: dateFrom,
    deliveryDateTo: dateTo,
    statuses: ["Closed", "Delivered"],
  });
  return res.orders || [];
}

// ── Customers / Loyalty ──────────────────────────────────────

export async function getCustomerByPhone(phone: string): Promise<IikoCustomer | null> {
  try {
    const res = await iikoPost<IikoCustomer>("/api/1/loyalty/iiko/customer/info", {
      organizationId: getOrgId(),
      phone,
      type: "phone",
    });
    return res;
  } catch {
    return null;
  }
}

export async function getCustomerById(id: string): Promise<IikoCustomer | null> {
  try {
    const res = await iikoPost<IikoCustomer>("/api/1/loyalty/iiko/customer/info", {
      organizationId: getOrgId(),
      id,
      type: "id",
    });
    return res;
  } catch {
    return null;
  }
}

// ── Employees ────────────────────────────────────────────────

export async function getEmployees(): Promise<IikoEmployee[]> {
  const res = await iikoPost<{ employees: IikoEmployee[] }>("/api/1/employees/info", {
    organizationIds: getOrgIds(),
  });
  return (res.employees || []).filter(e => !e.isDeleted);
}

// ── Discounts ────────────────────────────────────────────────

export async function getDiscounts(): Promise<IikoDiscount[]> {
  const res = await iikoPost<{ discounts: IikoDiscount[] }>("/api/1/discounts", {
    organizationIds: getOrgIds(),
  });
  return res.discounts || [];
}

// ── Payment Types ────────────────────────────────────────────

export async function getPaymentTypes(): Promise<IikoPaymentType[]> {
  const res = await iikoPost<{ paymentTypes: IikoPaymentType[] }>("/api/1/payment_types", {
    organizationIds: getOrgIds(),
  });
  return (res.paymentTypes || []).filter(p => !p.isDeleted);
}

// ── Reservations ─────────────────────────────────────────────

export async function getRestaurantSections(): Promise<IikoReserveSection[]> {
  // First get terminal groups
  const tgRes = await iikoPost<{
    terminalGroups: { organizationId: string; items: { id: string; name: string }[] }[];
  }>("/api/1/terminal_groups", {
    organizationIds: getOrgIds(),
  });

  const terminalGroupIds: string[] = [];
  for (const org of tgRes.terminalGroups || []) {
    for (const item of org.items || []) {
      terminalGroupIds.push(item.id);
    }
  }

  if (terminalGroupIds.length === 0) return [];

  const res = await iikoPost<{
    restaurantSections: IikoReserveSection[];
  }>("/api/1/reserve/available_restaurant_sections", {
    terminalGroupIds,
  });
  return res.restaurantSections || [];
}

export async function getReserves(sectionIds: string[], dateFrom: string, dateTo: string): Promise<IikoReserve[]> {
  if (sectionIds.length === 0) return [];
  const res = await iikoPost<{
    reserves: IikoReserve[];
  }>("/api/1/reserve/restaurant_sections_workload", {
    restaurantSectionIds: sectionIds,
    dateFrom,
    dateTo,
  });
  return res.reserves || [];
}

// ══════════════════════════════════════════════════════════════
// Aggregation helpers (computed from raw API data)
// ══════════════════════════════════════════════════════════════

export interface RevenueSummary {
  totalRevenue: number;
  totalOrders: number;
  avgCheck: number;
  totalGuests: number;
  avgRevenuePerGuest: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

export function computeRevenueSummary(orders: IikoOrder[]): RevenueSummary {
  const totalRevenue = orders.reduce((s, o) => s + (o.sum || 0), 0);
  const totalOrders = orders.length;
  const avgCheck = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalGuests = orders.reduce((s, o) => s + (o.guests?.count || 1), 0);
  const avgRevenuePerGuest = totalGuests > 0 ? Math.round(totalRevenue / totalGuests) : 0;

  const byDay: Record<string, { revenue: number; orders: number }> = {};
  for (const o of orders) {
    const day = (o.whenCreated || "").slice(0, 10);
    if (!day) continue;
    if (!byDay[day]) byDay[day] = { revenue: 0, orders: 0 };
    byDay[day].revenue += o.sum || 0;
    byDay[day].orders += 1;
  }

  const revenueByDay = Object.entries(byDay)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { totalRevenue, totalOrders, avgCheck, totalGuests, avgRevenuePerGuest, revenueByDay };
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export function computeTopProducts(orders: IikoOrder[]): TopProduct[] {
  const map: Record<string, { quantity: number; revenue: number }> = {};
  for (const o of orders) {
    for (const item of o.items || []) {
      const name = item.product?.name || "Неизвестно";
      if (!map[name]) map[name] = { quantity: 0, revenue: 0 };
      map[name].quantity += item.amount || 0;
      map[name].revenue += item.resultSum || 0;
    }
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface PaymentBreakdown {
  name: string;
  total: number;
  count: number;
}

export function computePaymentBreakdown(orders: IikoOrder[]): PaymentBreakdown[] {
  const map: Record<string, { total: number; count: number }> = {};
  for (const o of orders) {
    for (const p of o.payments || []) {
      const name = p.paymentType?.name || "Другое";
      if (!map[name]) map[name] = { total: 0, count: 0 };
      map[name].total += p.sum || 0;
      map[name].count += 1;
    }
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.total - a.total);
}

export interface ReserveSummary {
  totalReserves: number;
  totalGuests: number;
  avgDurationMin: number;
  reservesByDay: { date: string; count: number; guests: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export function computeReserveSummary(reserves: IikoReserve[]): ReserveSummary {
  const totalReserves = reserves.length;
  const totalGuests = reserves.reduce((s, r) => s + (r.guestsCount || 0), 0);
  const avgDurationMin = totalReserves > 0
    ? Math.round(reserves.reduce((s, r) => s + (r.durationInMinutes || 0), 0) / totalReserves)
    : 0;

  const byDay: Record<string, { count: number; guests: number }> = {};
  for (const r of reserves) {
    const day = (r.estimatedStartTime || "").slice(0, 10);
    if (!day) continue;
    if (!byDay[day]) byDay[day] = { count: 0, guests: 0 };
    byDay[day].count += 1;
    byDay[day].guests += r.guestsCount || 0;
  }
  const reservesByDay = Object.entries(byDay)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const statusMap: Record<string, number> = {};
  for (const r of reserves) {
    const st = r.status || "Unknown";
    statusMap[st] = (statusMap[st] || 0) + 1;
  }
  const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  return { totalReserves, totalGuests, avgDurationMin, reservesByDay, statusBreakdown };
}
