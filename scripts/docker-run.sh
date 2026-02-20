#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

case "${1:-up}" in
  up)
    echo "Building and starting containers..."
    docker compose up -d --build
    echo "Containers started. App: http://localhost:${PORT:-3000} | API docs: http://localhost:${PORT:-3000}/api/api-docs"
    ;;
  db)
    echo "Starting Postgres only (for local dev)..."
    docker compose up -d postgres
    echo "Postgres running at localhost:${POSTGRES_PORT:-5432}"
    echo "Use in .env: DATABASE_URL=postgresql://${POSTGRES_USER:-crmuser}:${POSTGRES_PASSWORD:-crmpass}@localhost:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-crmversity}"
    ;;
  down)
    echo "Stopping containers..."
    docker compose down
    ;;
  logs)
    docker compose logs -f "${2:-app}"
    ;;
  build)
    docker compose build --no-cache
    ;;
  *)
    echo "Usage: $0 {up|db|down|logs|build}"
    echo "  up    - Build and start all containers (default)"
    echo "  db    - Start Postgres only (for local dev: then run yarn start:dev)"
    echo "  down  - Stop and remove containers"
    echo "  logs  - Follow logs (optional: app or postgres)"
    echo "  build - Rebuild images without cache"
    exit 1
    ;;
esac
