<?php
add_action('init', function () {
  $json = wp_remote_get(
    'https://raw.githubusercontent.com/Uchida16104/Post/main/posts.json'
  );
  if (is_wp_error($json)) return;

  $posts = json_decode(wp_remote_retrieve_body($json), true);

  foreach ($posts as $p) {
    if (get_page_by_title($p['title'], OBJECT, 'post')) continue;

    wp_insert_post([
      'post_title'   => $p['title'],
      'post_content' => $p['content'],
      'post_status'  => 'publish'
    ]);
  }
});
