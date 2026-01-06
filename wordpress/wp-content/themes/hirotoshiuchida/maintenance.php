if (file_exists(ABSPATH.'maintenance.flag')) {
include get_theme_file_path('maintenance.php');
exit;
}
