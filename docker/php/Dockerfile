FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/backend

# Set permissions for Laravel directories
RUN mkdir -p /var/www/backend/storage /var/www/backend/bootstrap/cache && \
    chown -R www-data:www-data /var/www/backend

EXPOSE 9000

CMD ["php-fpm"]
