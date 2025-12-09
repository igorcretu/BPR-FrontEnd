import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Clock, Server, Database, Cpu, AlertTriangle, Download, Brain, TrendingUp } from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking';
  message: string;
  timestamp: string;
  responseTime?: number;
}

interface MLModelInfo {
  version?: string;
  loaded?: boolean;
  type?: string;
  model_name?: string;
  test_r2?: number | string;
  test_mae?: number | string;
  features_count?: number;
}

interface MLModelStatus {
  id: string;
  name: string;
  algorithm: string;
  is_active: boolean;
  r2_score: number | null;
  mae: number | null;
  version: string;
  created_at: string;
}

interface ScrapingStatus {
  last_run: string | null;
  completed_at: string | null;
  success: boolean;
  cars_scraped: number;
  cars_new: number;
  cars_updated: number;
  images_downloaded: number;
  error_message: string | null;
  source: string;
  error?: string;
}

interface TrainingStatus {
  last_run: string | null;
  status: string;
  dataset_size: number;
  train_size: number;
  test_size: number;
  duration_seconds: number | null;
  models_trained: string[];
  best_model_id: string | null;
  error?: string;
}

interface ProcessStatus {
  running: boolean;
  process_count?: number;
  pids?: number[];
  error?: string;
}

interface ServiceHealth {
  api: HealthStatus;
  database?: HealthStatus;
  cache?: HealthStatus;
  mlModel?: MLModelInfo;
  mlModels?: MLModelStatus[] | { error: string };
  scraping?: ScrapingStatus | null;
  training?: TrainingStatus | null;
  processes?: {
    scraper?: ProcessStatus;
    training?: ProcessStatus;
  };
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
      // Use fetch directly to avoid the /api prefix from the client
      const apiHost = (import.meta.env.VITE_API_URL || 'https://test.bachelorproject26.site').replace(/\/$/, '');
      const response = await fetch(`${apiHost}/health`);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        setHealth({
          api: {
            status: 'healthy',
            message: data.message || 'API is healthy',
            timestamp: new Date().toISOString(),
            responseTime,
          },
          database: data.database
            ? {
                status: data.database.status === 'connected' ? 'healthy' : 'unhealthy',
                message: data.database.message || 'Database is connected',
                timestamp: new Date().toISOString(),
              }
            : undefined,
          cache: data.cache
            ? {
                status: data.cache.status === 'connected' ? 'healthy' : 'unhealthy',
                message: data.cache.message || 'Cache is connected',
                timestamp: new Date().toISOString(),
              }
            : undefined,
          mlModel: data.ml_model || undefined,
          mlModels: data.ml_models || undefined,
          scraping: data.scraping || null,
          training: data.training || null,
        });
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      setHealth({
        api: {
          status: 'unhealthy',
          message: error.message || 'Failed to connect to API',
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Left side - Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <button
                onClick={checkHealth}
                disabled={health.api.status === 'checking'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Activity className={`w-5 h-5 ${health.api.status === 'checking' ? 'animate-spin' : ''}`} />
                {health.api.status === 'checking' ? 'Checking...' : 'Refresh Now'}
              </button>
              
              <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">Auto-refresh</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">30s</span>
                </div>
              </label>
            </div>
            
            {/* Right side - Last check info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last Checked</span>
                <span className="text-sm font-semibold text-gray-900">{formatTimestamp(lastCheck.toISOString())}</span>
              </div>
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

          {/* ML Model / Predictor Health */}
          {health.mlModel && (
            <div
              className={`rounded-lg shadow-md border-2 p-6 transition-all ${health.mlModel.loaded ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">ML Price Predictor</h3>
                    <p className="text-sm text-gray-600">Machine learning model</p>
                  </div>
                </div>
                {health.mlModel.loaded ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  {health.mlModel.loaded ? 'Model loaded and ready' : 'Using heuristic fallback'}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <span>Type: <span className="font-semibold">{health.mlModel.type || 'N/A'}</span></span>
                  <span>Version: <span className="font-semibold">{health.mlModel.version || 'N/A'}</span></span>
                  {health.mlModel.model_name && health.mlModel.model_name !== 'N/A' && (
                    <span>Model: <span className="font-semibold">{health.mlModel.model_name}</span></span>
                  )}
                  {health.mlModel.features_count && (
                    <span>Features: <span className="font-semibold">{health.mlModel.features_count}</span></span>
                  )}
                  {health.mlModel.test_r2 && health.mlModel.test_r2 !== 'N/A' && (
                    <span>R² Score: <span className="font-semibold">{typeof health.mlModel.test_r2 === 'number' ? health.mlModel.test_r2.toFixed(4) : health.mlModel.test_r2}</span></span>
                  )}
                  {health.mlModel.test_mae && health.mlModel.test_mae !== 'N/A' && (
                    <span>MAE: <span className="font-semibold">{typeof health.mlModel.test_mae === 'number' ? health.mlModel.test_mae.toFixed(0) : health.mlModel.test_mae}</span></span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All ML Models Status */}
          {health.mlModels && Array.isArray(health.mlModels) && health.mlModels.length > 0 && (
            <div className="rounded-lg shadow-md border-2 bg-purple-50 border-purple-200 p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">All ML Models</h3>
                    <p className="text-sm text-gray-600">{health.mlModels.length} registered models</p>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="space-y-3">
                {health.mlModels.map((model) => (
                  <div key={model.id} className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{model.name}</h4>
                        <p className="text-sm text-gray-600">{model.algorithm} v{model.version}</p>
                      </div>
                      {model.is_active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Inactive</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {model.r2_score !== null && (
                        <span>R² Score: <span className="font-semibold text-purple-700">{model.r2_score.toFixed(4)}</span></span>
                      )}
                      {model.mae !== null && (
                        <span>MAE: <span className="font-semibold text-purple-700">{model.mae.toFixed(0)} DKK</span></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scraping Status */}
          {health.scraping && !health.scraping.error && (
            <div className={`rounded-lg shadow-md border-2 p-6 transition-all ${health.scraping.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-teal-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Data Scraping</h3>
                    <p className="text-sm text-gray-600">Latest scraping run</p>
                    {health.processes?.scraper?.running && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Currently Running
                      </span>
                    )}
                  </div>
                </div>
                {health.scraping.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  {health.scraping.success ? 'Last scraping completed successfully' : 'Last scraping failed'}
                </p>
                {health.scraping.error_message && (
                  <p className="text-red-600 text-sm">{health.scraping.error_message}</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <span>Source: <span className="font-semibold">{health.scraping.source}</span></span>
                  <span>Cars Scraped: <span className="font-semibold">{health.scraping.cars_scraped}</span></span>
                  <span>New: <span className="font-semibold text-green-600">{health.scraping.cars_new}</span></span>
                  <span>Updated: <span className="font-semibold text-blue-600">{health.scraping.cars_updated}</span></span>
                  <span>Images: <span className="font-semibold">{health.scraping.images_downloaded}</span></span>
                  {health.scraping.last_run && (
                    <span>Started: <span className="font-semibold">{new Date(health.scraping.last_run).toLocaleString()}</span></span>
                  )}
                  {health.scraping.completed_at && (
                    <span>Completed: <span className="font-semibold">{new Date(health.scraping.completed_at).toLocaleString()}</span></span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Training Status */}
          {health.training && !health.training.error && (
            <div className={`rounded-lg shadow-md border-2 p-6 transition-all ${health.training.status === 'completed' ? 'bg-green-50 border-green-200' : health.training.status === 'failed' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Model Training</h3>
                    <p className="text-sm text-gray-600">Latest training run</p>
                    {health.processes?.training?.running && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Currently Running
                      </span>
                    )}
                  </div>
                </div>
                {health.training.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : health.training.status === 'failed' ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Training {health.training.status}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <span>Status: <span className="font-semibold capitalize">{health.training.status}</span></span>
                  {health.training.dataset_size && (
                    <span>Dataset: <span className="font-semibold">{health.training.dataset_size.toLocaleString()} cars</span></span>
                  )}
                  {health.training.train_size && (
                    <span>Train Set: <span className="font-semibold">{health.training.train_size.toLocaleString()}</span></span>
                  )}
                  {health.training.test_size && (
                    <span>Test Set: <span className="font-semibold">{health.training.test_size.toLocaleString()}</span></span>
                  )}
                  {health.training.duration_seconds && (
                    <span>Duration: <span className="font-semibold">{Math.round(health.training.duration_seconds)}s</span></span>
                  )}
                  {health.training.models_trained && health.training.models_trained.length > 0 && (
                    <span className="col-span-2">Models: <span className="font-semibold">{health.training.models_trained.join(', ')}</span></span>
                  )}
                  {health.training.last_run && (
                    <span className="col-span-2">Last Run: <span className="font-semibold">{new Date(health.training.last_run).toLocaleString()}</span></span>
                  )}
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
