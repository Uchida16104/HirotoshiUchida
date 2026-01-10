<?php
/**
 * Plugin Name: Vercel Revalidate
 */

add_action('save_post', function($post_id) {
  if (wp_is_post_revision($post_id)) return;

  wp_remote_post(
    'https://hirotoshiuchida.vercel.app/api/revalidate',
    [
      'headers' => [
        'Authorization' => 'Bearer ' . getenv('VERCEL_REVALIDATE_TOKEN'),
        'Content-Type' => 'application/json'
      ],
      'body' => json_encode(['slug' => get_post_field('post_name', $post_id)])
    ]
  );
});

