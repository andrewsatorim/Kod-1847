export interface Event {
  id: number;
  day: string;
  month_ru: string;
  month_en: string;
  name_ru: string;
  name_en: string;
  desc_ru: string;
  desc_en: string;
  time: string;
  tag_ru: string;
  tag_en: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuCategory {
  id: number;
  tab: "tea" | "hookah" | "food";
  title_ru: string;
  title_en: string;
  desc_ru: string;
  desc_en: string;
  sort_order: number;
  menu_items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  category_id: number;
  name_ru: string;
  name_en: string;
  desc_ru: string;
  desc_en: string;
  is_flagship: boolean;
  sort_order: number;
}

export interface PartnershipFormat {
  id: number;
  num: string;
  title_ru: string;
  title_en: string;
  points_ru: string[];
  points_en: string[];
  suit_ru: string;
  suit_en: string;
  sort_order: number;
}

export interface ClubEvent {
  id: number;
  name_ru: string;
  name_en: string;
  desc_ru: string;
  desc_en: string;
  detail_ru: string;
  detail_en: string;
  sort_order: number;
}

export interface Contact {
  id: number;
  key: string;
  value_ru: string;
  value_en: string;
}

export interface TextBlock {
  id: number;
  key: string;
  value_ru: string;
  value_en: string;
}

export type VisitedStatus = "pending" | "came" | "no_show" | "cancelled";

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  comment: string;
  consent: boolean;
  source: string;
  event_name: string;
  visited: VisitedStatus;
  manager_note: string;
  iiko_id: string | null;
  iiko_status: string | null;
  iiko_error: string | null;
  created_at: string;
  updated_at: string;
}
