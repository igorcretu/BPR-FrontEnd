import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { Award, Target, TrendingUp, Zap, BarChart3, Brain, AlertCircle } from 'lucide-react';
import api from '../api/client';

interface ModelMetrics {
  id: string;
  name: string;
  model_type: string;
  algorithm: string;
  version: string;
  is_active: boolean;
  model_file_path: string;
  mae: number;
  rmse: number;
  r2_score: number;
  mape: number;
  median_ae: number;
  percentile_90_error: number;
  training_time_seconds: number;
  hyperparameters?: any;
  feature_importances?: any;
  created_at: string;
  updated_at: string;
}

interface PerformanceAnalysis {
  overview: ModelMetrics[];
  metrics_comparison: {
    r2_scores: Array<{ model: string; value: number }>;
    mae_values: Array<{ model: string; value: number }>;
    rmse_values: Array<{ model: string; value: number }>;
    mape_values: Array<{ model: string; value: number }>;
    training_times: Array<{ model: string; value: number }>;
  };
  price_range_analysis: Record<string, {
    under_100k: number | null;
    '100k_to_300k': number | null;
    '300k_to_500k': number | null;
    over_500k: number | null;
  }>;
  best_performers: {
    highest_r2: { model: string; value: number };
    lowest_mae: { model: string; value: number };
    fastest_training: { model: string; value: number };
  };
}

interface ChartData {
  bar_charts: {
    r2_comparison: { labels: string[]; data: number[]; title: string; ylabel: string; description: string };
    mae_comparison: { labels: string[]; data: number[]; title: string; ylabel: string; description: string };
    training_time_comparison: { labels: string[]; data: number[]; title: string; ylabel: string; description: string };
  };
  scatter_plot: {
    title: string;
    xlabel: string;
    ylabel: string;
    data: Array<{ x: number; y: number; label: string }>;
  };
  radar_chart: {
    title: string;
    labels: string[];
    datasets: Array<{ label: string; data: number[] }>;
  };
}

const MODEL_COLORS: Record<string, string> = {
  'XGBoost': '#3b82f6',
  'CatBoost': '#8b5cf6',
  'LightGBM': '#06b6d4',
  'RandomForest': '#10b981',
  'HistGradientBoosting': '#f59e0b',
  'Ridge': '#94a3b8',
  'Lasso': '#64748b',
  'ElasticNet': '#ef4444',
  'LSTM': '#ec4899',
  'GRU': '#a855f7'
};

const ModelComparison: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceAnalysis | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'charts'>('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [perfResponse, chartResponse] = await Promise.all([
        api.get('/models/analysis/performance'),
        api.get('/models/charts/comparison')
      ]);
      
      setPerformanceData(perfResponse.data.data);
      setChartData(chartResponse.data.charts);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null | undefined, decimals: number = 2) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('da-DK', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  };

  const formatCompact = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading comprehensive model analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !performanceData || !chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-lg font-semibold">
            {error || 'Failed to load data'}
          </p>
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, metrics_comparison, price_range_analysis, best_performers } = performanceData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-600" />
            ML Model Performance Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive analysis and comparison of {overview.length} machine learning models for car price prediction
          </p>
        </div>

        {/* View Selector */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-2 inline-flex">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Detailed Metrics
          </button>
          <button
            onClick={() => setSelectedView('charts')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'charts'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Charts & Analysis
          </button>
        </div>

        {/* Best Performers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10" />
              <span className="text-sm opacity-90">Best Accuracy</span>
            </div>
            <p className="text-3xl font-bold mb-1">{best_performers.highest_r2.model}</p>
            <p className="text-lg opacity-90">R² Score: {formatNumber(best_performers.highest_r2.value, 4)}</p>
            <p className="text-sm mt-2 opacity-75">Explains {(best_performers.highest_r2.value * 100).toFixed(1)}% of price variance</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-10 h-10" />
              <span className="text-sm opacity-90">Lowest Error</span>
            </div>
            <p className="text-3xl font-bold mb-1">{best_performers.lowest_mae.model}</p>
            <p className="text-lg opacity-90">MAE: {formatCompact(best_performers.lowest_mae.value)} DKK</p>
            <p className="text-sm mt-2 opacity-75">Average prediction error</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-10 h-10" />
              <span className="text-sm opacity-90">Fastest Training</span>
            </div>
            <p className="text-3xl font-bold mb-1">{best_performers.fastest_training.model}</p>
            <p className="text-lg opacity-90">{formatNumber(best_performers.fastest_training.value, 1)}s</p>
            <p className="text-sm mt-2 opacity-75">Training duration</p>
          </div>
        </div>

        {/* Overview Section */}
        {selectedView === 'overview' && (
          <>
            {/* R² Score Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                {chartData.bar_charts.r2_comparison.title}
              </h2>
              <p className="text-sm text-gray-600 mb-6">{chartData.bar_charts.r2_comparison.description}</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.bar_charts.r2_comparison.labels.map((label, idx) => ({
                  name: label,
                  value: chartData.bar_charts.r2_comparison.data[idx]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 1]} label={{ value: chartData.bar_charts.r2_comparison.ylabel, angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => formatNumber(value, 4)} />
                  <Bar dataKey="value" name="R² Score">
                    {chartData.bar_charts.r2_comparison.labels.map((name, index) => (
                      <Cell key={`cell-${index}`} fill={MODEL_COLORS[name] || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* MAE Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                {chartData.bar_charts.mae_comparison.title}
              </h2>
              <p className="text-sm text-gray-600 mb-6">{chartData.bar_charts.mae_comparison.description}</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.bar_charts.mae_comparison.labels.map((label, idx) => ({
                  name: label,
                  value: chartData.bar_charts.mae_comparison.data[idx]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: chartData.bar_charts.mae_comparison.ylabel, angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${formatCompact(value)} DKK`} />
                  <Bar dataKey="value" name="MAE">
                    {chartData.bar_charts.mae_comparison.labels.map((name, index) => (
                      <Cell key={`cell-${index}`} fill={MODEL_COLORS[name] || '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Accuracy vs Training Time Scatter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{chartData.scatter_plot.title}</h2>
              <p className="text-sm text-gray-600 mb-6">Trade-off between model accuracy and training efficiency</p>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    name={chartData.scatter_plot.xlabel}
                    label={{ value: chartData.scatter_plot.xlabel, position: 'bottom', offset: 0 }}
                  />
                  <YAxis
                    dataKey="y"
                    name={chartData.scatter_plot.ylabel}
                    domain={[0.65, 0.95]}
                    label={{ value: chartData.scatter_plot.ylabel, angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis range={[100, 400]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold text-gray-900">{data.label}</p>
                            <p className="text-sm text-gray-600">R²: {formatNumber(data.y, 4)}</p>
                            <p className="text-sm text-gray-600">Training: {formatNumber(data.x, 1)}s</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={chartData.scatter_plot.data}>
                    {chartData.scatter_plot.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODEL_COLORS[entry.label] || '#3b82f6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Detailed Metrics Section */}
        {selectedView === 'detailed' && (
          <>
            {/* Detailed Metrics Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comprehensive Metrics Table</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">R² Score</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">MAE (DKK)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">RMSE (DKK)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">MAPE (%)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Median AE</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">90th %ile</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Train Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overview.map((model) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{formatNumber(model.r2_score, 4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCompact(model.mae)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCompact(model.rmse)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatNumber(model.mape, 2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCompact(model.median_ae)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCompact(model.percentile_90_error)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatNumber(model.training_time_seconds, 1)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Range Analysis */}
            {Object.keys(price_range_analysis).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance by Price Range (MAE in DKK)</h2>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart
                    data={Object.entries(price_range_analysis).map(([name, ranges]) => ({
                      name,
                      '< 100k': ranges.under_100k,
                      '100k-300k': ranges['100k_to_300k'],
                      '300k-500k': ranges['300k_to_500k'],
                      '> 500k': ranges.over_500k
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'MAE (DKK)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => `${formatCompact(value)} DKK`} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="< 100k" fill="#10b981" name="< 100k DKK" />
                    <Bar dataKey="100k-300k" fill="#3b82f6" name="100k-300k DKK" />
                    <Bar dataKey="300k-500k" fill="#f59e0b" name="300k-500k DKK" />
                    <Bar dataKey="> 500k" fill="#ef4444" name="> 500k DKK" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Training Time Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {chartData.bar_charts.training_time_comparison.title}
              </h2>
              <p className="text-sm text-gray-600 mb-6">{chartData.bar_charts.training_time_comparison.description}</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.bar_charts.training_time_comparison.labels.map((label, idx) => ({
                  name: label,
                  value: chartData.bar_charts.training_time_comparison.data[idx]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${formatNumber(value, 1)}s`} />
                  <Bar dataKey="value" name="Training Time">
                    {chartData.bar_charts.training_time_comparison.labels.map((name, index) => (
                      <Cell key={`cell-${index}`} fill={MODEL_COLORS[name] || '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Charts & Analysis Section */}
        {selectedView === 'charts' && (
          <>
            {/* Radar Chart - Multi-Dimensional Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{chartData.radar_chart.title}</h2>
              <p className="text-sm text-gray-600 mb-6">
                All metrics normalized to 0-100 scale (higher is better for all dimensions)
              </p>
              <ResponsiveContainer width="100%" height={550}>
                <RadarChart data={chartData.radar_chart.labels.map((label, i) => {
                  const dataPoint: Record<string, any> = { metric: label };
                  chartData.radar_chart.datasets.forEach((dataset) => {
                    dataPoint[dataset.label] = dataset.data[i];
                  });
                  return dataPoint;
                })}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {chartData.radar_chart.datasets.map((dataset, idx) => (
                    <Radar
                      key={idx}
                      name={dataset.label}
                      dataKey={dataset.label}
                      stroke={MODEL_COLORS[dataset.label] || '#3b82f6'}
                      fill={MODEL_COLORS[dataset.label] || '#3b82f6'}
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics Comparison Lines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* R² Scores Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">R² Score Ranking</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics_comparison.r2_scores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0.65, 0.95]} />
                    <Tooltip formatter={(value: number) => formatNumber(value, 4)} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* MAE Values Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">MAE Ranking (Lower is Better)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics_comparison.mae_values}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${formatCompact(value)} DKK`} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                Model Selection Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">🎯 Best for Accuracy</h3>
                  <p className="text-gray-700 font-semibold mb-1">{best_performers.highest_r2.model}</p>
                  <p className="text-sm text-gray-600">
                    Use when prediction accuracy is the top priority, regardless of computation time.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-bold text-lg text-green-900 mb-2">⚡ Best for Speed</h3>
                  <p className="text-gray-700 font-semibold mb-1">{best_performers.fastest_training.model}</p>
                  <p className="text-sm text-gray-600">
                    Ideal for rapid retraining and quick deployment cycles with good accuracy.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">💎 Best Balanced</h3>
                  <p className="text-gray-700 font-semibold mb-1">
                    {chartData.scatter_plot.data.find(d => d.y > 0.91 && d.x < 100)?.label || 'XGBoost'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Optimal trade-off between accuracy, training speed, and interpretability.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModelComparison;
