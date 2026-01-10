<?php
add_theme_support('title-tag');
add_theme_support('post-thumbnails');

define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

remove_action('wp_head', 'wp_generator');

add_action('wp_enqueue_scripts', function () {
  wp_enqueue_style('theme', get_stylesheet_uri());
  wp_enqueue_style('tailwind', 'https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css');
  wp_enqueue_script('alpine', 'https://unpkg.com/alpinejs@latest/dist/htmx.min.js', [], null, true);
  wp_enqueue_script('htmx', 'https://unpkg.com/htmx.org@latest', [], null, true);
});

add_action('graphql_register_types', function() {});
add_action('init', function () {
  include_once ABSPATH . WPINC . '/feed.php';
  $rss = fetch_feed('https://note.com/uchida_16104/rss');
  if (!is_wp_error($rss)) {
    foreach ($rss->get_items(0, 5) as $item) {
      wp_insert_post([
        'post_title' => $item->get_title(),
        'post_content' => $item->get_content(),
        'post_status' => 'publish'
      ]);
    }
  }
});

remove_role('subscriber');

add_role('editor_safe', 'Editor (Safe)', [
  'read' => true,
  'edit_posts' => true,
  'publish_posts' => false,
  'upload_files' => true
]);
