<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <button @click="open = !open">☰</button>
  <ul v-if="open">
    <li>Home</li>
    <li>Posts</li>
  </ul>
</template>

