# Makefile for Portfolio Application
# Provides convenient commands for Docker-based development

.PHONY: help up down fresh install test lint format logs clean

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Portfolio Application - Makefile Commands'
	@echo ''
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start all Docker containers
	@echo "Starting all containers..."
	docker-compose up -d
	@echo "Containers started successfully!"
	@echo "Services available at:"
	@echo "  - Nginx: http://localhost:80"
	@echo "  - Angular: http://localhost:4200"
	@echo "  - Mailpit: http://localhost:8025"

down: ## Stop all Docker containers
	@echo "Stopping all containers..."
	docker-compose down
	@echo "Containers stopped successfully!"

fresh: ## Reset database and reinstall dependencies
	@echo "Performing fresh installation..."
	@echo "Stopping containers..."
	docker-compose down
	@echo "Removing database volume..."
	docker volume rm portfolio_db_data 2>/dev/null || true
	@echo "Starting containers..."
	docker-compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Installing backend dependencies..."
	docker exec -it portfolio_api composer install
	@echo "Running database migrations..."
	docker exec -it portfolio_api php artisan migrate:fresh --seed
	@echo "Creating storage symlink..."
	docker exec -it portfolio_api php artisan storage:link
	@echo "Installing frontend dependencies..."
	docker exec -it portfolio_frontend npm install
	@echo "Fresh installation complete!"

install: ## Install dependencies for backend and frontend
	@echo "Installing dependencies..."
	@echo "Installing backend dependencies..."
	docker exec -it portfolio_api composer install
	@echo "Installing frontend dependencies..."
	docker exec -it portfolio_frontend npm install
	@echo "Dependencies installed successfully!"

test: ## Run tests for backend and frontend
	@echo "Running tests..."
	@echo "Running backend tests..."
	docker exec -it portfolio_api php artisan test
	@echo "Backend tests complete!"
	@echo ""
	@echo "Note: Frontend tests can be run with: docker exec -it portfolio_frontend npm test"

lint: ## Run linters for backend and frontend
	@echo "Running linters..."
	@echo "Running backend linter (Laravel Pint)..."
	docker exec -it portfolio_api ./vendor/bin/pint --test
	@echo "Backend linting complete!"
	@echo ""
	@echo "Running frontend linter (ESLint)..."
	docker exec -it portfolio_frontend npm run lint
	@echo "Frontend linting complete!"

format: ## Format code for backend and frontend
	@echo "Formatting code..."
	@echo "Formatting backend code (Laravel Pint)..."
	docker exec -it portfolio_api ./vendor/bin/pint
	@echo "Backend formatting complete!"
	@echo ""
	@echo "Formatting frontend code (Prettier)..."
	docker exec -it portfolio_frontend npm run format 2>/dev/null || echo "Note: Frontend format script not configured yet"
	@echo "Code formatting complete!"

logs: ## Show logs from all containers
	docker-compose logs -f

logs-api: ## Show logs from API container
	docker-compose logs -f api

logs-frontend: ## Show logs from frontend container
	docker-compose logs -f frontend

logs-db: ## Show logs from database container
	docker-compose logs -f db

clean: ## Remove all containers, volumes, and images
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	@echo "Cleanup complete!"

restart: ## Restart all containers
	@echo "Restarting containers..."
	docker-compose restart
	@echo "Containers restarted!"

status: ## Show status of all containers
	@echo "Container status:"
	docker-compose ps

shell-api: ## Open shell in API container
	docker exec -it portfolio_api sh

shell-frontend: ## Open shell in frontend container
	docker exec -it portfolio_frontend sh

shell-db: ## Open MySQL shell
	docker exec -it portfolio_db mysql -u portfolio_user -psecret portfolio

migrate: ## Run database migrations
	@echo "Running migrations..."
	docker exec -it portfolio_api php artisan migrate
	@echo "Migrations complete!"

seed: ## Seed the database
	@echo "Seeding database..."
	docker exec -it portfolio_api php artisan db:seed
	@echo "Database seeded!"

migrate-fresh: ## Fresh migration with seeding
	@echo "Running fresh migrations with seeding..."
	docker exec -it portfolio_api php artisan migrate:fresh --seed
	@echo "Fresh migration complete!"
