<!doctype html>
<html lang="en" class="h-full scroll-smooth">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hirotoshi Uchida</title>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Person",
 "name": "Hirotoshi Uchida",
 "url": "https://hirotoshiuchida.onrender.com"
}
</script>

<script src="https://cdn.tailwindcss.com"></script>

<script src="https://unpkg.com/htmx.org@latest"></script>
<script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
<script src="https://unpkg.com/hyperscript.org@latest"></script>

<script type="importmap">
{
 "imports": {
  "alpinejs": "https://cdn.jsdelivr.net/npm/alpinejs@latest/dist/module.esm.js",
  "motion": "https://cdn.jsdelivr.net/npm/motion@latest/+esm"
 }
}
</script>

<script type="module">
import Alpine from "alpinejs";
import { animate } from "motion";

window.Alpine = Alpine;
window.motionAnimate = animate;

Alpine.start();
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@latest/dist/aos.css">
<script src="https://cdn.jsdelivr.net/npm/aos@latest/dist/aos.js"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@latest/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@latest/swiper-bundle.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad:true });</script>

<script src="https://cdn.jsdelivr.net/npm/lottie-web@latest/build/player/lottie.min.js"></script>

<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@latest/dist/shoelace.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@latest/dist/themes/dark.css">

<script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>

<style>
@media (prefers-reduced-motion: reduce) {
 * { animation: none !important; transition: none !important; }
}
</style>
</head>

<body class="bg-black text-white min-h-full">

<header x-data="{open:false}" class="fixed inset-x-0 top-0 z-50 bg-black/70 backdrop-blur">
<nav class="max-w-7xl mx-auto flex justify-between p-4">
<span class="font-bold">Hirotoshi Uchida</span>

<button @click="open=!open"
        aria-label="Menu"
        :aria-expanded="open.toString()"
        class="md:hidden">
<iconify-icon icon="mdi:menu" width="28"></iconify-icon>
</button>

<ul class="hidden md:flex gap-6">
<li><a href="#about">About</a></li>
<li><a href="#portfolio">Portfolio</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</nav>

<ul x-show="open" x-transition @click.outside="open=false"
    class="md:hidden bg-black border-t p-4 space-y-3">
<li><a href="#about">About</a></li>
<li><a href="#portfolio">Portfolio</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</header>

<main class="pt-28 space-y-32">

<section id="about" class="max-w-4xl mx-auto" data-aos="fade-up">
<h1 class="text-4xl font-bold">Hirotoshi Uchida</h1>
<p class="opacity-80 mt-4">Creator / Developer</p>
</section>

<section id="portfolio" class="max-w-6xl mx-auto" data-aos="fade-up">
<h2 class="text-3xl font-bold mb-6">Portfolio</h2>

<div x-data="{open:false}" class="border rounded">
<button @click="open=!open" class="w-full p-4 text-left font-bold">
Projects
</button>
<div x-show="open" x-transition class="p-4 opacity-80">
Project descriptions here.
</div>
</div>
</section>

<section id="contact" class="max-w-4xl mx-auto" x-data="contactForm()" data-aos="fade-up">
<h2 class="text-3xl font-bold mb-4">Contact</h2>

<form x-show="step==='form'" @submit.prevent="send" class="space-y-3">
<input x-model="form.user_name" required class="w-full p-2 text-black" placeholder="Name">
<input x-model="form.user_email" type="email" required class="w-full p-2 text-black" placeholder="Email">
<textarea x-model="form.message" required class="w-full p-2 text-black"></textarea>
<button class="border px-6 py-2">Send</button>
</form>

<div x-show="step==='success'" class="text-green-400">
Email sent successfully.
</div>
</section>

</main>

<footer class="text-center py-8 opacity-70">
© {{ date('Y') }} Hirotoshi Uchida
</footer>

<script>
AOS.init();
emailjs.init("T01AZMGjUWoJO_TM_");

function contactForm(){
 return {
  step: 'form',
  form: { user_name:'', user_email:'', message:'' },
  send(){
   emailjs.send("default_service","template_default",this.form)
     .then(() => this.step='success');
  }
 }
}
</script>

</body>
</html>
