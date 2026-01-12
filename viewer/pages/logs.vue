<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">All Access Logs</h1>
      
      <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Timestamp</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">IP</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-700">
              <td class="px-6 py-4 text-sm">{{ new Date(log.timestamp).toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm">{{ log.ip }}</td>
              <td class="px-6 py-4 text-sm">{{ log.city }}, {{ log.country }}</td>
              <td class="px-6 py-4 text-sm">{{ log.action }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const logs = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/logs?limit=100`);
    const data = await response.json();
    logs.value = data.logs;
  } catch (err) {
    console.error('Failed to fetch logs:', err);
  }
});
</script>
