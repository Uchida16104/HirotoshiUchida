#!/bin/bash
node /var/www/html/script.js &
exec apache2ctl -D FOREGROUND
