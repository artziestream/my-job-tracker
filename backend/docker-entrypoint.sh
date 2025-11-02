#!/bin/sh
set -e

echo "⏳ Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "✅ Database is ready!"

# Check if migrations exist
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "🔄 Running database migrations..."
  pnpm prisma:migrate
else
  echo "⚠️  No migrations found, using db push instead..."
  pnpm exec prisma db push --skip-generate
fi

echo "🌱 Seeding database..."
# Run seed and show output
if pnpm prisma:seed; then
  echo "✅ Seeding completed successfully"
else
  echo "⚠️  Seeding failed or skipped"
fi

echo "🚀 Starting server and Prisma Studio..."
exec "$@"