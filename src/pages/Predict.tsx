import { useState } from 'react';
import { TrendingUp, Car, AlertCircle, CheckCircle, Zap, Fuel, Settings } from 'lucide-react';
import api from '../api/client';

const BRANDS = [
  'Audi', 'BMW', 'Citroën', 'Cupra', 'Dacia', 'Fiat', 'Ford', 'Honda', 'Hyundai',
  'Jaguar', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mini', 'Nissan',
  'Opel', 'Peugeot', 'Polestar', 'Porsche', 'Renault', 'Seat', 'Skoda', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
].sort();

const COLORS = [
  'Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Orange', 'Yellow'
];

export default function Predict() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    horsepower: '',
    engine_size: '',
    doors: 5,
    color: '',
    drive_type: 'FWD',
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        mileage: parseInt(formData.mileage) || 0,
        horsepower: formData.horsepower ? parseInt(formData.horsepower) : undefined,
        engine_size: formData.engine_size ? parseFloat(formData.engine_size) : undefined,
      };
      const response = await api.post('/predict', payload);
      setPrediction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(price);

  const isElectric = formData.fuel_type === 'Electric';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI Price Prediction</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Predict Car Price</h1>
          <p className="text-lg text-gray-600">Get an instant AI-powered price estimate for the Danish market</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <select
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select brand</option>
                    {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Corolla, Golf, Model 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 45000"
                  />
                </div>
              </div>
            </div>

            {/* Powertrain */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {isElectric ? <Zap className="w-5 h-5 text-green-600" /> : <Fuel className="w-5 h-5 text-orange-600" />}
                Powertrain
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                  <select
                    required
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plugin-Hybrid">Plugin-Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                  <select
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horsepower</label>
                  <input
                    type="number"
                    value={formData.horsepower}
                    onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 150"
                  />
                </div>

                {!isElectric && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.engine_size}
                      onChange={(e) => setFormData({ ...formData, engine_size: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2.0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Body & Style */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Body & Style
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
                  <select
                    required
                    value={formData.body_type}
                    onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Wagon">Wagon (Stationcar)</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Van">Van / MPV</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                  <select
                    value={formData.doors}
                    onChange={(e) => setFormData({ ...formData, doors: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 doors</option>
                    <option value={3}>3 doors</option>
                    <option value={4}>4 doors</option>
                    <option value={5}>5 doors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
                  <select
                    value={formData.drive_type}
                    onChange={(e) => setFormData({ ...formData, drive_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FWD">Front-wheel (FWD)</option>
                    <option value="RWD">Rear-wheel (RWD)</option>
                    <option value="AWD">All-wheel (AWD)</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Price Prediction'
              )}
            </button>
          </form>

          {/* Result */}
          <div className="lg:col-span-1">
            {prediction ? (
              <div className="bg-white rounded-2xl shadow-md p-6 space-y-5 sticky top-8">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Prediction Complete</span>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Predicted Price</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {formatPrice(prediction.predicted_price)}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Price Range</div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{formatPrice(prediction.price_range.min)}</span>
                    <span className="text-gray-400">—</span>
                    <span className="font-semibold text-gray-700">{formatPrice(prediction.price_range.max)}</span>
                  </div>
                  <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence</span>
                    <span className="font-semibold">{prediction.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Similar Cars</span>
                    <span className="font-semibold">{prediction.similar_cars_count || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Version</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{prediction.model_version}</span>
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-gray-500">
                  Based on Danish market data from bilbasen.dk
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-8 text-center text-gray-500 sticky top-8">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Fill out the form to get your prediction</p>
                <p className="text-sm mt-2">Our AI model is trained on thousands of Danish car listings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}