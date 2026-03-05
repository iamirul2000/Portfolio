#!/bin/bash

echo "🔧 Fixing CSRF Token Issues..."
echo ""

# Clear Laravel caches
echo "📦 Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "✅ Caches cleared!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your backend server (php artisan serve or docker-compose restart)"
echo "2. Clear browser cookies and local storage"
echo "3. Try logging in again at http://localhost:4200/admin/login"
echo ""
echo "Default credentials:"
echo "  Email: admin@example.com"
echo "  Password: password"
echo ""
