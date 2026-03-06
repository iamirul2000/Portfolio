#!/bin/bash
set -e

echo "Setting up environment..."
cp .env.production .env || echo ".env.production not found, using environment variables"

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Creating database..."
touch database/database.sqlite

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Build complete!"
