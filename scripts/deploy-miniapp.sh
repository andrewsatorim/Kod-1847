#!/bin/bash

################################################################################
# Mini App CMS Panel Deployment Script
# Automates: migrations → npm install → build → restart
################################################################################

set -e  # Exit on error

# ============================================================================
# COLORS & FORMATTING
# ============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# ============================================================================
# CONFIG
# ============================================================================
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADMIN_DIR="$PROJECT_ROOT/admin"
MIGRATIONS_DIR="$ADMIN_DIR/migrations"

# Database
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-kod1847}"
DB_PASSWORD="${DB_PASSWORD:-}"

# PM2
PM2_APP_NAME="${PM2_APP_NAME:-manager}"
PM2_ECOSYSTEM="${PM2_ECOSYSTEM:-ecosystem.config.js}"

# Environment
ENV="${ENV:-production}"
VERBOSE="${VERBOSE:-0}"

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================
log_header() {
    echo -e "\n${BOLD}${BLUE}>>> $1${NC}"
}

log_step() {
    echo -e "${YELLOW}▪ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

verbose_log() {
    if [ "$VERBOSE" = "1" ]; then
        echo -e "${BLUE}  $1${NC}"
    fi
}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Required command not found: $1"
        return 1
    fi
}

check_file() {
    if [ ! -f "$1" ]; then
        log_error "File not found: $1"
        return 1
    fi
}

check_dir() {
    if [ ! -d "$1" ]; then
        log_error "Directory not found: $1"
        return 1
    fi
}

# ============================================================================
# MAIN DEPLOYMENT FLOW
# ============================================================================

main() {
    echo -e "${BOLD}${BLUE}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║        Mini App CMS Panel Deployment Script               ║
║                    v1.0                                   ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # Check prerequisites
    log_header "Checking Prerequisites"
    check_prerequisites || exit 1

    # Backup (optional)
    if [ "$BACKUP" = "1" ]; then
        log_header "Creating Backup"
        create_backup || exit 1
    fi

    # Apply migrations
    log_header "Database Migrations"
    apply_migrations || exit 1

    # Install dependencies
    log_header "Installing Dependencies"
    install_dependencies || exit 1

    # Build
    log_header "Building CMS Panel"
    build_admin || exit 1

    # Restart service
    log_header "Restarting Service"
    restart_service || exit 1

    # Summary
    log_header "Deployment Complete!"
    print_summary
}

# ============================================================================
# PREREQUISITE CHECKS
# ============================================================================

check_prerequisites() {
    log_step "Checking required commands..."

    check_command "node" || return 1
    verbose_log "✓ node: $(node --version)"

    check_command "npm" || return 1
    verbose_log "✓ npm: $(npm --version)"

    check_command "psql" || {
        log_error "PostgreSQL client (psql) not found. Install it to apply migrations."
        return 1
    }
    verbose_log "✓ psql: $(psql --version | head -1)"

    log_step "Checking project structure..."
    check_dir "$PROJECT_ROOT" || return 1
    check_dir "$ADMIN_DIR" || return 1
    check_dir "$MIGRATIONS_DIR" || return 1
    verbose_log "✓ Project structure valid"

    log_step "Checking database connection..."
    test_db_connection || {
        log_error "Cannot connect to database $DB_NAME@$DB_HOST:$DB_PORT"
        return 1
    }
    verbose_log "✓ Database connection OK"

    log_success "All prerequisites met"
    return 0
}

test_db_connection() {
    if [ -z "$DB_PASSWORD" ]; then
        PGPASSWORD="" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
            -c "SELECT 1;" > /dev/null 2>&1
    else
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
            -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1
    fi
}

# ============================================================================
# DATABASE MIGRATIONS
# ============================================================================

apply_migrations() {
    migrations=(
        "$MIGRATIONS_DIR/miniapp_001_halls.sql"
        "$MIGRATIONS_DIR/miniapp_002_address.sql"
        "$MIGRATIONS_DIR/miniapp_003_i18n.sql"
    )

    for migration in "${migrations[@]}"; do
        if [ ! -f "$migration" ]; then
            log_error "Migration not found: $migration"
            return 1
        fi

        local name=$(basename "$migration")
        log_step "Applying $name..."

        if [ -z "$DB_PASSWORD" ]; then
            PGPASSWORD="" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
                -d "$DB_NAME" -f "$migration" > /dev/null 2>&1
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" \
                -U "$DB_USER" -d "$DB_NAME" -f "$migration" > /dev/null 2>&1
        fi

        if [ $? -eq 0 ]; then
            log_success "Applied $name"
        else
            log_error "Failed to apply $name"
            return 1
        fi
    done

    return 0
}

# ============================================================================
# DEPENDENCIES & BUILD
# ============================================================================

install_dependencies() {
    log_step "Installing npm dependencies..."
    cd "$ADMIN_DIR"

    if npm install > /tmp/npm_install.log 2>&1; then
        log_success "Dependencies installed"
        cd "$PROJECT_ROOT"
        return 0
    else
        log_error "npm install failed"
        verbose_log "Log:"
        cat /tmp/npm_install.log | sed 's/^/  /'
        cd "$PROJECT_ROOT"
        return 1
    fi
}

build_admin() {
    log_step "Running npm run build..."
    cd "$ADMIN_DIR"

    if npm run build > /tmp/npm_build.log 2>&1; then
        log_success "Build successful"
        cd "$PROJECT_ROOT"
        return 0
    else
        log_error "Build failed"
        verbose_log "Last 20 lines of build log:"
        tail -20 /tmp/npm_build.log | sed 's/^/  /'
        cd "$PROJECT_ROOT"
        return 1
    fi
}

# ============================================================================
# SERVICE RESTART
# ============================================================================

restart_service() {
    log_step "Checking PM2..."

    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 not found. Install with: npm install -g pm2"
        log_info "Service restart skipped. Please restart manually or use PM2."
        return 0
    fi

    log_step "Restarting PM2 app: $PM2_APP_NAME..."

    # Try to restart existing app
    if pm2 list | grep -q "$PM2_APP_NAME"; then
        if pm2 restart "$PM2_APP_NAME" > /dev/null 2>&1; then
            log_success "PM2 app restarted: $PM2_APP_NAME"
            return 0
        else
            log_error "Failed to restart PM2 app"
            return 1
        fi
    else
        log_info "PM2 app '$PM2_APP_NAME' not running"
        log_info "To start it: pm2 start ecosystem.config.js"
        return 0
    fi
}

# ============================================================================
# BACKUP
# ============================================================================

create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$PROJECT_ROOT/backups/miniapp_$timestamp"

    log_step "Creating backup in $backup_dir..."
    mkdir -p "$backup_dir"

    # Dump database
    if [ -z "$DB_PASSWORD" ]; then
        PGPASSWORD="" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
            -d "$DB_NAME" > "$backup_dir/db_dump.sql"
    else
        PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" \
            -U "$DB_USER" -d "$DB_NAME" > "$backup_dir/db_dump.sql"
    fi

    if [ $? -eq 0 ]; then
        log_success "Database backed up"
    else
        log_error "Database backup failed"
        return 1
    fi

    return 0
}

# ============================================================================
# SUMMARY
# ============================================================================

print_summary() {
    echo -e "\n${BOLD}${GREEN}Deployment Information:${NC}"
    echo -e "  Project: $PROJECT_ROOT"
    echo -e "  Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    echo -e "  PM2 App: $PM2_APP_NAME"
    echo -e "  Environment: $ENV"
    echo -e "\n${BOLD}${GREEN}Access CMS Panel:${NC}"
    echo -e "  URL: https://manager.kod1847.ru/dashboard/miniapp"
    echo -e "  Tabs: Menu, Events, Halls, Texts, Settings"
    echo -e "\n${BOLD}${GREEN}Next Steps:${NC}"
    echo -e "  1. Check PM2 status: ${YELLOW}pm2 status${NC}"
    echo -e "  2. View logs: ${YELLOW}pm2 logs $PM2_APP_NAME${NC}"
    echo -e "  3. Test: ${YELLOW}curl https://manager.kod1847.ru/dashboard/miniapp${NC}"
    echo ""
}

# ============================================================================
# HELP & USAGE
# ============================================================================

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -v, --verbose           Enable verbose output
    -b, --backup            Create database backup before deployment
    -e, --env ENV           Set environment (default: production)
    --db-host HOST          Database host (default: localhost)
    --db-port PORT          Database port (default: 5432)
    --db-user USER          Database user (default: postgres)
    --db-name NAME          Database name (default: kod1847)
    --db-password PASS      Database password (optional)
    --pm2-name NAME         PM2 app name (default: manager)

EXAMPLES:
    # Basic deployment
    $0

    # Verbose with backup
    $0 --verbose --backup

    # Custom database
    $0 --db-host 192.168.1.10 --db-user admin --db-password secret

    # Development environment
    $0 --env development --verbose
EOF
}

# ============================================================================
# ARGUMENT PARSING
# ============================================================================

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -v|--verbose)
                VERBOSE=1
                shift
                ;;
            -b|--backup)
                BACKUP=1
                shift
                ;;
            -e|--env)
                ENV="$2"
                shift 2
                ;;
            --db-host)
                DB_HOST="$2"
                shift 2
                ;;
            --db-port)
                DB_PORT="$2"
                shift 2
                ;;
            --db-user)
                DB_USER="$2"
                shift 2
                ;;
            --db-name)
                DB_NAME="$2"
                shift 2
                ;;
            --db-password)
                DB_PASSWORD="$2"
                shift 2
                ;;
            --pm2-name)
                PM2_APP_NAME="$2"
                shift 2
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# ============================================================================
# EXECUTION
# ============================================================================

BACKUP=0
parse_args "$@"
main
