# Deployment Guide — Mini App CMS Panel

## Automated Deployment (Recommended)

```bash
# From VPS, in the project root:
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Apply SQL migrations to kod1847 database
2. Install npm dependencies (pg, @types/pg)
3. Build the CMS panel
4. Restart PM2 process

## Manual Deployment

### 1. Apply Database Migrations
```bash
psql -h localhost -U postgres -d kod1847 -f admin/migrations/miniapp_001_halls.sql
psql -h localhost -U postgres -d kod1847 -f admin/migrations/miniapp_002_address.sql
psql -h localhost -U postgres -d kod1847 -f admin/migrations/miniapp_003_i18n.sql
```

### 2. Install Dependencies
```bash
cd admin
npm install
```

### 3. Build
```bash
npm run build
```

### 4. Restart Service
```bash
pm2 restart manager
# OR start if not running:
pm2 start npm --name manager -- --prefix admin run dev
```

## Environment Variables

Ensure `.env` in admin folder has:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/kod1847
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Features Added

- **Menu Management**: Categories & items for tea/hookah halls with drag-n-drop order
- **Events**: Create/edit events with date, time, category, capacity
- **Halls**: Manage hall descriptions, addresses, hours in ru/en
- **Translations**: i18n editor for all UI strings
- **Settings**: Read-only view of club address & coordinates

## Access

CMS Panel: `manager.kod1847.ru/dashboard/miniapp`

Dashboard tabs:
- Menu (категории и позиции)
- Events (события)
- Halls (залы)
- Texts (переводы)
- Settings (настройки)
