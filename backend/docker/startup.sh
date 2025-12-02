#!/bin/sh

# 1. Chạy Migration và Seed (Tự động nhập dữ liệu mẫu)
# Lưu ý: --force để chạy được trên production
echo "Running migrations..."
php artisan migrate --force --seed

# 2. Khởi động PHP-FPM dưới dạng Daemon (Chạy ngầm)
echo "Starting PHP-FPM..."
php-fpm -D

# 3. Khởi động Nginx (Chạy nổi để giữ container sống)
echo "Starting Nginx..."
nginx -g "daemon off;"
