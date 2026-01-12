'use client';

export default function ExportButtons() {
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/export/${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `access-logs.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Export Data</h2>
      <div className="flex gap-4">
        <button
          onClick={() => handleExport('csv')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport('json')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}
