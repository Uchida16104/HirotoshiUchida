"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const es = new EventSource(
      "https://hirotoshiuchida.onrender.com/stream"
    );
    es.onmessage = e => setLogs(JSON.parse(e.data));
    return () => es.close();
  }, []);

  const data = {
    labels: logs.map(l => l.timestamp),
    datasets: [
      {
        label: "Page Views",
        data: logs.map((_, i) => i + 1),
      },
      {
        label: "Email Sent",
        data: logs.map(l => (l.email_status === "success" ? 1 : 0)),
        borderColor: "green",
      },
      {
        label: "Clicks",
        data: logs.map(l => (l.action === "click" ? 1 : 0)),
        borderColor: "blue",
      },
      {
        label: "Section Scroll",
        data: logs.map(l => (l.action === "scroll" ? 1 : 0)),
        borderColor: "orange",
      },
    ],
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Activity Dashboard</h1>
      <Line data={data} />
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </main>
  );
}
