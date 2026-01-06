<!doctype html>
<html <?php language_attributes(); ?>>
<body <?php body_class(); ?> x-data="{open:false}">
<header class="sticky top-0 bg-white">
<button @click="open=!open">☰</button>
<nav x-show="open"><?php wp_nav_menu(['theme_location'=>'global']); ?></nav>
</header>
