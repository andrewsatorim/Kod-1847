"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Stats {
  events: number;
  menuCategories: number;
  menuItems: number;
  contacts: number;
  texts: number;
  partnershipFormats: number;
  clubEvents: number;
}

const cards = [
  { key: "events" as const, label: "Мероприятия", href: "/dashboard/events" },
  { key: "menuCategories" as const, label: "Категории меню", href: "/dashboard/menu" },
  { key: "menuItems" as const, label: "Позиции меню", href: "/dashboard/menu" },
  { key: "partnershipFormats" as const, label: "Форматы партнёрства", href: "/dashboard/partnership" },
  { key: "clubEvents" as const, label: "Клубные события", href: "/dashboard/partnership" },
  { key: "contacts" as const, label: "Контакты", href: "/dashboard/contacts" },
  { key: "texts" as const, label: "Текстовые блоки", href: "/dashboard/texts" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [events, cats, items, contacts, texts, pf, ce] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("menu_categories").select("id", { count: "exact", head: true }),
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("texts").select("id", { count: "exact", head: true }),
        supabase.from("partnership_formats").select("id", { count: "exact", head: true }),
        supabase.from("club_events").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        events: events.count ?? 0,
        menuCategories: cats.count ?? 0,
        menuItems: items.count ?? 0,
        contacts: contacts.count ?? 0,
        texts: texts.count ?? 0,
        partnershipFormats: pf.count ?? 0,
        clubEvents: ce.count ?? 0,
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Обзор</h1>

      {!stats ? (
        <div className="flex items-center gap-2 text-stone">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="bg-card border border-border rounded-xl p-5 hover:border-gold/40 transition-colors group"
            >
              <p className="text-stone text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gold group-hover:text-gold-light transition-colors">
                {stats[card.key]}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
