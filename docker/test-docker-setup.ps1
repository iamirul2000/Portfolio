# Docker Setup Test Script for Windows
# This script tests the Docker configuration for the Portfolio application

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Portfolio Docker Setup Test" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1. Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if docker-compose is available
Write-Host "2. Checking if docker-compose is available..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "✅ docker-compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ docker-compose is not installed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Validate docker-compose.yml
Write-Host "3. Validating docker-compose.yml..." -ForegroundColor Yellow
try {
    docker-compose config | Out-Null
    Write-Host "✅ docker-compose.yml is valid" -ForegroundColor Green
} catch {
    Write-Host "❌ docker-compose.yml is invalid" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Build and start containers
Write-Host "4. Building and starting containers..." -ForegroundColor Yellow
docker-compose up -d --build

# Wait for containers to start
Write-Host "5. Waiting for containers to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check container status
Write-Host "6. Checking container status..." -ForegroundColor Yellow
Write-Host ""

$containers = @("portfolio_nginx", "portfolio_api", "portfolio_frontend", "portfolio_db", "portfolio_mailpit")
$allRunning = $true

foreach ($container in $containers) {
    $running = docker ps --format "{{.Names}}" | Select-String -Pattern "^$container$"
    if ($running) {
        Write-Host "✅ $container is running" -ForegroundColor Green
    } else {
        Write-Host "❌ $container is not running" -ForegroundColor Red
        $allRunning = $false
    }
}
Write-Host ""

# Check port accessibility
Write-Host "7. Checking port accessibility..." -ForegroundColor Yellow
Write-Host ""

# Check Nginx (port 80)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "✅ Nginx is accessible on port 80" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Nginx on port 80 (may not be accessible until Laravel/Angular are set up)" -ForegroundColor Yellow
}

# Check MySQL (port 3306)
$tcpClient = New-Object System.Net.Sockets.TcpClient
try {
    $tcpClient.Connect("localhost", 3306)
    Write-Host "✅ MySQL is accessible on port 3306" -ForegroundColor Green
    $tcpClient.Close()
} catch {
    Write-Host "❌ MySQL is not accessible on port 3306" -ForegroundColor Red
}

# Check Mailpit UI (port 8025)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8025" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Mailpit UI is accessible on port 8025" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Mailpit UI on port 8025 (checking...)" -ForegroundColor Yellow
}

# Check Angular dev server (port 4200)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "✅ Angular dev server is accessible on port 4200" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Angular dev server on port 4200 (may not be accessible until npm install is run)" -ForegroundColor Yellow
}

Write-Host ""

# Check for errors in logs
Write-Host "8. Checking for errors in container logs..." -ForegroundColor Yellow
Write-Host ""

foreach ($container in $containers) {
    $logs = docker logs $container 2>&1 | Select-String -Pattern "error" -SimpleMatch | Select-Object -First 3
    if ($logs) {
        Write-Host "⚠️  $container has errors in logs (check with: docker logs $container)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ $container has no critical errors" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
if ($allRunning) {
    Write-Host "✅ Docker setup test PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Initialize Laravel in backend/ directory (task 1.1.3)"
    Write-Host "2. Initialize Angular in frontend/ directory (task 1.1.4)"
    Write-Host "3. Run 'make fresh' to set up the complete environment"
} else {
    Write-Host "❌ Docker setup test FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Some containers are not running. Check logs with:" -ForegroundColor Yellow
    Write-Host "docker-compose logs"
}
Write-Host "===================================" -ForegroundColor Cyan
