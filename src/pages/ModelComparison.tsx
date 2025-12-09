import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Award, Clock, Target, Zap, Activity } from 'lucide-react';

interface ModelMetrics {
  id: string;
  name: string;
  model_type: string;
  algorithm: string;
  version: string;
  is_active: boolean;
  mae: number;
  rmse: number;
  r2_score: number;
  mape: number;
  median_ae: number;
  percentile_90_error: number;
  training_time_seconds: number;
  comparison_metrics?: {
    overall_mae: number;
    overall_rmse: number;
    overall_r2: number;
    overall_mape: number;
    mae_under_100k: number;
    mae_100k_300k: number;
    mae_300k_500k: number;
    mae_over_500k: number;
    mae_petrol: number;
    mae_diesel: number;
    mae_electric: number;
    mae_hybrid: number;
    mae_pre_2010: number;
    mae_2010_2015: number;
    mae_2015_2020: number;
    mae_post_2020: number;
    avg_inference_time_ms: number;
    confidence_calibration_score: number;
  };
}

interface TrainingRun {
  id: string;
  run_date: string;
  dataset_size: number;
  train_size: number;
  test_size: number;
  training_duration_seconds: number;
  status: string;
  models_trained: string[];
  best_model_id: string;
}

interface ComparisonData {
  models: ModelMetrics[];
  latest_training_run: TrainingRun | null;
  total_models: number;
}

const MODEL_COLORS: Record<string, string> = {
  'XGBoost': '#3b82f6',
  'CatBoost': '#8b5cf6',
  'Ridge': '#10b981',
  'Lasso': '#f59e0b',
  'ElasticNet': '#ef4444',
  'LSTM': '#06b6d4',
  'GRU': '#ec4899'
};

const ModelComparison: React.FC = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'mae' | 'rmse' | 'r2' | 'mape'>('mae');

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/models/comparison`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading model comparison data...</p>
        </div>
      </div>
    );
  }

  if (error || !comparisonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <p className="text-red-600 mb-4">{error || 'No data available'}</p>
          <button
            onClick={fetchComparisonData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { models, latest_training_run } = comparisonData;

  // Prepare data for charts
  const overallMetricsData = models.map(model => ({
    name: model.name,
    MAE: model.mae,
    RMSE: model.rmse,
    'R² Score': model.r2_score,
    MAPE: model.mape
  }));

  const priceRangeData = models
    .filter(m => m.comparison_metrics)
    .map(model => ({
      name: model.name,
      '<100k': model.comparison_metrics!.mae_under_100k,
      '100k-300k': model.comparison_metrics!.mae_100k_300k,
      '300k-500k': model.comparison_metrics!.mae_300k_500k,
      '>500k': model.comparison_metrics!.mae_over_500k
    }));

  const fuelTypeData = models
    .filter(m => m.comparison_metrics)
    .map(model => ({
      name: model.name,
      Petrol: model.comparison_metrics!.mae_petrol,
      Diesel: model.comparison_metrics!.mae_diesel,
      Electric: model.comparison_metrics!.mae_electric,
      Hybrid: model.comparison_metrics!.mae_hybrid
    }));

  const yearRangeData = models
    .filter(m => m.comparison_metrics)
    .map(model => ({
      name: model.name,
      'Pre-2010': model.comparison_metrics!.mae_pre_2010,
      '2010-2015': model.comparison_metrics!.mae_2010_2015,
      '2015-2020': model.comparison_metrics!.mae_2015_2020,
      'Post-2020': model.comparison_metrics!.mae_post_2020
    }));

  const performanceData = models.map(model => ({
    name: model.name,
    'Training Time (s)': model.training_time_seconds,
    'Inference Time (ms)': model.comparison_metrics?.avg_inference_time_ms || 0
  }));

  // Radar chart data for model comparison
  const radarData = [
    {
      metric: 'Accuracy (R²)',
      ...Object.fromEntries(models.map(m => [m.name, (m.r2_score * 100).toFixed(1)]))
    },
    {
      metric: 'Low Error',
      ...Object.fromEntries(models.map(m => [m.name, (100 - Math.min((m.mae / 10000) * 100, 100)).toFixed(1)]))
    },
    {
      metric: 'Speed',
      ...Object.fromEntries(models.map(m => [m.name, (100 - Math.min((m.training_time_seconds / 100) * 100, 100)).toFixed(1)]))
    },
    {
      metric: 'Confidence',
      ...Object.fromEntries(models.map(m => [m.name, ((m.comparison_metrics?.confidence_calibration_score || 0.5) * 100).toFixed(1)]))
    }
  ];

  // Best model
  const bestModel = models.reduce((best, current) => 
    current.r2_score > best.r2_score ? current : best
  );

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('da-DK', { maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Comparison Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of all ML models for car price prediction</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Best Model</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{bestModel.name}</p>
            <p className="text-sm text-gray-600">R² Score: {formatNumber(bestModel.r2_score)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">Total Models</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{models.length}</p>
            <p className="text-sm text-gray-600">Active models trained</p>
          </div>

          {latest_training_run && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-600" />
                  <span className="text-sm text-gray-500">Dataset Size</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(latest_training_run.dataset_size)}
                </p>
                <p className="text-sm text-gray-600">Total records</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <span className="text-sm text-gray-500">Last Training</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(latest_training_run.training_duration_seconds)}s
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(latest_training_run.run_date).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Overall Metrics Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Overall Performance Metrics</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mae">MAE (Mean Absolute Error)</option>
              <option value="rmse">RMSE (Root Mean Squared Error)</option>
              <option value="r2">R² Score</option>
              <option value="mape">MAPE (Mean Absolute % Error)</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={overallMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetric === 'mae' && <Bar dataKey="MAE" fill="#3b82f6" />}
              {selectedMetric === 'rmse' && <Bar dataKey="RMSE" fill="#8b5cf6" />}
              {selectedMetric === 'r2' && <Bar dataKey="R² Score" fill="#10b981" />}
              {selectedMetric === 'mape' && <Bar dataKey="MAPE" fill="#f59e0b" />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Model Comparison Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Metrics</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMSE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R²</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAPE %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: MODEL_COLORS[model.name] || '#gray' }}
                      ></div>
                      <span className="font-medium text-gray-900">{model.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.model_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.mae)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.rmse)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.r2_score)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.mape)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.training_time_seconds)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance by Price Range */}
        {priceRangeData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance by Price Range (MAE)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="<100k" fill="#10b981" />
                <Bar dataKey="100k-300k" fill="#3b82f6" />
                <Bar dataKey="300k-500k" fill="#f59e0b" />
                <Bar dataKey=">500k" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance by Fuel Type */}
        {fuelTypeData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance by Fuel Type (MAE)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fuelTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Petrol" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Diesel" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Electric" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Hybrid" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance by Year Range */}
        {yearRangeData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance by Year Range (MAE)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yearRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Pre-2010" fill="#6b7280" />
                <Bar dataKey="2010-2015" fill="#3b82f6" />
                <Bar dataKey="2015-2020" fill="#8b5cf6" />
                <Bar dataKey="Post-2020" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Training & Inference Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Training & Inference Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Training Time (s)" fill="#3b82f6" />
              <Bar yAxisId="right" dataKey="Inference Time (ms)" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart - Overall Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-Dimensional Comparison</h2>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {models.map((model) => (
                <Radar
                  key={model.id}
                  name={model.name}
                  dataKey={model.name}
                  stroke={MODEL_COLORS[model.name] || '#gray'}
                  fill={MODEL_COLORS[model.name] || '#gray'}
                  fillOpacity={0.3}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
