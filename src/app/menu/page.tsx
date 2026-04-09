"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondDivider from "@/components/DiamondDivider";

const tabs = [
  { id: "tea", labelRu: "Чайная карта", labelEn: "Tea Menu" },
  { id: "hookah", labelRu: "Кальянная карта", labelEn: "Hookah Menu" },
  { id: "food", labelRu: "Кухня", labelEn: "Kitchen" },
];

interface MenuItem {
  nameRu: string; nameEn: string; descRu?: string; descEn?: string; price: string; flagship?: boolean;
}
interface MenuCategory {
  titleRu: string; titleEn: string; descRu: string; descEn: string; items: MenuItem[];
}

const teaCategories: MenuCategory[] = [
  { titleRu: "Редкие сорта", titleEn: "Rare Teas", descRu: "Коллекционные чаи ограниченного урожая. Выдержанные пуэры, высокогорные улуны, утёсные даньцуны", descEn: "Limited harvest collector teas. Aged pu-erhs, high-mountain oolongs, rock dancongs", items: [
    { nameRu: "Да Хун Пао", nameEn: "Da Hong Pao", descRu: "Утёсы Уишань, весна 2024", descEn: "Wuyi rocks, spring 2024", price: "2 800 ₽", flagship: true },
    { nameRu: "Лао Бань Чжан", nameEn: "Lao Ban Zhang", descRu: "Выдержанный пуэр, 2018", descEn: "Aged pu-erh, 2018", price: "3 600 ₽" },
    { nameRu: "Фэн Хуан Дань Цун", nameEn: "Feng Huang Dan Cong", descRu: "Утёсный одинокий куст, медово-цветочный", descEn: "Rock single bush, honey-floral", price: "2 200 ₽" },
  ]},
  { titleRu: "Церемониальные", titleEn: "Ceremonial", descRu: "Подача по традиции гунфу-ча. Полный ритуал с прогревом посуды и многократными проливами", descEn: "Served in gongfu-cha tradition. Full ritual with vessel warming and multiple infusions", items: [
    { nameRu: "Церемония «Первая встреча»", nameEn: "\"First Meeting\" Ceremony", descRu: "3 сорта, 12 проливов, комментарии мастера", descEn: "3 varieties, 12 infusions, master commentary", price: "4 200 ₽", flagship: true },
    { nameRu: "Церемония «Путь чая»", nameEn: "\"Tea Way\" Ceremony", descRu: "5 сортов, полный ритуал, 90 мин", descEn: "5 varieties, full ritual, 90 min", price: "6 800 ₽" },
  ]},
  { titleRu: "Светлые", titleEn: "Light Teas", descRu: "Белые и зелёные чаи. Нежный вкус, цветочные и травяные ноты", descEn: "White and green teas. Delicate taste, floral and herbal notes", items: [
    { nameRu: "Гёкуро", nameEn: "Gyokuro", descRu: "Теневой японский зелёный, умами", descEn: "Shade-grown Japanese green, umami", price: "2 400 ₽" },
    { nameRu: "Бай Хао Инь Чжэнь", nameEn: "Bai Hao Yin Zhen", descRu: "Серебряные иглы, Фуцзянь", descEn: "Silver needles, Fujian", price: "1 800 ₽" },
    { nameRu: "Лун Цзин", nameEn: "Long Jing", descRu: "Колодец дракона, весенний урожай", descEn: "Dragon Well, spring harvest", price: "1 600 ₽" },
  ]},
  { titleRu: "Тёмные", titleEn: "Dark Teas", descRu: "Красные, чёрные и выдержанные пуэры. Глубокий вкус", descEn: "Red, black and aged pu-erhs. Deep taste", items: [
    { nameRu: "Шу Пуэр «Старое дерево»", nameEn: "Shu Pu-erh \"Old Tree\"", descRu: "Юньнань, 2016, 400-летние деревья", descEn: "Yunnan, 2016, 400-year-old trees", price: "2 600 ₽" },
    { nameRu: "Цимэнь Хун Ча", nameEn: "Qimen Hong Cha", descRu: "Красный чай, медово-шоколадный", descEn: "Red tea, honey-chocolate", price: "1 400 ₽" },
  ]},
  { titleRu: "Сезон", titleEn: "Seasonal", descRu: "Чаи текущего урожая и сезонные купажи", descEn: "Current harvest teas and seasonal blends", items: [
    { nameRu: "Весенний Те Гуань Инь", nameEn: "Spring Tie Guan Yin", descRu: "Аньси, весна 2026", descEn: "Anxi, spring 2026", price: "1 900 ₽", flagship: true },
    { nameRu: "Купаж «Арбат»", nameEn: "\"Arbat\" Blend", descRu: "Авторский сезонный купаж", descEn: "Signature seasonal blend", price: "1 600 ₽" },
  ]},
];

const hookahCategories: MenuCategory[] = [
  { titleRu: "Купажи мастера", titleEn: "Master's Blends", descRu: "Авторские составы шеф-кальянщика. Сложные многослойные миксы", descEn: "Head hookah master's signature blends. Complex multi-layered mixes", items: [
    { nameRu: "Купаж №1 «Арбатский»", nameEn: "Blend #1 \"Arbat\"", descRu: "Пряный, согревающий, с нотами корицы", descEn: "Spicy, warming, with cinnamon notes", price: "3 200 ₽", flagship: true },
    { nameRu: "Купаж №3 «Полночь»", nameEn: "Blend #3 \"Midnight\"", descRu: "Глубокий, дымный, чёрная смородина", descEn: "Deep, smoky, blackcurrant", price: "3 200 ₽", flagship: true },
    { nameRu: "Купаж №5 «Утёс»", nameEn: "Blend #5 \"Rock\"", descRu: "Минеральный, с нотами улунского чая", descEn: "Mineral, with oolong tea notes", price: "3 400 ₽" },
  ]},
  { titleRu: "Моно", titleEn: "Mono", descRu: "Чистый вкус одного сорта табака", descEn: "Pure single-variety tobacco taste", items: [
    { nameRu: "Darkside Core", nameEn: "Darkside Core", price: "2 400 ₽" },
    { nameRu: "Tangiers Noir", nameEn: "Tangiers Noir", price: "2 800 ₽" },
    { nameRu: "Element Earth", nameEn: "Element Earth", price: "2 200 ₽" },
  ]},
  { titleRu: "Дымные церемонии", titleEn: "Smoke Ceremonies", descRu: "Ритуал подачи с элементами чайной церемонии", descEn: "Serving ritual with tea ceremony elements", items: [
    { nameRu: "Церемония «Код»", nameEn: "\"Code\" Ceremony", descRu: "Кальян + чайная пара + сладости, 120 мин", descEn: "Hookah + tea pairing + sweets, 120 min", price: "5 500 ₽", flagship: true },
    { nameRu: "Церемония «1847»", nameEn: "\"1847\" Ceremony", descRu: "Премиум кальян + 3 сорта чая + десерт", descEn: "Premium hookah + 3 tea varieties + dessert", price: "7 800 ₽" },
  ]},
  { titleRu: "Лёгкий дым", titleEn: "Light Smoke", descRu: "Мягкие фруктовые и цветочные композиции", descEn: "Soft fruit and floral compositions", items: [
    { nameRu: "Персик и жасмин", nameEn: "Peach & Jasmine", price: "2 200 ₽" },
    { nameRu: "Манго и маракуйя", nameEn: "Mango & Passionfruit", price: "2 200 ₽" },
  ]},
];

const foodCategories: MenuCategory[] = [
  { titleRu: "Закуски", titleEn: "Appetizers", descRu: "Лёгкие закуски к чаю и кальяну", descEn: "Light appetizers paired with tea and hookah", items: [
    { nameRu: "Сырная тарелка", nameEn: "Cheese Plate", descRu: "Выдержанные сыры, мёд, орехи", descEn: "Aged cheeses, honey, nuts", price: "1 800 ₽" },
    { nameRu: "Фруктовая тарелка", nameEn: "Fruit Plate", descRu: "Сезонные фрукты и ягоды", descEn: "Seasonal fruits and berries", price: "1 400 ₽" },
    { nameRu: "Брускетты", nameEn: "Bruschetta", descRu: "Три вида: лосось, страчателла, авокадо", descEn: "Three kinds: salmon, stracciatella, avocado", price: "1 200 ₽" },
  ]},
  { titleRu: "Десерты", titleEn: "Desserts", descRu: "Авторские десерты к чайной карте", descEn: "Signature desserts for our tea menu", items: [
    { nameRu: "Моти с матча", nameEn: "Matcha Mochi", descRu: "Японские рисовые пирожные", descEn: "Japanese rice cakes", price: "800 ₽" },
    { nameRu: "Чайный тирамису", nameEn: "Tea Tiramisu", descRu: "На основе Те Гуань Инь", descEn: "Tie Guan Yin based", price: "900 ₽" },
  ]},
];

const allCategories: Record<string, MenuCategory[]> = { tea: teaCategories, hookah: hookahCategories, food: foodCategories };

export default function MenuPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("tea");
  const categories = allCategories[activeTab];

  return (
    <>
      <Header />
      <div className="menu-page">
        <DiamondDivider className="phil-visible" />
        <div className="section-title">{t("Карта", "Menu")}</div>
        <div className="section-subtitle" style={{ marginBottom: 40 }}>{t("Полная карта клуба", "Full club menu")}</div>
        <div className="menu-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} className={`menu-tab ${activeTab === tab.id ? "menu-tab-active" : "menu-tab-inactive"}`} onClick={() => setActiveTab(tab.id)}>
              {t(tab.labelRu, tab.labelEn)}
            </button>
          ))}
        </div>
        {categories.map((cat, ci) => (
          <div key={ci} className="menu-category">
            <div className="menu-cat-title">{t(cat.titleRu, cat.titleEn)}</div>
            <div className="menu-cat-desc">{t(cat.descRu, cat.descEn)}</div>
            {cat.items.map((item, ii) => (
              <div key={ii} className="menu-item">
                <div>
                  <div className="menu-item-name">
                    {t(item.nameRu, item.nameEn)}
                    {item.flagship && <span className="flagship-badge">{t("Флагман", "Flagship")}</span>}
                  </div>
                  {item.descRu && <div className="menu-item-desc">{t(item.descRu, item.descEn || "")}</div>}
                </div>
                <div className="menu-item-price">{item.price}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
