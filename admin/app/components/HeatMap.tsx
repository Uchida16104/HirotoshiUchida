'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatMapProps {
  data: Array<{
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    count: number;
  }>;
}

export default function HeatMap({ data }: HeatMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 500;

    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

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

        const maxCount = d3.max(data, d => d.count) || 1;
        const radiusScale = d3.scaleSqrt()
          .domain([0, maxCount])
          .range([2, 20]);

        const colorScale = d3.scaleSequential()
          .domain([0, maxCount])
          .interpolator(d3.interpolateYlOrRd);

        data.forEach(point => {
          if (point.latitude && point.longitude) {
            const [x, y] = projection([point.longitude, point.latitude]) || [0, 0];

            g.append('circle')
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 0)
              .attr('fill', colorScale(point.count))
              .attr('opacity', 0.7)
              .attr('stroke', '#fff')
              .attr('stroke-width', 1)
              .transition()
              .duration(1000)
              .attr('r', radiusScale(point.count));

            g.append('title')
              .text(`${point.city}, ${point.country}: ${point.count} visits`);
          }
        });
      });
  }, [data]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Geographic Heat Map</h2>
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>
    </div>
  );
}
