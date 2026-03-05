# PowerShell script to fix CSRF issues

Write-Host "🔧 Fixing CSRF Token Issues..." -ForegroundColor Cyan
Write-Host ""

# Clear Laravel caches
Write-Host "📦 Clearing Laravel caches..." -ForegroundColor Yellow
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

Write-Host ""
Write-Host "✅ Caches cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your backend server (php artisan serve or docker-compose restart)"
Write-Host "2. Clear browser cookies and local storage"
Write-Host "3. Try logging in again at http://localhost:4200/admin/login"
Write-Host ""
Write-Host "Default credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@example.com"
Write-Host "  Password: password"
Write-Host ""
