# КОД 1847 — Бриф проекта для новой сессии

## 1. О проекте

Чайный и кальянный клуб **КОД 1847** в Москве. Закрытый формат «по рекомендации». Продукты проекта:

| Сайт | Назначение | Технология |
|---|---|---|
| `kod1847.ru` | Публичный сайт: главная, чайный/кальянный залы, меню, партнёрство, клуб, мероприятия, юридические страницы, формы бронирования | Next.js 15, **static export**, деплой статикой на Beget |
| `manager.kod1847.ru` | Админ-панель: CRUD контента + заявки с отметкой визита + iiko-интеграция | Next.js 15, PM2 (порт 3002), Beget |
| `analytics.kod1847.ru` | Аналитика трафика, заявок и выручки из iiko | Next.js 15, PM2 (порт 3001), Beget |

## 2. Ключевое требование — 152-ФЗ

Все персональные данные гостей и бронирования **должны храниться только на территории РФ**. Supabase (США/ЕС) — **нельзя**. Миграция с Supabase на локальный PostgreSQL на сервере Beget уже выполнена.

## 3. Инфраструктура Beget

- **IP:** `217.114.15.61`
- **OS:** Ubuntu 24.04, RAM 1.9 ГБ + 2 ГБ swap
- **Доступ:** root по SSH, пароль — у заказчика (в Termius)
- **PostgreSQL 16** на `127.0.0.1:5432`, БД `kod1847`, владелец `kod1847`
- **PM2 процессы:**
  - `manager` (pid ~11271) → `/var/www/manager.kod1847.ru`
  - `analytics` (pid ~9898) → `/var/www/analytics.kod1847.ru`
- **Статика сайта:** `/var/www/kod1847.ru`
- **Клон репо для синка:** `/root/kod1847-sync/repo`
- **nginx** проксирует `manager.*` на `:3002`, `analytics.*` на `:3001`, `kod1847.ru` — как static root

### Переменные окружения (в `.env.local` каждого приложения, в git не хранятся)
```
# manager (/var/www/manager.kod1847.ru/.env.local)
DATABASE_URL=postgresql://kod1847:<пароль>@localhost:5432/kod1847
JWT_SECRET=<секрет>
IIKO_API_LOGIN=<ключ>        # если переопределяем hardcoded
IIKO_ORG_ID=<uuid>           # опц., автодискавер если пусто

# analytics (/var/www/analytics.kod1847.ru/.env.local)
DATABASE_URL=postgresql://kod1847:<пароль>@localhost:5432/kod1847
NEXT_PUBLIC_DASHBOARD_PASSWORD=kod1847admin   # TODO: убрать NEXT_PUBLIC_, сделать серверную авторизацию

# сайт (build-time)
NEXT_PUBLIC_API_URL=https://manager.kod1847.ru
```

## 4. Репозиторий

- GitHub: `andrewsatorim/Kod-1847`
- **Основная ветка для работы:** `claude/request-cards-with-details-dCgjA` (последнее состояние карточек заявок)
- **Базовая ветка миграции:** `claude/migrate-supabase-postgresql-WGcrC` (куда вливался PG-код)
- `main` — устаревшая версия с Supabase, в проде не используется

### Структура репо
```
/                               — статический сайт kod1847.ru
  src/app/                      — страницы (club, events, tea-room, hookah-room, …)
  src/components/               — Header, Footer, ReservationModal, …
  src/lib/
    analytics.ts                — трекинг pageviews/events
    phone.ts                    — маска/валидация/нормализация телефона
/admin                          — manager.kod1847.ru
  src/app/api/                  — /auth, /reservations, /public, /events, /menu-*, /stats, …
  src/app/dashboard/            — /, /reservations (НОВАЯ), /events, /menu, …
  src/components/Sidebar.tsx
  src/lib/{db.ts,auth.ts,phone.ts,types.ts}
  src/middleware.ts             — JWT-guard для /api/*, пропуск /api/public/* и /api/auth/login
/analytics-dashboard            — analytics.kod1847.ru
  src/app/api/{analytics,iiko,reservations}
  src/components/*Tab.tsx       — Overview/Pages/Bookings/Clicks/Devices/Sources/Iiko
  src/lib/{db.ts,queries.ts,iiko.ts,iiko-queries.ts}
/database
  schema.sql                    — полная схема PG
  seed.sql                      — стартовые данные
  migrate-from-supabase.js      — одноразовый скрипт миграции
  migrations/
    001_reservations_enhancements.sql  — добавляет поля карточек заявок
```

## 5. База данных `kod1847` — таблицы

```
analytics_events       analytics_pageviews    analytics_sessions
club_events            contacts               events
menu_categories        menu_items             partnership_formats
reservations           texts                  users
```

### Таблица `reservations` (текущая структура после миграции 001)
```
id              SERIAL PK
name            VARCHAR(255)  — имя гостя
phone           VARCHAR(50)   — всегда +7XXXXXXXXXX (нормализовано)
date            VARCHAR(50)   — YYYY-MM-DD
time            VARCHAR(10)   — HH:MM
guests          VARCHAR(20)
comment         TEXT          — комментарий гостя
consent         BOOLEAN       — согласие на обработку ПДн
source          VARCHAR(100)  — '/', '/tea-room', 'events', 'club_membership', …
event_name      VARCHAR(255)  — название мероприятия (для source=events)
visited         VARCHAR(20)   — 'pending'|'came'|'no_show'|'cancelled'
manager_note    TEXT          — внутренняя заметка менеджера
iiko_id         VARCHAR(255)
iiko_status     VARCHAR(50)   — 'success'|'error'|<iiko-статус>
iiko_error      TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ   — auto via trigger
```

Триггер `reservations_touch_updated_at` обновляет `updated_at` при любом UPDATE. Индексы на `created_at DESC`, `visited`, `source`.

## 6. Что сделано в текущей ветке `claude/request-cards-with-details-dCgjA`

### Сайт kod1847.ru — формы
- `ReservationModal.tsx`, `/club/page.tsx`, `/events/page.tsx` — все поля через `useState`, реальный POST на `${NEXT_PUBLIC_API_URL}/api/public/reservations`
- Маска телефона `+7 (999) 123-45-67` (`src/lib/phone.ts`)
- Поле **время** (type=time) в ReservationModal — рядом с датой через CSS `.modal-field-row`
- Прокидываются `source`, `event_name`, `time` в payload

### manager.kod1847.ru
- `/api/public/reservations` (POST) — сервер нормализует телефон через `admin/src/lib/phone.ts`, пишет все новые поля, вызывает iiko createCustomer + createReserve, сохраняет `iiko_id`/`iiko_status`/`iiko_error`
- **Новые эндпоинты** (все под JWT middleware):
  - `GET /api/reservations?visited=&source=&from=&to=&limit=`
  - `GET /api/reservations/[id]`
  - `PATCH /api/reservations/[id]` — `{visited?, manager_note?}`
  - `DELETE /api/reservations/[id]`
  - `POST /api/reservations/sync-iiko` — подтягивает статусы из iiko по `iiko_id`, мапит `Closed/Started→came`, `NoShow→no_show`, `Cancelled→cancelled`
- `/api/stats` — добавлены `reservations` и `reservationsPending`
- Sidebar: новый пункт «Заявки» с иконкой ticket
- `/dashboard/reservations/page.tsx` — страница с карточками:
  - свёрнутый вид: гость, телефон, дата+время, гостей, источник, бейдж статуса
  - раскрытый: комментарий, согласие, iiko-данные, заметка менеджера (редактируемая), кнопки статуса, удаление
  - фильтр по статусу со счётчиками
  - кнопка «Синхронизировать с iiko»
- Обзор `/dashboard` — карточка «Заявки (ожидают)» подсвечивается, если есть необработанные

### analytics.kod1847.ru
- `/api/reservations` (GET, читает локальную PG, фильтры from/to/visited/source/limit)
- `queries.ts` — тип `ReservationItem`, `getReservations(range)`
- `BookingsTab.tsx` — новый блок «Список заявок» с карточками (режим только чтение, без кнопок)

### Типы
- `admin/src/lib/types.ts` → `Reservation`, `VisitedStatus`
- `analytics-dashboard/src/lib/queries.ts` → `ReservationItem`, `VisitedStatus`

## 7. Актуальная задача: завершение деплоя

**Миграция БД и деплой manager прошли.** Analytics — **не задеплоена** (rsync упал на неверном пути, собрался старый код без `/api/reservations`).

### Команды для завершения деплоя analytics:
```bash
cd /root/kod1847-sync/repo
git pull origin claude/request-cards-with-details-dCgjA

# Миграция БД (если ещё не накатили)
sudo -u postgres psql -d kod1847 -f database/migrations/001_reservations_enhancements.sql
sudo -u postgres psql -d kod1847 -P pager=off -c "\d reservations" | head -20

# Analytics — правильный source path
rsync -av --delete \
  --exclude=node_modules --exclude=.next --exclude='.env*' \
  /root/kod1847-sync/repo/analytics-dashboard/ \
  /var/www/analytics.kod1847.ru/

cd /var/www/analytics.kod1847.ru
npm install
npm run build
pm2 restart analytics

# Проверка: в выводе build должна быть строка
# ƒ /api/reservations   146 B   102 kB
```

### Статический сайт (сборка + rsync на Beget)
Сборка статики делается **локально** или в CI и копируется в `/var/www/kod1847.ru/`. На Beget исходников сайта нет — только собранная статика. Перед сборкой убедиться что в `.env.local` корня `NEXT_PUBLIC_API_URL=https://manager.kod1847.ru`.

## 8. Известные нерешённые проблемы (TODO по приоритету)

### Безопасность
1. **`NEXT_PUBLIC_DASHBOARD_PASSWORD` в клиентском бандле аналитики** — любой видит пароль в Chrome DevTools. Нужно: серверный роут `/api/auth/login` с cookie+JWT, как в manager. Убрать NEXT_PUBLIC-переменную.
2. **iiko API-логин захардкожен** в `/api/public/reservations/route.ts` и `/api/iiko/route.ts` — перенести в `.env.local` (`IIKO_API_LOGIN`), оставить hardcoded только как fallback для dev.
3. Проверить CORS в `middleware.ts` — разрешены `kod1847.ru`, `localhost`, `127.0.0.1`. Убедиться что `analytics.kod1847.ru` может дёргать `manager.kod1847.ru/api/public/*` (если надо) или что это не требуется.

### Функциональность
4. **Автоматическая синхронизация статусов iiko** — сейчас ручная (кнопка). Желательно cron раз в час: `curl -X POST http://localhost:3002/api/reservations/sync-iiko` (с JWT или service-token). Или `node-cron` внутри manager-процесса.
5. **Уведомления о новых заявках** — Telegram-бот или email менеджеру при INSERT в reservations (триггер на БД → NOTIFY → слушатель в manager).
6. **Пагинация списка заявок** — сейчас LIMIT 200/500, без offset и UI-пагинации. При росте объёма нужна.
7. **Экспорт заявок в CSV/Excel** — менеджеры часто просят.
8. **Статистика по conversion по source** — сейчас `/api/analytics/booking-sources` считает по `metadata.source` из `analytics_events`, а новая колонка `reservations.source` не используется в аналитике. Синхронизировать.
9. **`source` для формы со страницы tea-room/hookah-room** — сейчас отправляется `window.location.pathname` (`/tea-room`, `/hookah-room`). Уже работает корректно.

### Инфраструктура
10. **Резервное копирование PostgreSQL** — настроить `pg_dump` по cron на внешнее хранилище (S3 / Timeweb Cloud).
11. **Мониторинг** — PM2+Prometheus/Grafana или хотя бы PM2+email-алерты при падении.
12. **Git-синхронизация прода** — рабочий процесс сейчас ручной (rsync из клона). По-хорошему: CI/CD через GitHub Actions с SSH деплоем или webhook.
13. **Сертификаты SSL** — проверить автопродление Let's Encrypt для трёх доменов.
14. **Логи Node-приложений** — PM2 лог-ротация `pm2 install pm2-logrotate`.

### UX
15. **Карточки заявок — сортировка и поиск** по имени/телефону/дате.
16. **Редактирование заявки в админке** — сейчас можно менять только visited и manager_note. По просьбе менеджера — иногда нужно поправить имя/телефон/дату.
17. **Ошибка iiko в UI заявки** — показывать человечески, не raw JSON. Например, «iiko отверг: номер телефона некорректен» вместо полного dump'а.
18. **Локализация интерфейса админки** — сейчас только русский. Если нужен английский — i18n.
19. **Адаптив страницы заявок** — проверить на iPad/iPhone (менеджеры могут пользоваться с мобильного).

### Данные
20. **Миграция старых заявок из `analytics_events.event_type='booking_submit'`** — если в старых записях лежат данные, их стоит перенести в `reservations` (через `metadata` можно вытащить source, но не имя/телефон — их там и не было).

## 9. Команды первой помощи для новой сессии

```bash
# Статус всего
ssh root@217.114.15.61
systemctl status postgresql --no-pager
pm2 list
sudo -u postgres psql -d kod1847 -P pager=off -c "\dt"
sudo -u postgres psql -d kod1847 -P pager=off -c "SELECT COUNT(*) FROM reservations;"
sudo ss -tnp 2>/dev/null | grep -E "node|next" | awk '{print $5}' | sort -u

# Обновить репо и задеплоить
cd /root/kod1847-sync/repo && git pull
# … rsync'ы см. выше …
```

## 10. Credentials / секреты

**НЕ коммитить в git.** Хранятся в `.env.local` на сервере:
- Пароль PostgreSQL `kod1847` пользователя
- `JWT_SECRET` manager
- `IIKO_API_LOGIN`

Пароль root SSH — у заказчика в Termius.
