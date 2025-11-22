import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, Car, Calendar, Gauge, Fuel, Box, Activity } from 'lucide-react';
import api from '../api/client';

interface OverallStats {
  total_cars: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  avg_mileage: number;
  avg_year: number;
}

interface BrandStat {
  brand: string;
  total_cars: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

interface FuelTypeStat {
  type: string;
  count: number;
  avg_price: number;
}

interface YearStat {
  year: number;
  count: number;
  avg_price: number;
  avg_mileage: number;
}

interface MarketStatistics {
  overall: OverallStats;
  brands: BrandStat[];
  fuel_types: FuelTypeStat[];
  body_types: Array<{ type: string; count: number; avg_price: number }>;
  transmissions: Array<{ type: string; count: number }>;
  years: YearStat[];
  price_ranges: Array<{ range: string; count: number }>;
  mileage_by_year: Array<{ year: number; avg_mileage: number; min_mileage: number; max_mileage: number }>;
  models_by_brand: Record<string, Array<{ model: string; count: number; avg_price: number }>>;
  price_trend: Array<{ date: string; avg_price: number; listings: number }>;
  horsepower_ranges: Array<{ range: string; count: number }>;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];

export default function MarketStatistics() {
  const [statistics, setStatistics] = useState<MarketStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/market/statistics');
        setStatistics(response.data.statistics);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load market statistics. The statistics endpoint may not be available yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-7xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {error ? 'Unable to Load Statistics' : 'No Statistics Available'}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {error 
                ? 'We encountered an issue loading the market statistics. This might be due to a temporary connection problem.'
                : 'Market statistics are currently not available. Please check back later.'}
            </p>

            {/* Helpful Info */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <Activity className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What you can do:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Refresh the page to try again</li>
                    <li>• Browse our available cars in the meantime</li>
                    <li>• Try the price prediction tool</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <Activity className="w-5 h-5" />
                Retry Loading
              </button>
              
              <Link
                to="/cars"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <Car className="w-5 h-5" />
                Market Analysis
              </Link>
            </div>

            {/* Additional Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-4">Or explore other features:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  to="/predict" 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-medium shadow-sm hover:shadow"
                >
                  Price Prediction
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-medium shadow-sm hover:shadow"
                >
                  How It Works
                </Link>
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-medium shadow-sm hover:shadow"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('da-DK').format(Math.round(num));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Real-Time Market Data</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Danish Car Market Statistics
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Comprehensive insights and trends from thousands of car listings across Denmark
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Overall Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(statistics.overall.total_cars)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Price</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatPrice(statistics.overall.avg_price)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Mileage</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(statistics.overall.avg_mileage)} km
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Gauge className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Year</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(statistics.overall.avg_year)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Price Trend Chart */}
        {statistics.price_trend.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Price Trend (Last 30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statistics.price_trend}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatPrice(value)} />
                <Area type="monotone" dataKey="avg_price" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Brands by Listings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Top Brands by Listings
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statistics.brands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_cars" fill="#3B82F6" name="Total Cars" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Price by Brand */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Average Price by Brand
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statistics.brands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatPrice(value)} />
              <Bar dataKey="avg_price" fill="#10B981" name="Average Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Fuel className="w-6 h-6 text-purple-600" />
              Fuel Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.fuel_types}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statistics.fuel_types.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Box className="w-6 h-6 text-indigo-600" />
              Body Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.body_types}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statistics.body_types.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cars by Year */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-600" />
            Cars by Model Year
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statistics.years}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === 'avg_price') return formatPrice(value);
                return formatNumber(value);
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3B82F6" name="Number of Cars" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="avg_price" stroke="#10B981" name="Average Price" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mileage by Year */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-purple-600" />
            Average Mileage by Year
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statistics.mileage_by_year}>
              <defs>
                <linearGradient id="colorMileage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k km`} />
              <Tooltip formatter={(value: number) => `${formatNumber(value)} km`} />
              <Area type="monotone" dataKey="avg_mileage" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMileage)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Ranges Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Price Range Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.price_ranges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" name="Number of Cars" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Horsepower Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-600" />
            Horsepower Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.horsepower_ranges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" name="Number of Cars" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Models by Brand */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Models by Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(statistics.models_by_brand).map(([brand, models]) => (
              <div key={brand} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-blue-600 mb-3">{brand}</h3>
                <div className="space-y-2">
                  {models.map((model, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{model.model}</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{model.count} cars</div>
                        <div className="text-xs text-gray-500">{formatPrice(model.avg_price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transmission Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics.transmissions.map((trans, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{formatNumber(trans.count)}</div>
                <div className="text-sm text-gray-600 mt-1">{trans.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
