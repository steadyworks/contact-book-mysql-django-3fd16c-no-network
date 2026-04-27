#!/bin/bash
set -e

# Ensure socket directory exists (may be on tmpfs, wiped at container start)
mkdir -p /run/mysqld
chown mysql:mysql /run/mysqld

# Start MySQL in background
mysqld_safe --datadir=/var/lib/mysql &
MYSQL_PID=$!

# Wait until MySQL is ready
for i in {1..60}; do
  if mysqladmin ping --silent 2>/dev/null; then
    break
  fi
  sleep 1
done

# Create the application database if it doesn't exist
mysql -e "CREATE DATABASE IF NOT EXISTS contacts CHARACTER SET utf8mb4;"

cd /app/backend
pip install -r requirements.txt

python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:3001 &

cd /app/frontend
npm install
npm run build && npx vite preview --port 3000 --host 0.0.0.0 --strictPort &
