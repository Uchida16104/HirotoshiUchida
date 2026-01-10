<script>
  let open = false;
</script>

<button on:click={() => open = !open}>☰</button>
{#if open}
<ul>
  <li>Home</li>
  <li>Posts</li>
</ul>
{/if}

