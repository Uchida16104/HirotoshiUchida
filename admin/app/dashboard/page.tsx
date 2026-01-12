'use client';

import { useState, useEffect } from 'react';
import HeatMap from '../components/HeatMap';
import LogsTable from '../components/LogsTable';
import Charts from '../components/Charts';
import ExportButtons from '../components/ExportButtons';
import CookieConsent from '../components/CookieConsent';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    fetchData();
    connectWebSocket();

    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init({
        duration: 800,
        once: true
      });
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [statsRes, logsRes, heatmapRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?limit=100`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/heatmap`, { headers })
      ]);

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();
      const heatmapDataRes = await heatmapRes.json();

      setStats(statsData.stats);
      setLogs(logsData.logs);
      setHeatmapData(heatmapDataRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'newLog') {
          setLogs((prevLogs) => [data.data, ...prevLogs.slice(0, 99)]);
          fetchData();
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(connectWebSocket, 5000);
    };

    setWs(websocket);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CookieConsent />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Total Visits</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalVisits || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Unique IPs</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.uniqueIPs || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Countries</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.countriesCount || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Cities</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.citiesCount || 0}</p>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <ExportButtons />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <HeatMap data={heatmapData} />
      </div>

      <div data-aos="fade-up" data-aos-delay="300">
        <Charts stats={stats} />
      </div>

      <div data-aos="fade-up" data-aos-delay="400">
        <LogsTable logs={logs} />
      </div>
    </div>
  );
}
