<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
    <div class="p-6 border-b border-gray-700">
      <h2 class="text-2xl font-bold">Recent Logs (Live)</h2>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">IP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr 
            v-for="log in logs" 
            :key="log.id" 
            class="hover:bg-gray-700 transition"
          >
            <td class="px-6 py-4 text-sm">{{ formatTime(log.timestamp) }}</td>
            <td class="px-6 py-4 text-sm font-mono">{{ log.ip }}</td>
            <td class="px-6 py-4 text-sm">{{ log.city }}, {{ log.country }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                {{ log.action }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logs: Array<{
    id: number;
    timestamp: string;
    ip: string;
    country: string;
    city: string;
    action: string;
  }>;
}>();

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};
</script>
