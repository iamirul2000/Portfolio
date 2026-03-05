# PowerShell script to install Angular Material
# Run this script after npm install completes successfully

Write-Host "Installing Angular Material..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "ERROR: node_modules not found!" -ForegroundColor Red
    Write-Host "Please run 'npm install' first" -ForegroundColor Yellow
    exit 1
}

# Install Angular Material
Write-Host "Running: ng add @angular/material" -ForegroundColor Cyan
ng add @angular/material --skip-confirmation --theme=indigo-pink --typography=true --animations=enabled

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Angular Material installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run 'npm start' to start the dev server" -ForegroundColor White
    Write-Host "2. Open http://localhost:4200 in your browser" -ForegroundColor White
    Write-Host "3. Verify the app loads without errors" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ Angular Material installation failed" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
}
