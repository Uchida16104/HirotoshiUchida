<template>
  <div 
    v-if="showBanner" 
    class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-6 shadow-2xl z-50"
  >
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex-1">
        <h3 class="text-white font-bold text-lg mb-2">Cookie Notice</h3>
        <p class="text-gray-300 text-sm">
          This website uses cookies for analytics purposes. By continuing, you agree to our 
          <a href="/privacy" target="_blank" class="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
        </p>
      </div>
      <div class="flex gap-4">
        <button
          @click="handleDecline"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
        >
          Decline
        </button>
        <button
          @click="handleAccept"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showBanner = ref(false);

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    showBanner.value = true;
  }
});

const handleAccept = () => {
  localStorage.setItem('cookieConsent', 'accepted');
  showBanner.value = false;
};

const handleDecline = () => {
  localStorage.setItem('cookieConsent', 'declined');
  showBanner.value = false;
};
</script>
