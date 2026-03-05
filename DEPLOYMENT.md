# Deployment Guide - Portfolio Application

This guide covers deploying the portfolio application to a production server.

## Table of Contents

1. [Server Requirements](#server-requirements)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Web Server Configuration](#web-server-configuration)
7. [SSL Certificate](#ssl-certificate)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Server Requirements

### Minimum Requirements

- **OS:** Ubuntu 20.04+ or similar Linux distribution
- **PHP:** 8.3 or higher
- **MySQL:** 8.0 or higher
- **Web Server:** Nginx (recommended) or Apache
- **Node.js:** 18+ (for building frontend)
- **Composer:** Latest version
- **Memory:** 2GB RAM minimum
- **Storage:** 10GB minimum

### Required PHP Extensions

```bash
php -m | grep -E 'bcmath|ctype|fileinfo|json|mbstring|openssl|pdo|tokenizer|xml|gd'
```

Required extensions:
- bcmath
- ctype
- fileinfo
- json
- mbstring
- openssl
- PDO
- pdo_mysql
- tokenizer
- xml
- gd (for image processing)

---

## Pre-Deployment Checklist

- [ ] Server meets all requirements
- [ ] Domain name configured and pointing to server
- [ ] SSL certificate ready (Let's Encrypt recommended)
- [ ] Database created with credentials
- [ ] SMTP email service configured
- [ ] Backup strategy in place
- [ ] Git repository access configured

---

## Backend Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone <repository-url> portfolio
cd portfolio/backend
```

### 2. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
sudo chmod -R 775 /var/www/portfolio/backend/storage
sudo chmod -R 775 /var/www/portfolio/backend/bootstrap/cache
```

### 3. Install Dependencies

```bash
cd /var/www/portfolio/backend
composer install --optimize-autoloader --no-dev
```

### 4. Configure Environment

```bash
cp .env.example .env
nano .env
```

**Production Environment Variables:**

```env
APP_NAME="Amirul Iman Portfolio"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_prod
DB_USERNAME=portfolio_user
DB_PASSWORD=your_secure_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=yourdomain.com
SESSION_SECURE_COOKIE=true

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
FRONTEND_URL=https://yourdomain.com

QUEUE_CONNECTION=database
CACHE_STORE=database
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Migrations and Seeders

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 7. Create Storage Symlink

```bash
php artisan storage:link
```

### 8. Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 9. Set Up Queue Worker (Optional but Recommended)

Create a systemd service for the queue worker:

```bash
sudo nano /etc/systemd/system/portfolio-queue.service
```

Add:

```ini
[Unit]
Description=Portfolio Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/portfolio/backend
ExecStart=/usr/bin/php /var/www/portfolio/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable portfolio-queue
sudo systemctl start portfolio-queue
sudo systemctl status portfolio-queue
```

---

## Frontend Deployment

### 1. Install Dependencies

```bash
cd /var/www/portfolio/frontend
npm install
```

### 2. Update Environment

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '/api/v1'
};
```

### 3. Build for Production

```bash
npm run build
```

The build output will be in `dist/portfolio-app/browser/`.

### 4. Copy Build to Web Root

```bash
sudo mkdir -p /var/www/portfolio/public
sudo cp -r dist/portfolio-app/browser/* /var/www/portfolio/public/
```

---

## Database Setup

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE portfolio_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portfolio_prod.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Import Data (if migrating)

```bash
mysql -u portfolio_user -p portfolio_prod < backup.sql
```

---

## Web Server Configuration

### Nginx Configuration

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/portfolio/public;
    index index.html;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # API Routes
    location /api {
        try_files $uri $uri/ /backend/public/index.php?$query_string;
    }

    location /sanctum {
        try_files $uri $uri/ /backend/public/index.php?$query_string;
    }

    # Storage Files
    location /storage {
        alias /var/www/portfolio/backend/storage/app/public;
        try_files $uri $uri/ =404;
    }

    # PHP-FPM for Laravel
    location ~ ^/(api|sanctum)/.*\.php$ {
        root /var/www/portfolio/backend/public;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Angular Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Configuration (Alternative)

Create Apache configuration:

```bash
sudo nano /etc/apache2/sites-available/portfolio.conf
```

Add:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    DocumentRoot /var/www/portfolio/public
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem
    
    <Directory /var/www/portfolio/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Angular routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # API Routes
    Alias /api /var/www/portfolio/backend/public/index.php
    Alias /sanctum /var/www/portfolio/backend/public/index.php
    
    # Storage Files
    Alias /storage /var/www/portfolio/backend/storage/app/public
    
    <Directory /var/www/portfolio/backend/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Enable required modules and site:

```bash
sudo a2enmod rewrite ssl headers
sudo a2ensite portfolio
sudo systemctl reload apache2
```

---

## SSL Certificate

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

The certificate will auto-renew via cron job.

---

## Post-Deployment

### 1. Verify Installation

- [ ] Visit https://yourdomain.com
- [ ] Check all public pages load
- [ ] Test contact form submission
- [ ] Login to admin panel
- [ ] Test CRUD operations
- [ ] Check email notifications

### 2. Set Up Monitoring

**Laravel Logs:**
```bash
tail -f /var/www/portfolio/backend/storage/logs/laravel.log
```

**Nginx Logs:**
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### 3. Set Up Backups

**Database Backup Script:**

```bash
sudo nano /usr/local/bin/backup-portfolio-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u portfolio_user -p'your_password' portfolio_prod > $BACKUP_DIR/portfolio_$DATE.sql
gzip $BACKUP_DIR/portfolio_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "portfolio_*.sql.gz" -mtime +7 -delete
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-portfolio-db.sh
```

Add to crontab:

```bash
sudo crontab -e
```

Add:

```
0 2 * * * /usr/local/bin/backup-portfolio-db.sh
```

### 4. Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/portfolio
```

Add:

```
/var/www/portfolio/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 5. Performance Optimization

**Enable OPcache:**

```bash
sudo nano /etc/php/8.3/fpm/php.ini
```

Ensure:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

Restart PHP-FPM:

```bash
sudo systemctl restart php8.3-fpm
```

---

## Troubleshooting

### 500 Internal Server Error

**Check Laravel logs:**
```bash
tail -f /var/www/portfolio/backend/storage/logs/laravel.log
```

**Common causes:**
- Missing `.env` file
- Incorrect file permissions
- Missing PHP extensions
- Database connection issues

### 403 Forbidden

**Check permissions:**
```bash
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### Database Connection Failed

**Verify credentials:**
```bash
mysql -u portfolio_user -p portfolio_prod
```

**Check Laravel config:**
```bash
php artisan config:clear
php artisan config:cache
```

### Queue Not Processing

**Check queue worker:**
```bash
sudo systemctl status portfolio-queue
sudo systemctl restart portfolio-queue
```

**Check logs:**
```bash
sudo journalctl -u portfolio-queue -f
```

### Email Not Sending

**Test SMTP connection:**
```bash
php artisan tinker
Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

**Check queue:**
```bash
php artisan queue:work --once
```

### Frontend Not Loading

**Check Nginx config:**
```bash
sudo nginx -t
```

**Check build output:**
```bash
ls -la /var/www/portfolio/public
```

### SSL Certificate Issues

**Renew certificate:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Server requirements met
- [ ] Domain configured
- [ ] SSL certificate obtained
- [ ] Database created
- [ ] SMTP configured

### Backend
- [ ] Code deployed
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Application key generated
- [ ] Migrations run
- [ ] Database seeded
- [ ] Storage linked
- [ ] Caches cleared and rebuilt
- [ ] Queue worker running

### Frontend
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Production build created
- [ ] Files deployed

### Web Server
- [ ] Nginx/Apache configured
- [ ] SSL configured
- [ ] Permissions set correctly
- [ ] Server restarted

### Post-Deployment
- [ ] All pages accessible
- [ ] Contact form working
- [ ] Admin panel accessible
- [ ] Email notifications working
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Log rotation configured

---

## Maintenance

### Updating the Application

```bash
cd /var/www/portfolio

# Pull latest changes
git pull origin main

# Backend updates
cd backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend updates
cd ../frontend
npm install
npm run build
sudo cp -r dist/portfolio-app/browser/* /var/www/portfolio/public/

# Restart services
sudo systemctl restart php8.3-fpm
sudo systemctl restart portfolio-queue
sudo systemctl reload nginx
```

### Clearing Caches

```bash
cd /var/www/portfolio/backend
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## Security Best Practices

1. **Keep software updated:**
   - Regular OS updates
   - PHP updates
   - Composer dependencies
   - npm packages

2. **Use strong passwords:**
   - Database passwords
   - Admin account passwords
   - SMTP passwords

3. **Enable firewall:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

4. **Disable directory listing:**
   - Already configured in Nginx/Apache

5. **Regular backups:**
   - Database backups
   - File backups
   - Test restore procedures

6. **Monitor logs:**
   - Application logs
   - Web server logs
   - System logs

---

## Support

For issues or questions:
- Email: amirul.iman698@gmail.com
- GitHub: https://github.com/iamirul2000

---

**Last Updated:** 2024
