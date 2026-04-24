#!/bin/bash
set -e

echo "🚀 Deploying Mini App CMS Panel..."

# Database config (adjust if needed)
DB_NAME="${DB_NAME:-kod1847}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Step 1: Apply migrations
echo "📦 Applying database migrations..."
for migration in admin/migrations/miniapp_*.sql; do
    if [ -f "$migration" ]; then
        echo "  → $(basename $migration)"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration" > /dev/null 2>&1
    fi
done
echo "✓ Migrations applied"

# Step 2: Install & build
echo "📥 Installing dependencies..."
cd admin
npm install > /dev/null 2>&1
echo "✓ Dependencies installed"

echo "🔨 Building..."
npm run build > /dev/null 2>&1
echo "✓ Build complete"

# Step 3: Restart
echo "🔄 Restarting service..."
cd ..
pm2 restart manager 2>/dev/null || echo "⚠ PM2 not running, please start manually"

echo "✅ Deployment complete!"
echo "📍 Access: manager.kod1847.ru/dashboard/miniapp"
