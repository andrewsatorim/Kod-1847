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
}

export interface MenuCategory {
  id: number;
  tab: "tea" | "hookah" | "food";
  title_ru: string;
  title_en: string;
  desc_ru: string;
  desc_en: string;
  sort_order: number;
  menu_items: MenuItem[];
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

export interface FaqItem {
  qRu: string;
  qEn: string;
  aRu: string;
  aEn: string;
}
