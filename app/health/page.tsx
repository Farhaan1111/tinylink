// app/health/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  ok: boolean;
  version: string;
  timestamp: string;
  uptime: number;
  database: boolean;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/healthz');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Test database connection
        const dbResponse = await fetch('/api/test-db');
        const dbData = await dbResponse.json();
        
        setHealth({
          ...data,
          database: dbData.success,
        });
      } catch (err) {
        setError('Health check failed');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health</h1>
        <p className="text-gray-600">Check the status of TinyLink services</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking system health...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : health && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className={`rounded-lg shadow-sm border p-6 ${
            health.ok && health.database ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  System Status: {health.ok && health.database ? 'Healthy' : 'Unhealthy'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {health.ok && health.database 
                    ? 'All systems are operational' 
                    : 'Some services are experiencing issues'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.ok && health.database 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {health.ok && health.database ? 'OPERATIONAL' : 'ISSUES'}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">API Service</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    health.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {health.ok ? 'OK' : 'ERROR'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Database</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    health.database ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {health.database ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Version</span>
                  <span className="text-gray-900 font-mono">{health.version}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Uptime</span>
                  <span className="text-gray-900">{formatUptime(health.uptime)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Last Check</span>
                  <span className="text-gray-900">
                    {new Date(health.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Environment</span>
                  <span className="text-gray-900">
                    {process.env.NODE_ENV || 'development'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh Status
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}