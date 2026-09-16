#!/bin/sh
set -e

# Asegurar que el directorio de la base de datos exista
DB_FILE="${DATABASE_PATH:-/app/db.sqlite3}"
DB_DIR=$(dirname "$DB_FILE")
if [ ! -d "$DB_DIR" ]; then
    echo "==> [Backend] Creando directorio para base de datos: $DB_DIR"
    mkdir -p "$DB_DIR"
fi

echo "==> [Backend] Aplicando migraciones..."
python manage.py migrate --noinput

if [ "$RUN_SEED" = "true" ]; then
    echo "==> [Backend] Ejecutando seed de datos iniciales..."
    python manage.py seed
fi

echo "==> [Backend] Iniciando servicio..."
exec "$@"
