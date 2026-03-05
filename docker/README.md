# Docker Configuration

This directory contains the Docker configuration for the Portfolio application.

## Structure

```
docker/
├── nginx/
│   └── default.conf       # Nginx reverse proxy configuration
├── php/
│   └── Dockerfile         # PHP-FPM container configuration
├── test-docker-setup.sh   # Docker setup test script (Linux/Mac)
├── test-docker-setup.ps1  # Docker setup test script (Windows)
└── README.md              # This file
```

## Services

The Docker Compose configuration includes the following services:

### 1. Nginx (Port 80)
- **Image**: nginx:alpine
- **Purpose**: Reverse proxy and static file server
- **Routes**:
  - `/` → Angular frontend (static files)
  - `/api/*` → Laravel backend (PHP-FPM)
  - `/storage/*` → Laravel uploaded files

### 2. API (PHP-FPM)
- **Image**: Custom (built from docker/php/Dockerfile)
- **Base**: php:8.3-fpm-alpine
- **Purpose**: Laravel backend application
- **Extensions**: pdo_mysql, mbstring, exif, pcntl, bcmath, gd
- **Includes**: Composer

### 3. Frontend (Port 4200)
- **Image**: node:20-alpine
- **Purpose**: Angular development server
- **Note**: In production, Angular is built and served by Nginx

### 4. Database (Port 3306)
- **Image**: mysql:8.0
- **Purpose**: MySQL database
- **Credentials**:
  - Database: `portfolio`
  - User: `portfolio_user`
  - Password: `secret`
  - Root Password: `root_secret`

### 5. Mailpit (Ports 8025, 1025)
- **Image**: axllent/mailpit
- **Purpose**: Email testing tool
- **Ports**:
  - 8025: Web UI for viewing emails
  - 1025: SMTP server for sending emails

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)
- At least 4GB of RAM allocated to Docker
- Ports 80, 3306, 4200, 8025, 1025 available

## Quick Start

### 1. Start All Containers

```bash
# From the portfolio root directory
docker-compose up -d
```

### 2. Check Container Status

```bash
docker-compose ps
```

### 3. View Logs

```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs api
docker-compose logs frontend
docker-compose logs db
```

### 4. Stop All Containers

```bash
docker-compose down
```

### 5. Stop and Remove Volumes

```bash
docker-compose down -v
```

## Testing the Setup

### Linux/Mac

```bash
cd docker
chmod +x test-docker-setup.sh
./test-docker-setup.sh
```

### Windows PowerShell

```powershell
cd docker
.\test-docker-setup.ps1
```

## Manual Testing

### 1. Check Nginx

```bash
curl http://localhost:80
```

Expected: Nginx welcome page or Angular app (once built)

### 2. Check MySQL

```bash
docker exec -it portfolio_db mysql -u portfolio_user -psecret -e "SHOW DATABASES;"
```

Expected: List of databases including `portfolio`

### 3. Check Mailpit UI

Open browser: http://localhost:8025

Expected: Mailpit web interface

### 4. Check Angular Dev Server

Open browser: http://localhost:4200

Expected: Angular app (once npm install is run)

### 5. Check PHP-FPM

```bash
docker exec -it portfolio_api php -v
```

Expected: PHP 8.3.x version information

## Common Issues

### Issue: Port Already in Use

**Error**: `Bind for 0.0.0.0:80 failed: port is already allocated`

**Solution**: 
- Stop the service using the port
- Or change the port in docker-compose.yml:
  ```yaml
  ports:
    - "8080:80"  # Use port 8080 instead of 80
  ```

### Issue: Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**: Start Docker Desktop

### Issue: Permission Denied (Linux)

**Error**: `Permission denied while trying to connect to the Docker daemon socket`

**Solution**: 
```bash
sudo usermod -aG docker $USER
# Log out and log back in
```

### Issue: Containers Keep Restarting

**Solution**: Check logs for errors
```bash
docker-compose logs api
```

Common causes:
- Missing Laravel installation in backend/
- Missing package.json in frontend/
- Database connection issues

## Volume Mounts

The following directories are mounted as volumes:

- `./backend` → `/var/www/backend` (API container)
- `./frontend` → `/var/www/frontend` (Frontend container)
- `./docker/nginx/default.conf` → `/etc/nginx/conf.d/default.conf` (Nginx container)
- `./backend/public` → `/var/www/backend/public` (Nginx container)
- `./backend/storage/app/public` → `/var/www/backend/public/storage` (Nginx container)
- `./frontend/dist` → `/var/www/frontend` (Nginx container)

## Network

All containers are connected to the `portfolio_network` bridge network, allowing them to communicate with each other using service names:

- `api` → PHP-FPM container
- `db` → MySQL container
- `mailpit` → Mailpit container
- `frontend` → Angular dev server

## Environment Variables

Environment variables for the API container are defined in docker-compose.yml:

- `DB_HOST=db`
- `DB_DATABASE=portfolio`
- `DB_USERNAME=portfolio_user`
- `DB_PASSWORD=secret`

Additional environment variables should be set in `backend/.env` file.

## Next Steps

After Docker setup is complete:

1. **Initialize Laravel** (Task 1.1.3)
   ```bash
   docker exec -it portfolio_api composer create-project laravel/laravel .
   ```

2. **Initialize Angular** (Task 1.1.4)
   ```bash
   docker exec -it portfolio_frontend npm install -g @angular/cli
   docker exec -it portfolio_frontend ng new . --skip-git
   ```

3. **Run Database Migrations**
   ```bash
   docker exec -it portfolio_api php artisan migrate
   ```

4. **Seed Database**
   ```bash
   docker exec -it portfolio_api php artisan db:seed
   ```

## Maintenance

### Rebuild Containers

```bash
docker-compose up -d --build
```

### Clear Docker Cache

```bash
docker system prune -a
```

### Update Images

```bash
docker-compose pull
docker-compose up -d
```

## Production Notes

For production deployment:

1. Build Angular for production:
   ```bash
   cd frontend
   npm run build
   ```

2. Optimize Laravel:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. Use environment-specific docker-compose files:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. Enable HTTPS with SSL certificates
5. Use production-grade database credentials
6. Configure proper backup strategies

## Support

For issues or questions:
- Check container logs: `docker-compose logs [service]`
- Verify Docker is running: `docker info`
- Check port availability: `netstat -an | grep [port]`
- Review Docker documentation: https://docs.docker.com/
