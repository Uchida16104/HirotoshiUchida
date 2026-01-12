'use client';

import { useState } from 'react';

interface Log {
  id: number;
  timestamp: string;
  ip: string;
  country: string;
  city: string;
  action: string;
  section: string;
  userAgent: string;
  referer: string;
}

interface LogsTableProps {
  logs: Log[];
}

export default function LogsTable({ logs }: LogsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Recent Access Logs</h2>
        <p className="text-gray-400 text-sm mt-1">Last {logs.length} entries (Real-time)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                IP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {logs.map((log) => (
              <>
                <tr key={log.id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.city}, {log.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.section || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleRow(log.id)}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      {expandedRow === log.id ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
                {expandedRow === log.id && (
                  <tr className="bg-gray-750">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-2">
                        <p><strong>User Agent:</strong> {log.userAgent}</p>
                        <p><strong>Referer:</strong> {log.referer}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
