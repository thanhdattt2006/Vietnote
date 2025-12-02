# Dùng base image Alpine PHP-FPM
FROM php:8.2-fpm-alpine

# 1. Cài đặt Nginx và các thư viện hệ thống cần thiết
RUN apk update && apk add --no-cache \
    nginx \
    git \
    curl \
    mysql-client \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    oniguruma-dev

# 2. Cài đặt PHP Extensions (Chuẩn Docker)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd opcache

# 3. Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Thiết lập thư mục làm việc
WORKDIR /var/www/html

# 5. Copy file cấu hình Nginx (Đường dẫn chuẩn của Alpine)
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# 6. Copy code vào container
COPY . .

# 7. Cài đặt Dependencies
RUN composer install --optimize-autoloader --no-dev --no-scripts

# 8. Phân quyền (Quan trọng)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Setup script khởi chạy
COPY docker/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# 10. Mở port
EXPOSE 8080

# 11. Chạy script startup thay vì CMD dài dòng
CMD ["/usr/local/bin/startup.sh"]
