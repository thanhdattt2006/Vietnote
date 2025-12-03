# 1. Dùng Image Alpine cho nhẹ (khoảng 50MB)
FROM php:8.2-fpm-alpine

# 2. Copy script cài extension "thần thánh" (Không cần compile)
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# 3. Cài các thư viện cần thiết cho Laravel chỉ trong 1 dòng
# Bạn có thể thêm các extension khác vào cuối dòng nếu cần
RUN install-php-extensions pdo_mysql bcmath zip intl opcache gd

# 4. Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Thiết lập thư mục làm việc
WORKDIR /var/www/html

# 6. COPY file định nghĩa thư viện trước (TỐI ƯU CACHE)
# Bước này giúp Docker bỏ qua việc cài lại vendor nếu bạn chỉ sửa code mà không thêm thư viện mới
COPY composer.json composer.lock ./

# 7. Cài thư viện (dùng cờ --no-dev để bỏ qua thư viện test cho nhẹ)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# 8. Giờ mới copy toàn bộ code vào
COPY . .

# 9. Tối ưu autoloader và phân quyền
RUN composer dump-autoload --optimize && \
    # Sửa user từ www-data sang nginx (User tiêu chuẩn trên Alpine/Nginx)
    chown -R nginx:nginx /var/www/html/storage \
    /var/www/html/bootstrap/cache

# 10. Mở port và chạy
EXPOSE 8000
CMD sh -c "php artisan storage:link && php-fpm && nginx -g 'daemon off;'"
