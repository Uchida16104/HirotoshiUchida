FROM wordpress:php8.3-apache

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    net-tools \
    grep \
    unzip \
    git \
    vim \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zlib1g-dev \
    build-essential \
    lsb-release \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install mysqli pdo pdo_mysql mbstring xml gd

ENV WORDPRESS_DB_HOST=${DB_HOST}
ENV WORDPRESS_DB_USER=${DB_USER}
ENV WORDPRESS_DB_PASSWORD=${DB_PASSWORD}
ENV WORDPRESS_DB_NAME=${DB_NAME}

WORKDIR /var/www/html

COPY wordpress/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html

COPY package.json package-lock.json ./
RUN if [ -f package.json ]; then npm install; fi

COPY script.js /var/www/html/

EXPOSE 80

CMD ["apache2-foreground"]
