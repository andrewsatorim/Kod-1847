#!/bin/bash
set -e

REPO="/root/kod1847-sync/repo"
TARGET_WWW="/var/www/kod1847.ru"
TARGET_PH="/root/kod1847.ru/public_html"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

cd "$REPO"

log "Генерация nav.json из БД..."
node scripts/fetch-nav.mjs

log "Сборка Next.js..."
npm run build

log "rsync -> $TARGET_WWW ..."
rsync -a --delete out/ "$TARGET_WWW/"

log "rsync -> $TARGET_PH ..."
rsync -a --delete out/ "$TARGET_PH/"

log "Готово."
