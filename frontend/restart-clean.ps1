#!/usr/bin/env pwsh
# Complete Angular restart with cache clearing

Write-Host "🛑 Stopping Angular dev server..." -ForegroundColor Yellow

# Kill all node processes (Angular dev server)
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "🗑️  Clearing Angular cache..." -ForegroundColor Yellow

# Remove Angular cache
if (Test-Path ".angular") {
    Remove-Item -Recurse -Force .angular
    Write-Host "✅ Angular cache cleared" -ForegroundColor Green
}

# Remove node_modules/.cache if exists
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✅ Node modules cache cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting Angular dev server..." -ForegroundColor Cyan
Write-Host ""

# Start Angular dev server
ng serve --host 0.0.0.0 --port 4200
