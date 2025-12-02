# Dùng base image Alpine PHP-FPM (tối ưu, nhẹ nhàng)
FROM php:8.2-fpm-alpine

# Cài đặt các Dependencies cần thiết
RUN apk update && apk add \
    nginx \
    git \
    curl \
    mysql-client \
    imagemagick \
    libxml2-dev \
    # Các extension PHP cần thiết cho Laravel
    php82-dom \
    php82-pdo \
    php82-pdo_mysql \
    php82-session \
    php82-json \
    php82-mbstring \
    php82-tokenizer \
    php82-fileinfo \
    php82-xml \
    php82-gd \
    php82-exif \
    php82-opcache \
    && rm -rf /var/cache/apk/*

# Cài đặt Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Thiết lập thư mục làm việc và User
WORKDIR /var/www/html
RUN chown -R www-data:www-data /var/www/html

# Sao chép code Laravel vào container
COPY . /var/www/html

# Chạy lệnh Build (Composer Install)
RUN composer install --optimize-autoloader --no-dev

# Cấu hình Nginx để trỏ về public/index.php
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Exposed Port
EXPOSE 8080

# Chạy PHP-FPM và Nginx khi container khởi động
CMD sh -c "php-fpm && nginx -g 'daemon off;'"
