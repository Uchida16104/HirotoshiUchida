<div class="border p-4">
  <button onclick="this.nextElementSibling.classList.toggle('hidden')">
    <?php echo esc_html($title ?? 'Open'); ?>
  </button>
  <div class="hidden mt-2">
    <?php echo $content ?? ''; ?>
  </div>
</div>

