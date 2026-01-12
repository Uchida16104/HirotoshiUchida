<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="bg-gray-800 border-b border-gray-700 py-6">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-3xl font-bold">Access Logs Viewer</h1>
        <p class="text-gray-400 mt-2">Real-time visitor tracking</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <CookieBanner />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-gray-400 text-sm font-medium">Total Visits</h3>
          <p class="text-3xl font-bold mt-2">{{ totalVisits }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-gray-400 text-sm font-medium">Countries</h3>
          <p class="text-3xl font-bold mt-2">{{ countriesCount }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-gray-400 text-sm font-medium">Cities</h3>
          <p class="text-3xl font-bold mt-2">{{ citiesCount }}</p>
        </div>
      </div>

      <RealTimeHeatMap :data="heatmapData" />
      
      <LogViewer :logs="recentLogs" />
    </main>

    <footer class="text-center py-8 text-gray-500">
      <p>© {{ new Date().getFullYear() }} Hirotoshi Uchida</p>
      <p class="text-sm mt-2">
        <a href="/privacy" class="hover:text-white transition">Privacy Policy</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const config = useRuntimeConfig();
const totalVisits = ref(0);
const countriesCount = ref(0);
const citiesCount = ref(0);
const heatmapData = ref([]);
const recentLogs = ref([]);
let ws: WebSocket | null = null;

const fetchStats = async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/stats`);
    const data = await response.json();
    
    if (data.stats) {
      totalVisits.value = data.stats.totalVisits;
      countriesCount.value = data.stats.countriesCount;
      citiesCount.value = data.stats.citiesCount;
      recentLogs.value = data.stats.recentLogs;
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
};

const fetchHeatmap = async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/heatmap`);
    const data = await response.json();
    heatmapData.value = data.data;
  } catch (err) {
    console.error('Failed to fetch heatmap:', err);
  }
};

const connectWebSocket = () => {
  const wsUrl = config.public.wsUrl.replace('https://', 'wss://').replace('http://', 'ws://');
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'newLog') {
        recentLogs.value = [data.data, ...recentLogs.value.slice(0, 19)];
        fetchStats();
        fetchHeatmap();
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    setTimeout(connectWebSocket, 5000);
  };
};

onMounted(() => {
  fetchStats();
  fetchHeatmap();
  connectWebSocket();
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script>
