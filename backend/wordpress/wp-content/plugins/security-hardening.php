<?php
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');

add_filter('xmlrpc_enabled', '__return_false');
add_filter('render_block', function ($html) {
  return wp_kses_post($html);
});

add_action('send_headers', function () {
  header('X-Frame-Options: SAMEORIGIN');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: strict-origin');
});

