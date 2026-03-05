# Makefile for Portfolio Application
# This file will be populated in task 1.1.5

.PHONY: help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Targets will be added in task 1.1.5:
# - up: Start all containers
# - down: Stop all containers
# - fresh: Reset database and reinstall dependencies
# - install: Install dependencies
# - test: Run tests
# - lint: Run linters
# - format: Format code
