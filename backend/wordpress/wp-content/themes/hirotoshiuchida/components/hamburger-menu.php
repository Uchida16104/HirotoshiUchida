<nav class="p-4 border-b" x-data="{open:false}">
  <button onclick="this.nextElementSibling.classList.toggle('hidden')">
    ☰
  </button>
  <ul class="hidden mt-4 space-y-2"  x-show="open">
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
  </ul>
</nav>
