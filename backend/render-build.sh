#!/bin/bash
set -e

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Creating database..."
touch database/database.sqlite

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Build complete!"
