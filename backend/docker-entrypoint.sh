#!/bin/sh
set -e

echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

echo "🌱 Seeding database..."
pnpm prisma db seed || echo "⚠️  Seeding skipped (might already have data)"

echo "✅ Database ready!"

# Execute the CMD (runs "pnpm run dev")
exec "$@"