# Deployment Scripts

## Quick Start

```bash
# Standard deployment (production)
./scripts/deploy-miniapp.sh

# With backup & verbose output
./scripts/deploy-miniapp.sh --backup --verbose

# Custom database
./scripts/deploy-miniapp.sh --db-host 10.0.0.5 --db-user admin
```

## Available Scripts

### `scripts/deploy-miniapp.sh` — Full-featured deployment

**Features:**
- ✓ Prerequisites validation (node, npm, psql, PostgreSQL)
- ✓ Database connection test
- ✓ SQL migrations (3 files)
- ✓ npm install with error handling
- ✓ npm build with detailed logs
- ✓ PM2 service restart
- ✓ Optional database backup
- ✓ Detailed logging & error reporting
- ✓ Configurable environment variables

**Usage:**
```bash
./scripts/deploy-miniapp.sh [OPTIONS]
```

**Options:**
```
-h, --help              Show help
-v, --verbose           Verbose output
-b, --backup            Create database backup
-e, --env ENV           Environment (default: production)

Database options:
--db-host HOST          Database host (default: localhost)
--db-port PORT          Database port (default: 5432)
--db-user USER          Database user (default: postgres)
--db-name NAME          Database name (default: kod1847)
--db-password PASS      Database password

Other:
--pm2-name NAME         PM2 app name (default: manager)
```

## Examples

### Basic production deployment
```bash
./scripts/deploy-miniapp.sh
```

### Development with verbose output
```bash
./scripts/deploy-miniapp.sh --env development --verbose
```

### With database backup
```bash
./scripts/deploy-miniapp.sh --backup
```

### Custom remote database
```bash
./scripts/deploy-miniapp.sh \
  --db-host db.example.com \
  --db-user deploy_user \
  --db-password secret123 \
  --verbose
```

### Quick test run
```bash
./scripts/deploy-miniapp.sh --env staging --verbose
```

## Environment Variables

You can also use environment variables instead of CLI arguments:

```bash
export DB_HOST=10.0.0.5
export DB_USER=admin
export DB_PASSWORD=secret
export PM2_APP_NAME=manager

./scripts/deploy-miniapp.sh
```

## What the Script Does

### 1. Validation
- Checks for required commands (node, npm, psql)
- Validates project structure
- Tests database connection

### 2. Database
- Applies 3 SQL migrations in order:
  1. `miniapp_001_halls.sql` — Create halls table
  2. `miniapp_002_address.sql` — Create address table
  3. `miniapp_003_i18n.sql` — Create translations table

### 3. Build
- `npm install` — Install pg and @types/pg packages
- `npm run build` — Build Next.js application

### 4. Service
- Restarts PM2 app: `pm2 restart manager`
- Or shows instructions if PM2 not configured

### 5. Logs
- Saves build logs to `/tmp/npm_*.log`
- Shows errors with context
- Verbose mode displays all operations

## Error Handling

Script exits on first error. Common issues:

```
✗ Required command not found: psql
→ Solution: Install PostgreSQL client
  apt-get install postgresql-client  # Ubuntu/Debian
  brew install postgresql             # macOS

✗ Cannot connect to database
→ Solution: Check DATABASE_URL, credentials, network access
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME

✗ npm install failed
→ Check: /tmp/npm_install.log for details
  Node version compatibility, network issues, disk space

✗ Build failed
→ Check: /tmp/npm_build.log for details
  TypeScript errors, missing files, configuration issues
```

## Rollback

If deployment fails:

```bash
# Check PM2 logs
pm2 logs manager

# Restart previous version
pm2 restart manager

# If database was backed up
psql -U postgres -d kod1847 < backups/miniapp_*/db_dump.sql
```

## Verification

After successful deployment:

```bash
# Check service status
pm2 status

# Check logs
pm2 logs manager

# Test API endpoints
curl http://localhost:3001/api/cms/miniapp/halls
curl http://localhost:3001/api/cms/miniapp/events

# Access CMS
# https://manager.kod1847.ru/dashboard/miniapp
```

## Scheduling Deployments

### Cron job (daily at 2 AM)
```cron
0 2 * * * /home/user/Kod-1847/scripts/deploy-miniapp.sh --backup >> /var/log/miniapp-deploy.log 2>&1
```

### Using at (one-time)
```bash
echo '/home/user/Kod-1847/scripts/deploy-miniapp.sh --backup' | at 3:00 PM
```

## Troubleshooting

### Permission denied
```bash
chmod +x scripts/deploy-miniapp.sh
```

### Database errors
```bash
# Test connection manually
psql -h localhost -U postgres -d kod1847 -c "SELECT 1;"

# Check user permissions
psql -U postgres -c "GRANT ALL ON DATABASE kod1847 TO postgres;"
```

### PM2 not found
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### Build failed with TypeScript errors
```bash
# Check Node version (should be 16+)
node --version

# Clean and rebuild
cd admin
rm -rf .next node_modules
npm install
npm run build
```

## Support

- Check logs: `pm2 logs manager`
- Build output: `/tmp/npm_build.log`
- Database migrations: `admin/migrations/`
- Deployment docs: `DEPLOY.md`
