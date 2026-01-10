<?php
add_action('init', function () {
  include_once ABSPATH . WPINC . '/feed.php';
  $feed = fetch_feed('https://note.com/uchida_16104/rss');

  if (is_wp_error($feed)) return;

  foreach ($feed->get_items() as $item) {
    if (get_page_by_title($item->get_title(), OBJECT, 'post')) continue;

    wp_insert_post([
      'post_title'   => $item->get_title(),
      'post_content' => $item->get_content(),
      'post_status'  => 'publish',
      'post_type'    => 'post',
    ]);
  }
});

