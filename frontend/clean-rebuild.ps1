# Force clean rebuild of Angular app

Write-Host "🧹 Cleaning Angular build cache..." -ForegroundColor Cyan

# Remove Angular cache
if (Test-Path ".angular") {
    Remove-Item -Recurse -Force ".angular"
    Write-Host "✓ Removed .angular cache" -ForegroundColor Green
}

# Remove node_modules cache
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✓ Removed node_modules cache" -ForegroundColor Green
}

# Remove dist folder
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Removed dist folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Cache cleared! Now starting dev server..." -ForegroundColor Green
Write-Host ""

# Start dev server
npm start
