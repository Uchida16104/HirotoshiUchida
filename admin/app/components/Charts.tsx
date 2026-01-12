'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartsProps {
  stats: {
    topCountries: Array<{ country: string; count: number }>;
    topCities: Array<{ city: string; country: string; count: number }>;
  };
}

export default function Charts({ stats }: ChartsProps) {
  const countriesChartRef = useRef<HTMLCanvasElement>(null);
  const citiesChartRef = useRef<HTMLCanvasElement>(null);
  const countriesChartInstance = useRef<Chart | null>(null);
  const citiesChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!stats) return;

    if (countriesChartRef.current) {
      if (countriesChartInstance.current) {
        countriesChartInstance.current.destroy();
      }

      const ctx = countriesChartRef.current.getContext('2d');
      if (ctx) {
        countriesChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: stats.topCountries.map(c => c.country),
            datasets: [{
              label: 'Visits by Country',
              data: stats.topCountries.map(c => c.count),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#9ca3af'
                },
                grid: {
                  color: '#374151'
                }
              },
              x: {
                ticks: {
                  color: '#9ca3af'
                },
                grid: {
                  color: '#374151'
                }
              }
            }
          }
        });
      }
    }

    if (citiesChartRef.current) {
      if (citiesChartInstance.current) {
        citiesChartInstance.current.destroy();
      }

      const ctx = citiesChartRef.current.getContext('2d');
      if (ctx) {
        citiesChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: stats.topCities.map(c => `${c.city}, ${c.country}`),
            datasets: [{
              label: 'Visits by City',
              data: stats.topCities.map(c => c.count),
              backgroundColor: [
                'rgba(239, 68, 68, 0.5)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(16, 185, 129, 0.5)',
                'rgba(245, 158, 11, 0.5)',
                'rgba(139, 92, 246, 0.5)',
                'rgba(236, 72, 153, 0.5)',
                'rgba(20, 184, 166, 0.5)',
                'rgba(251, 146, 60, 0.5)',
                'rgba(132, 204, 22, 0.5)',
                'rgba(248, 113, 113, 0.5)'
              ],
              borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(236, 72, 153, 1)',
                'rgba(20, 184, 166, 1)',
                'rgba(251, 146, 60, 1)',
                'rgba(132, 204, 22, 1)',
                'rgba(248, 113, 113, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#fff'
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (countriesChartInstance.current) {
        countriesChartInstance.current.destroy();
      }
      if (citiesChartInstance.current) {
        citiesChartInstance.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Top Countries</h3>
        <div style={{ height: '300px' }}>
          <canvas ref={countriesChartRef}></canvas>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Top Cities</h3>
        <div style={{ height: '300px' }}>
          <canvas ref={citiesChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
