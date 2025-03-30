#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
# Try to connect to the database, retry up to 30 times with 1 second delay
for i in $(seq 1 30); do
    if npx prisma db push --skip-generate > /dev/null 2>&1; then
        break
    fi
    echo "⏳ Waiting for database... attempt $i/30"
    sleep 1
done

echo "🗑️ Resetting database..."
npx prisma migrate reset --force

echo "📥 Importing sample data..."
NODE_ENV=development npx ts-node scripts/importEventsFromCsv.ts

echo "🚀 Starting development server..."
npm run dev
