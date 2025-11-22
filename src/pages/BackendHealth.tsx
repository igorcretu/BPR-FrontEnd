import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Clock, Server, Database, Cpu, AlertTriangle } from 'lucide-react';
import api from '../api/client';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking';
  message: string;
  timestamp: string;
  responseTime?: number;
}

interface ServiceHealth {
  api: HealthStatus;
  database?: HealthStatus;
  cache?: HealthStatus;
}

export default function BackendHealth() {
  const [health, setHealth] = useState<ServiceHealth>({
    api: { status: 'checking', message: 'Checking...', timestamp: new Date().toISOString() },
  });
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkHealth = async () => {
    const startTime = Date.now();
    setHealth((prev) => ({
      ...prev,
      api: { status: 'checking', message: 'Checking...', timestamp: new Date().toISOString() },
    }));

    try {
      const response = await api.get('/health');
      const responseTime = Date.now() - startTime;

      if (response.status === 200) {
        setHealth({
          api: {
            status: 'healthy',
            message: response.data.message || 'API is healthy',
            timestamp: new Date().toISOString(),
            responseTime,
          },
          database: response.data.database
            ? {
                status: response.data.database.status === 'connected' ? 'healthy' : 'unhealthy',
                message: response.data.database.message || 'Database is connected',
                timestamp: new Date().toISOString(),
              }
            : undefined,
          cache: response.data.cache
            ? {
                status: response.data.cache.status === 'connected' ? 'healthy' : 'unhealthy',
                message: response.data.cache.message || 'Cache is connected',
                timestamp: new Date().toISOString(),
              }
            : undefined,
        });
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      setHealth({
        api: {
          status: 'unhealthy',
          message: error.response?.data?.message || error.message || 'Failed to connect to API',
          timestamp: new Date().toISOString(),
          responseTime,
        },
      });
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      checkHealth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'checking':
        return <Clock className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'unhealthy':
        return 'bg-red-50 border-red-200';
      case 'checking':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Backend Health</h1>
          </div>
          <p className="text-gray-600">Real-time monitoring of backend services</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={checkHealth}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Activity className="w-5 h-5" />
                Refresh Now
              </button>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">Auto-refresh (30s)</span>
              </label>
            </div>
            <div className="text-sm text-gray-500">
              Last checked: {formatTimestamp(lastCheck.toISOString())}
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-4">
          {/* API Health */}
          <div
            className={`rounded-lg shadow-md border-2 p-6 transition-all ${getStatusColor(
              health.api.status
            )}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">API Server</h3>
                  <p className="text-sm text-gray-600">Core backend API</p>
                </div>
              </div>
              {getStatusIcon(health.api.status)}
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">{health.api.message}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Status: <span className="font-semibold">{health.api.status}</span></span>
                {health.api.responseTime && (
                  <span>Response Time: <span className="font-semibold">{health.api.responseTime}ms</span></span>
                )}
                <span>Updated: {formatTimestamp(health.api.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Database Health */}
          {health.database && (
            <div
              className={`rounded-lg shadow-md border-2 p-6 transition-all ${getStatusColor(
                health.database.status
              )}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Database</h3>
                    <p className="text-sm text-gray-600">PostgreSQL connection</p>
                  </div>
                </div>
                {getStatusIcon(health.database.status)}
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">{health.database.message}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Status: <span className="font-semibold">{health.database.status}</span></span>
                  <span>Updated: {formatTimestamp(health.database.timestamp)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cache Health */}
          {health.cache && (
            <div
              className={`rounded-lg shadow-md border-2 p-6 transition-all ${getStatusColor(
                health.cache.status
              )}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cache</h3>
                    <p className="text-sm text-gray-600">Redis connection</p>
                  </div>
                </div>
                {getStatusIcon(health.cache.status)}
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">{health.cache.message}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Status: <span className="font-semibold">{health.cache.status}</span></span>
                  <span>Updated: {formatTimestamp(health.cache.timestamp)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About Health Monitoring</h3>
              <p className="text-gray-700 text-sm">
                This page monitors the health of backend services in real-time. The API server is checked
                automatically every 30 seconds when auto-refresh is enabled. If you notice any issues,
                try refreshing manually or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
