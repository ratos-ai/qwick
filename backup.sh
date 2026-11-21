#!/bin/bash
set -e

cd /opt/qwick-app

source .env

BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="$BACKUP_DIR/db_$DATE.sql"

mkdir -p $BACKUP_DIR

docker compose -f docker-compose.yaml -f docker-compose.prod.yaml exec -T db pg_dump -U $DB_USER $DB_NAME > $FILENAME

find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete