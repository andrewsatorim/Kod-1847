# Deployment Guide: Supabase → PostgreSQL Migration

## 1. Install PostgreSQL on server (217.114.15.61)

```bash
sudo apt update && sudo apt install -y postgresql-16
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## 2. Create database and user

```bash
sudo -u postgres psql
```

```sql
CREATE USER kod1847 WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE kod1847 OWNER kod1847;
GRANT ALL PRIVILEGES ON DATABASE kod1847 TO kod1847;
\q
```

## 3. Configure PostgreSQL for low RAM (1.9 GB)

Edit `/etc/postgresql/16/main/postgresql.conf`:

```
shared_buffers = 384MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
max_connections = 30
wal_buffers = 8MB
checkpoint_completion_target = 0.9
random_page_cost = 1.1
```

Restart: `sudo systemctl restart postgresql`

## 4. Create tables and seed data

```bash
psql -U kod1847 -d kod1847 -f /path/to/database/schema.sql
psql -U kod1847 -d kod1847 -f /path/to/database/seed.sql
```

## 5. Generate admin password hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_ADMIN_PASSWORD', 10).then(h => console.log(h))"
```

Update the hash in the `users` table:
```sql
UPDATE users SET password_hash = 'HASH_FROM_ABOVE' WHERE email = 'admin@kod1847.ru';
```

## 6. Set environment variables

### Admin panel (`/admin/.env`):
```
DATABASE_URL=postgresql://kod1847:STRONG_PASSWORD_HERE@localhost:5432/kod1847
JWT_SECRET=RANDOM_SECRET_STRING_64_CHARS
```

### Analytics dashboard (`/analytics-dashboard/.env`):
```
DATABASE_URL=postgresql://kod1847:STRONG_PASSWORD_HERE@localhost:5432/kod1847
NEXT_PUBLIC_DASHBOARD_PASSWORD=your-dashboard-password
IIKO_API_LOGIN=99bc25d40d5c4587afec2bcad7794e4e
```

### Main site (`.env`):
```
NEXT_PUBLIC_API_URL=https://manager.kod1847.ru
```

## 7. Install dependencies and build

```bash
cd admin && npm install && npm run build
cd ../analytics-dashboard && npm install && npm run build
cd .. && npm install && npm run build
```

## 8. Restart PM2 processes

```bash
pm2 restart all
# or individually:
pm2 restart manager  # admin panel on port 3002
pm2 restart analytics  # analytics dashboard on port 3001
```

## 9. Nginx config for CORS (if needed)

The admin API handles CORS in the middleware. Ensure nginx proxies pass
the Origin header:

```nginx
location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Origin $http_origin;
}
```

## 10. Migrate existing data from Supabase

Export data from Supabase dashboard (CSV/JSON) and import into PostgreSQL:

```bash
# Example for events table
psql -U kod1847 -d kod1847 -c "\copy events FROM 'events.csv' CSV HEADER"
```

Or use the Supabase SQL editor to export INSERT statements.
