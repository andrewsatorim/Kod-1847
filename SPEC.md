# КОД 1847 — Спецификация проекта

> Версия: 1.0 · Дата: 2026-04-20  
> Репозитории: `andrewsatorim/kod-1847` (код) + `andrewsatorim/appkod1847` (дизайн / бренд-активы)  
> Ветка разработки: `claude/create-project-spec-kKEvl`

---

## 1. Контекст и назначение

«Код 1847» — закрытый членский чайный клуб на Арбате (Москва). Оператор — ООО «РАНИКО» (ИНН 7743340610, ОГРН 1207700189575). Продукт состоит из:

1. **Публичный сайт** (`kod1847.ru`) — двуязычный (RU/EN) лендинг + внутренние страницы залов, меню, мероприятий и юридических документов. Основная конверсия — форма бронирования.
2. **Админ-панель** — CRM-подобный UI для редактирования контента сайта (мероприятия, меню, тексты, контакты, форматы партнёрства).
3. **Аналитический дашборд** — внутренний сервис с метриками посещаемости, бронирований, кликов и интеграцией с кассовой системой iiko.

Дизайн-система и брендбук (PDF) находятся в `andrewsatorim/appkod1847` вместе с архивом `Kod1847.zip` (готовые макеты — источник правды для вёрстки публичного сайта).

---

## 2. Стек и инфраструктура

| Слой | Технология |
|---|---|
| Frontend (3 приложения) | Next.js 15–16 · React 19 · TypeScript · Tailwind v4 (публичный сайт + админка) / Tailwind v3 (дашборд) |
| Локализация | `next-intl` + внутренний `LanguageContext` (RU/EN-переключатель) |
| Анимации | `framer-motion`, кастомный Canvas-фон, CSS-анимации |
| Backend / БД | Supabase (Postgres + Auth + REST) |
| Аналитика | Собственная трекинг-библиотека (`src/lib/analytics.ts`), Яндекс.Метрика подключается только после согласия на cookie |
| Интеграции | iiko Cloud API (R&D на стороне дашборда) |
| Хостинг | Vercel (сайт, админка, дашборд) — `vercel.json` в корне каждого приложения |
| Дизайн-активы | `Kod1847.zip`, `KOD1847_брендбук_и_айдентика_final.pdf`, SVG-лого |

### Структура монорепо `kod-1847`
```
/                         ← публичный сайт (Next.js, порт 3000)
├── src/app/              ← routes (App Router)
├── src/components/       ← UI-компоненты сайта
├── src/context/          ← LanguageContext (RU/EN)
├── src/lib/              ← supabase + analytics
├── public/               ← изображения, PDF-меню, favicon
├── admin/                ← админ-панель (Next.js, порт 3001)
└── analytics-dashboard/  ← аналитический дашборд (Next.js, порт 3001)
```

---

## 3. Дизайн-система

### 3.1 Палитра
| Токен | HEX | Применение |
|---|---|---|
| Antique Gold | `#B89860` | акценты, CTA, бордеры, hover |
| Ink Black | `#08080A` | основной фон |
| Warm Stone | `#9A958B` | вторичный текст, placeholder |
| Aged Linen | `#F5F0E8` | текст на тёмном, светлые поверхности |

### 3.2 Типографика
- **Playfair Display** — H1–H3 на кириллице;
- **Bodoni Moda** — латиница и цифры (числа, года, Est. 1847);
- **Raleway** — body, функциональный текст, микрокопи, FAQ, **все цифры на юридических страницах**.

### 3.3 Тональность
Современная, без архаизмов. Стоп-слова: VIP, элитный, элитарный, лакшери, luxury, эксклюзив, эксклюзивный, изысканный, благородный, таинственный. **Запрещены везде**, включая alt, aria-label, og:description.

### 3.4 Узкая колонка
Основной текст — `max-width ~640px`, основная вёрстка — узкие камерные блоки с диамант-разделителями (`DiamondDivider`).

---

## 4. Карта сайта и маршруты

### 4.1 Публичный сайт
| Путь | Страница | Источник контента |
|---|---|---|
| `/` | Главная: Hero + Philosophy + RoomPreviews + MenuPreview + EventsPreview + PartnershipPreview + Contact + Footer | `page.tsx`, Supabase tables |
| `/club` | О клубе (детально) | Supabase `texts` |
| `/tea-room` | Чайный зал (контент финален — см. `rooms.md`) | статичный |
| `/hookah-room` | Кальянная комната (контент финален — см. `rooms.md`) | статичный |
| `/menu` | Меню (вкладки: чай / кальян / еда) + PDF-меню в `/public` | Supabase `menu_categories`, `menu_items` |
| `/events` | Календарь мероприятий | Supabase `events` |
| `/partnership` | Партнёрские форматы + клубные события | Supabase `partnership_formats`, `club_events` |
| `/privacy` | Политика конфиденциальности | статичный |
| `/terms` | Пользовательское соглашение | статичный |
| `/offer` | Публичная оферта | статичный |
| `/cookies` | Политика cookies | статичный |
| `/consent` | Справочное согласие на ПДн | статичный |

Все юридические страницы: `<meta name="robots" content="noindex, nofollow">`, `lang="ru"`, цифры в Raleway.

### 4.2 Админ-панель (`admin/`)
- `/login` — вход (Supabase Auth)
- `/dashboard` — Обзор (агрегированные счётчики по таблицам)
- `/dashboard/events` — CRUD мероприятий
- `/dashboard/menu` — категории и позиции меню
- `/dashboard/partnership` — форматы партнёрства + клубные события
- `/dashboard/contacts` — контакты (key/value)
- `/dashboard/texts` — текстовые блоки

### 4.3 Дашборд аналитики (`analytics-dashboard/`)
Вкладки: Overview · Pages · Sources · Devices · Bookings · Clicks · Iiko. Защита — пароль (`DASHBOARD_PASSWORD`). API-роут `/api/iiko` проксирует обращения к iiko Cloud.

---

## 5. Модель данных (Supabase)

### 5.1 Контент-таблицы (админка)
```ts
events            (id, day, month_ru, month_en, name_ru, name_en, desc_ru, desc_en, time, tag_ru, tag_en, sort_order, is_active, created_at)
menu_categories   (id, tab: 'tea'|'hookah'|'food', title_ru, title_en, desc_ru, desc_en, sort_order)
menu_items        (id, category_id, name_ru, name_en, desc_ru, desc_en, is_flagship, sort_order)
partnership_formats (id, num, title_ru, title_en, points_ru[], points_en[], suit_ru, suit_en, sort_order)
club_events       (id, name_ru, name_en, desc_ru, desc_en, detail_ru, detail_en, sort_order)
contacts          (id, key, value_ru, value_en)
texts             (id, key, value_ru, value_en)
```
Все мультиязычные поля дублируются суффиксами `_ru` / `_en`.

### 5.2 Аналитические таблицы
```ts
analytics_sessions  (session_id, device, browser, pages_viewed, max_scroll_depth, duration, created_at)
analytics_pageviews (page, referrer, device, browser, screen_width, session_id, created_at)
analytics_events    (event_type, page, metadata jsonb, session_id, created_at)
```

Ключевые event_type: `click_reserve`, `booking_submit`, `time_on_page`, `scroll_depth`, плюс кастомные клики.

---

## 6. Ключевые фичи

### 6.1 Hero (главная)
- Canvas-фон + плавающие частицы + параллакс по движению мыши и `DeviceOrientation`;
- Логотип и лого-mark (SVG), лок-ап «КОД 1847», «Москва · Арбат · Est. 1847»;
- RU/EN тумблер;
- CTA «Забронировать визит» → открывает `ReservationModal`.

### 6.2 ReservationModal
Поля: имя, телефон, дата, кол-во гостей, комментарий. Обязательный чекбокс согласия на ПДн (не предзаполнен), кнопка `disabled` пока чекбокс снят. На submit — `trackEvent("booking_submit")`.

### 6.3 CookieBanner
- Фиксированный бандер снизу, появляется при первом визите;
- Два действия: «Принять» / «Отклонить»;
- Срок согласия — 12 месяцев (`localStorage.cookie_consent`, `cookie_consent_date`);
- Яндекс.Метрика подключается **динамически только после «Принять»**. Никакой аналитики в `<head>`.

### 6.4 Локализация
`LanguageContext` + хелпер `t(ru, en)`. Состояние языка — `localStorage`. Используется во всех компонентах сайта (`useLang`).

### 6.5 Собственная аналитика
`src/lib/analytics.ts` — устойчиво к отсутствию Supabase (no-op если env не задано), keepalive-запросы на `beforeunload`/`visibilitychange`, глубина скролла, длительность на странице, устройство/браузер/ширина экрана.

---

## 7. Юридический контур (152-ФЗ, 149-ФЗ, Роскомнадзор 2026)

Источник требований: `TZ_Legal_Documents_Kod1847.md` (уже реализован частично — `CookieBanner`, Footer с реквизитами, чекбокс в `ReservationModal`, страницы `/privacy`, `/terms`, `/offer`, `/cookies`, `/consent`).

Остаточные задачи:
- [ ] Вставить реальный номер счётчика Яндекс.Метрики (заглушка `XXXXXXXX`).
- [ ] Проверить, что на всех публичных страницах подключён `CookieBanner`.
- [ ] Убедиться, что ни Google Analytics, ни Meta Pixel не попали в билд.
- [ ] Хостинг должен быть российским (Beget — согласно ТЗ; текущий деплой на Vercel — обсудить с заказчиком).
- [ ] Добавить второй чекбокс (согласие с офертой) при появлении онлайн-оплаты.

---

## 8. Контентные гарантии (из `rooms.md`)

Тексты `/tea-room` и `/hookah-room` — **финальны и согласованы**. При вёрстке их переписывать запрещено. Каждая страница должна содержать:
1. Hero-лид (одно предложение, Playfair Display).
2. Основной текст — 4 абзаца, max-width 640px.
3. Блок «Что входит в сессию» — список с золотыми маркерами.
4. Одну CTA-кнопку со строго заданным текстом.
5. Аккордеон FAQ из 7 вопросов (первый открыт по умолчанию).
6. Два `<script type="application/ld+json">` в `<head>`: `Place` + `FAQPage`.

---

## 9. Интеграции

### 9.1 Supabase
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — единый проект для сайта, админки и дашборда. Доступ ограничивается RLS-политиками (ожидается на стороне Supabase).

### 9.2 iiko Cloud
На стороне аналитического дашборда: `analytics-dashboard/src/lib/iiko.ts`, `iiko-queries.ts`, API-роут `/api/iiko`. Подключение опционально (можно захардкодить), организация определяется автоматически. Выводит операционные метрики ресторана (продажи, чеки).

---

## 10. Деплой и окружения

- **Публичный сайт**: Vercel, root `.`
- **Админка**: Vercel, root `admin/`, порт dev 3001
- **Дашборд**: Vercel, root `analytics-dashboard/`, порт dev 3001

Prebuild сайта копирует JPEG/PDF из корня в `public/` (см. `package.json#prebuild`).

Переменные окружения:
```
# site
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# analytics-dashboard
DASHBOARD_PASSWORD
NEXT_PUBLIC_IIKO_API_LOGIN          (опционально)
NEXT_PUBLIC_IIKO_ORGANIZATION_ID    (опционально)
```

---

## 11. Текущий статус и открытые задачи

**Готово**
- Информационная архитектура публичного сайта, все основные компоненты (Header, Hero, Philosophy, RoomPreviews, MenuPreview, EventsPreview, PartnershipPreview, Contact, Footer, ReservationModal, CookieBanner, CanvasBackground, DiamondDivider, Gallery, Halls, LogoSVG, BackButton, Analytics).
- RU/EN тумблер, модалка бронирования с согласием на ПДн, cookie-баннер, футер с реквизитами.
- Структура Supabase под контент и аналитику, админ-панель с CRUD по всем сущностям, страница логина.
- Аналитический дашборд с вкладками Overview/Pages/Sources/Devices/Bookings/Clicks/Iiko и прокси-роутом к iiko.

**Открыто / требует подтверждения**
1. Интеграция финальных макетов из `appkod1847/Kod1847.zip` с текущей вёрсткой — провести диф-ревью по каждой странице.
2. Реальный номер счётчика Яндекс.Метрики, реальный адрес клуба на Арбате (сейчас в schema.org — «ул. Арбат» без номера), реальные обложки (`/images/tea-room-cover.jpg`, `/images/hookah-room-cover.jpg`).
3. Принять решение: остаёмся на Vercel или переезжаем на Beget (требование ТЗ по юридическому контуру).
4. Отправка форм бронирования — сейчас `booking_submit` только трекается аналитикой; нужен реальный канал (email/Telegram/CRM).
5. RLS-политики в Supabase для публичного чтения контент-таблиц и приватной записи в аналитические.
6. Покрытие `sitemap.xml` и `robots.txt` (юридические — `noindex`).

---

## 12. Правила работы с кодом

1. Не переписывать финальные тексты из `rooms.md` и юридических документов.
2. Не добавлять запрещённые стоп-слова.
3. Сохранять маршруты `/tea-room` и `/hookah-room` как есть — они зашиты в навигации и schema.org.
4. Новые формы с ПДн → обязательный чекбокс по образцу `ReservationModal`.
5. Новые аналитические события добавлять через `trackEvent(type, metadata)` в `src/lib/analytics.ts`.
6. Новые контент-таблицы → параллельно обновлять `admin/src/lib/types.ts` и UI админки.
