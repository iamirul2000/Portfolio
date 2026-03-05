#!/bin/bash

# Docker Setup Test Script
# This script tests the Docker configuration for the Portfolio application

echo "==================================="
echo "Portfolio Docker Setup Test"
echo "==================================="
echo ""

# Check if Docker is running
echo "1. Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
echo "2. Checking if docker-compose is available..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed"
    exit 1
fi
echo "✅ docker-compose is available"
echo ""

# Validate docker-compose.yml
echo "3. Validating docker-compose.yml..."
if ! docker-compose config > /dev/null 2>&1; then
    echo "❌ docker-compose.yml is invalid"
    exit 1
fi
echo "✅ docker-compose.yml is valid"
echo ""

# Build and start containers
echo "4. Building and starting containers..."
docker-compose up -d --build

# Wait for containers to start
echo "5. Waiting for containers to start (30 seconds)..."
sleep 30

# Check container status
echo "6. Checking container status..."
echo ""

CONTAINERS=("portfolio_nginx" "portfolio_api" "portfolio_frontend" "portfolio_db" "portfolio_mailpit")
ALL_RUNNING=true

for container in "${CONTAINERS[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo "✅ ${container} is running"
    else
        echo "❌ ${container} is not running"
        ALL_RUNNING=false
    fi
done
echo ""

# Check port accessibility
echo "7. Checking port accessibility..."
echo ""

# Check Nginx (port 80)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx is accessible on port 80"
else
    echo "⚠️  Nginx on port 80 (may not be accessible until Laravel/Angular are set up)"
fi

# Check MySQL (port 3306)
if nc -z localhost 3306 2>/dev/null; then
    echo "✅ MySQL is accessible on port 3306"
else
    echo "❌ MySQL is not accessible on port 3306"
fi

# Check Mailpit UI (port 8025)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8025 | grep -q "200"; then
    echo "✅ Mailpit UI is accessible on port 8025"
else
    echo "⚠️  Mailpit UI on port 8025 (checking...)"
fi

# Check Angular dev server (port 4200)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Angular dev server is accessible on port 4200"
else
    echo "⚠️  Angular dev server on port 4200 (may not be accessible until npm install is run)"
fi

echo ""

# Check for errors in logs
echo "8. Checking for errors in container logs..."
echo ""

for container in "${CONTAINERS[@]}"; do
    if docker logs "$container" 2>&1 | grep -i "error" | head -n 3 | grep -q "error"; then
        echo "⚠️  ${container} has errors in logs (check with: docker logs ${container})"
    else
        echo "✅ ${container} has no critical errors"
    fi
done

echo ""
echo "==================================="
if [ "$ALL_RUNNING" = true ]; then
    echo "✅ Docker setup test PASSED"
    echo ""
    echo "Next steps:"
    echo "1. Initialize Laravel in backend/ directory (task 1.1.3)"
    echo "2. Initialize Angular in frontend/ directory (task 1.1.4)"
    echo "3. Run 'make fresh' to set up the complete environment"
else
    echo "❌ Docker setup test FAILED"
    echo ""
    echo "Some containers are not running. Check logs with:"
    echo "docker-compose logs"
fi
echo "==================================="
