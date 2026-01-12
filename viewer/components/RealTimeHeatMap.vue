<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h2 class="text-2xl font-bold mb-4">Geographic Heat Map (Real-Time)</h2>
    <div class="overflow-x-auto">
      <svg ref="svgRef" class="w-full h-auto" viewBox="0 0 1000 500"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import * as d3 from 'd3';

const props = defineProps<{
  data: Array<{
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    count: number;
  }>;
}>();

const svgRef = ref<SVGSVGElement | null>(null);

const renderMap = () => {
  if (!svgRef.value || !props.data.length) return;

  const svg = d3.select(svgRef.value);
  svg.selectAll('*').remove();

  const width = 1000;
  const height = 500;

  const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  const g = svg.append('g');

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then((world: any) => {
      const countries = (window as any).topojson.feature(world, world.objects.countries);

      g.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#2d3748')
        .attr('stroke', '#4a5568')
        .attr('stroke-width', 0.5);

      const maxCount = d3.max(props.data, d => d.count) || 1;
      const radiusScale = d3.scaleSqrt()
        .domain([0, maxCount])
        .range([2, 20]);

      const colorScale = d3.scaleSequential()
        .domain([0, maxCount])
        .interpolator(d3.interpolateYlOrRd);

      props.data.forEach(point => {
        if (point.latitude && point.longitude) {
          const [x, y] = projection([point.longitude, point.latitude]) || [0, 0];

          const circle = g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 0)
            .attr('fill', colorScale(point.count))
            .attr('opacity', 0.7)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

          circle.transition()
            .duration(1000)
            .attr('r', radiusScale(point.count));

          circle.append('title')
            .text(`${point.city}, ${point.country}: ${point.count} visits`);
        }
      });
    });
};

watch(() => props.data, () => {
  renderMap();
}, { deep: true });

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/topojson-client@3';
  script.onload = () => {
    renderMap();
  };
  document.head.appendChild(script);
});
</script>
