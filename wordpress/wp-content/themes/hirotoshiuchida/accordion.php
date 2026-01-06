<div x-data="{ open: false }" class="border rounded">
  <button
    @click="open = !open"
    class="w-full text-left p-4 font-semibold"
  >
    Open
  </button>

  <div x-show="open" x-cloak class="p-4">
    <?php echo $content ?? 'Accordion Content'; ?>
  </div>
</div>
