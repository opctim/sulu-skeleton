FROM php:8.2-fpm-buster AS prod
ARG TIMEZONE

COPY php.ini /usr/local/etc/php/conf.d/docker-php-config.ini

RUN apt-get update && apt-get install -y \
    gnupg \
    g++ \
    procps \
    openssl \
    git \
    unzip \
    zlib1g-dev \
    libzip-dev \
    libfreetype6-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libicu-dev  \
    libonig-dev \
    libxslt1-dev \
    acl \
    software-properties-common \
    chromium \
    && echo 'alias sf="php bin/console"' >> ~/.bashrc \
    && ln -s /usr/bin/chromium /usr/bin/chrome

RUN docker-php-ext-configure gd --with-jpeg --with-freetype --with-webp

RUN docker-php-ext-install \
    pdo pdo_mysql zip xsl gd intl opcache exif mbstring sockets

COPY opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Set timezone
RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone \
    && printf '[PHP]\ndate.timezone = "%s"\n', ${TIMEZONE} > /usr/local/etc/php/conf.d/tzone.ini \
    && "date"

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/symfony

FROM prod AS dev

RUN rm -rf /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini && \
    rm -rf /usr/local/etc/php/conf.d/opcache.ini

COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

RUN pecl install xdebug-3.2.0 && \
    printf '%s\n%s\n' "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" "$(cat /usr/local/etc/php/conf.d/xdebug.ini)" > /usr/local/etc/php/conf.d/xdebug.ini
