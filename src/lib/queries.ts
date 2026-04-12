import { supabase } from "./supabase";
import type { Event, MenuCategory, PartnershipFormat, ClubEvent, Contact, TextBlock } from "./types";

export async function getEvents(): Promise<Event[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as Event[]) || [];
}

export async function getEventsPreview(limit = 3): Promise<Event[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .limit(limit);
  return (data as Event[]) || [];
}

export async function getMenuCategories(tab: string): Promise<MenuCategory[]> {
  const { data } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .eq("tab", tab)
    .order("sort_order")
    .order("sort_order", { referencedTable: "menu_items" });
  return (data as MenuCategory[]) || [];
}

export async function getAllMenuCategories(): Promise<Record<string, MenuCategory[]>> {
  const { data } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "menu_items" });
  const cats = (data as MenuCategory[]) || [];
  const result: Record<string, MenuCategory[]> = { tea: [], hookah: [], food: [] };
  for (const cat of cats) {
    result[cat.tab]?.push(cat);
  }
  return result;
}

export async function getPartnershipFormats(): Promise<PartnershipFormat[]> {
  const { data } = await supabase
    .from("partnership_formats")
    .select("*")
    .order("sort_order");
  return (data as PartnershipFormat[]) || [];
}

export async function getClubEvents(): Promise<ClubEvent[]> {
  const { data } = await supabase
    .from("club_events")
    .select("*")
    .order("sort_order");
  return (data as ClubEvent[]) || [];
}

export async function getContacts(): Promise<Record<string, Contact>> {
  const { data } = await supabase.from("contacts").select("*");
  const contacts = (data as Contact[]) || [];
  const map: Record<string, Contact> = {};
  for (const c of contacts) {
    map[c.key] = c;
  }
  return map;
}

export async function getTexts(...keys: string[]): Promise<Record<string, TextBlock>> {
  const { data } = await supabase
    .from("texts")
    .select("*")
    .in("key", keys);
  const texts = (data as TextBlock[]) || [];
  const map: Record<string, TextBlock> = {};
  for (const t of texts) {
    map[t.key] = t;
  }
  return map;
}

export async function getAllTexts(): Promise<Record<string, TextBlock>> {
  const { data } = await supabase.from("texts").select("*");
  const texts = (data as TextBlock[]) || [];
  const map: Record<string, TextBlock> = {};
  for (const t of texts) {
    map[t.key] = t;
  }
  return map;
}
