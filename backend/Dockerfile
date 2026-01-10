FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y apache2 nodejs npm grep net-tools

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm install

COPY . /var/www/html/

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 3000
CMD ["/start.sh"]

FROM wordpress:php8.4-apache

RUN docker-php-ext-install mysqli

FROM wordpress:php8.3-apache

ENV WORDPRESS_DB_HOST=${DB_HOST}
ENV WORDPRESS_DB_USER=${DB_USER}
ENV WORDPRESS_DB_PASSWORD=${DB_PASSWORD}
ENV WORDPRESS_DB_NAME=${DB_NAME}

COPY wordpress /var/www/html
RUN chown -R www-data:www-data /var/www/html

