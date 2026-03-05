# Portfolio Application - Amirul Iman

A production-ready, full-stack developer portfolio showcasing professional experience as a Full Stack Web Software Engineer.

## Tech Stack

- **Backend:** Laravel 11.x, PHP 8.3+
- **Frontend:** Angular 18.x, TypeScript 5.x
- **Database:** MySQL 8.0+
- **Authentication:** Laravel Sanctum
- **Development:** Docker Compose

## Project Structure

```
portfolio/
├── backend/          # Laravel API backend
├── frontend/         # Angular SPA frontend
├── docker/           # Docker configuration files
├── docker-compose.yml
├── Makefile
└── README.md
```

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git
- At least 4GB RAM allocated to Docker
- Ports 80, 3306, 4200, 8025, 1025 available

## Quick Start

### 1. Clone and Start

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Start all services
docker-compose up -d
```

### 2. Verify Setup

**Windows PowerShell:**
```powershell
cd docker
.\test-docker-setup.ps1
```

**Linux/Mac:**
```bash
cd docker
chmod +x test-docker-setup.sh
./test-docker-setup.sh
```

### 3. Access Services

- **Nginx:** http://localhost:80
- **Angular Dev Server:** http://localhost:4200
- **MySQL:** localhost:3306
- **Mailpit UI:** http://localhost:8025

## Docker Services

The application runs in 5 Docker containers:

1. **nginx** - Reverse proxy and static file server (Port 80)
2. **api** - Laravel/PHP-FPM backend (Port 9000)
3. **frontend** - Angular development server (Port 4200)
4. **db** - MySQL 8.0 database (Port 3306)
5. **mailpit** - Email testing tool (Ports 8025, 1025)

## Development

### Using Makefile (Linux/Mac/WSL)

The Makefile provides convenient shortcuts for common development tasks:

```bash
# Show all available commands
make help

# Start all containers
make up

# Stop all containers
make down

# Fresh install (reset database, install dependencies)
make fresh

# Install dependencies only
make install

# Run tests
make test

# Run linters
make lint

# Format code
make format

# View logs
make logs

# Additional commands
make status          # Show container status
make restart         # Restart all containers
make shell-api       # Open shell in API container
make shell-frontend  # Open shell in frontend container
make migrate         # Run database migrations
make seed            # Seed the database
```

**Note for Windows users:** If `make` is not available, you can:
1. Install Make for Windows (via Chocolatey: `choco install make`)
2. Use WSL (Windows Subsystem for Linux)
3. Use the Docker Compose commands directly (see below)

### Using Docker Compose (All Platforms)

If you prefer to use Docker Compose directly or don't have Make installed:

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Show container status
docker-compose ps

# Restart containers
docker-compose restart
```

### Common Development Tasks

**Install Dependencies:**
```bash
# Backend (Laravel)
docker exec -it portfolio_api composer install

# Frontend (Angular)
docker exec -it portfolio_frontend npm install
```

**Run Tests:**
```bash
# Backend tests
docker exec -it portfolio_api php artisan test

# Frontend tests
docker exec -it portfolio_frontend npm test
```

**Run Linters:**
```bash
# Backend (Laravel Pint)
docker exec -it portfolio_api ./vendor/bin/pint --test

# Frontend (ESLint)
docker exec -it portfolio_frontend npm run lint
```

**Format Code:**
```bash
# Backend (Laravel Pint)
docker exec -it portfolio_api ./vendor/bin/pint

# Frontend (Prettier)
docker exec -it portfolio_frontend npm run format
```

**Database Operations:**
```bash
# Run migrations
docker exec -it portfolio_api php artisan migrate

# Seed database
docker exec -it portfolio_api php artisan db:seed

# Fresh migration with seeding
docker exec -it portfolio_api php artisan migrate:fresh --seed

# Create storage symlink
docker exec -it portfolio_api php artisan storage:link
```

**Fresh Installation (Reset Everything):**
```bash
# Stop containers
docker-compose down

# Remove database volume
docker volume rm portfolio_db_data

# Start containers
docker-compose up -d

# Wait for database to be ready (10 seconds)
# Then install dependencies and run migrations
docker exec -it portfolio_api composer install
docker exec -it portfolio_api php artisan migrate:fresh --seed
docker exec -it portfolio_api php artisan storage:link
docker exec -it portfolio_frontend npm install
```

### Container Access

```bash
# Access API container
docker exec -it portfolio_api sh

# Access Frontend container
docker exec -it portfolio_frontend sh

# Access Database
docker exec -it portfolio_db mysql -u portfolio_user -psecret portfolio
```

## Project Status

This project is production-ready. All MVP features have been completed:

- [x] Project structure initialization
- [x] Docker configuration
- [x] Laravel backend setup
- [x] Angular frontend setup
- [x] Database migrations and seeders
- [x] API endpoints (Public & Admin)
- [x] Frontend pages (Home, About, Experience, Projects, Skills, Contact)
- [x] Admin panel (Dashboard, Projects, Experiences, Skills, Messages)
- [x] Authentication system (Laravel Sanctum)
- [x] Contact form with rate limiting
- [x] Responsive design
- [x] Comprehensive test suite (70 tests, 513 assertions)

## Troubleshooting

### Docker Not Running

**Error:** `Cannot connect to the Docker daemon`

**Solution:** Start Docker Desktop

### Port Already in Use

**Error:** `Bind for 0.0.0.0:80 failed: port is already allocated`

**Solution:** Stop the service using the port or change the port in docker-compose.yml

### Containers Keep Restarting

**Solution:** Check logs for errors
```bash
docker-compose logs api
```

Common causes:
- Missing Laravel installation in backend/
- Missing package.json in frontend/
- Database connection issues

For more detailed troubleshooting, see [docker/README.md](docker/README.md)

## Features

- Public portfolio pages (Home, About, Experience, Projects, Skills, Contact)
- Admin panel for content management
- Contact form with email notifications and rate limiting
- Responsive design for all devices
- RESTful API architecture
- Image upload for project thumbnails
- Dynamic content management
- Secure authentication with Laravel Sanctum

## Deployment

### Production Build

**Backend:**
```bash
# Set environment to production
cp .env.example .env
# Edit .env with production values

# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Create storage symlink
php artisan storage:link

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Frontend:**
```bash
# Build for production
npm run build

# Output will be in dist/ directory
# Serve via Nginx or your preferred web server
```

### Environment Variables

**Backend (.env):**
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://yourdomain.com`
- `DB_*` - Production database credentials
- `MAIL_*` - Production email service (SMTP)
- `SANCTUM_STATEFUL_DOMAINS=yourdomain.com`
- `SESSION_DOMAIN=yourdomain.com`
- `FRONTEND_URL=https://yourdomain.com`

**Frontend:**
- Update `environment.prod.ts` with production API URL

### Server Requirements

- PHP 8.3+
- MySQL 8.0+
- Nginx or Apache
- Composer
- Node.js 18+ (for building frontend)
- SSL certificate (recommended)

## License

Private project - All rights reserved

## Contact

Amirul Iman
- Email: amirul.iman698@gmail.com
- GitHub: https://github.com/iamirul2000
- LinkedIn: www.linkedin.com/in/mirul-
