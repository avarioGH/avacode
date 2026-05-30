#!/bin/bash
# ================================================================
# AVA ORDER BOT — Database Backup Script
# Usage: bash scripts/backup.sh
# ================================================================

set -e

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

# Parse DATABASE_URL
DB_URL="$DATABASE_URL"
DB_HOST=$(echo "$DB_URL" | sed -n 's/.*@\([^:\/]*\).*/\1/p')
DB_PORT=$(echo "$DB_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DB_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo "$DB_URL" | sed -n 's/postgresql:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DB_URL" | sed -n 's/postgresql:\/\/[^:]*:\([^@]*\)@.*/\1/p')

FILENAME="backup-$TIMESTAMP.sql"
FILEPATH="$BACKUP_DIR/$FILENAME"

echo "📦 Creating backup: $FILENAME"

PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -f "$FILEPATH"

SIZE=$(du -sh "$FILEPATH" | cut -f1)
echo "✅ Backup berhasil! File: $FILEPATH ($SIZE)"

# Cleanup backup lama (lebih dari BACKUP_RETENTION_DAYS hari)
RETENTION="${BACKUP_RETENTION_DAYS:-7}"
echo "🧹 Menghapus backup lebih dari $RETENTION hari..."
find "$BACKUP_DIR" -name "backup-*.sql" -mtime +$RETENTION -delete
echo "✅ Cleanup selesai"
