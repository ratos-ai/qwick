#!/bin/sh
set -e

HOST=${API_HOST:-0.0.0.0}
PORT=${API_PORT:-8000}

echo "Applying database migrations..."
alembic upgrade head
echo "Migrations applied!"

echo "Starting FastAPI application on $HOST:$PORT..."
exec uvicorn backend.main:app --host "$HOST" --port "$PORT"