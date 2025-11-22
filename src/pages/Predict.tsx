import { useState, useEffect } from 'react';
import { TrendingUp, Car, AlertCircle, CheckCircle, Zap, Fuel, Settings, Sparkles, Info } from 'lucide-react';
import api from '../api/client';
import { getCarImage } from '../utils/carImages';

const COLORS = [
  'Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Orange', 'Yellow'
];

interface ModelSpec {
  body_types: { value: string; count: number }[];
  fuel_types: { value: string; count: number }[];
  transmissions: { value: string; count: number }[];
}

export default function Predict() {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelSpecs, setModelSpecs] = useState<ModelSpec | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [carImage, setCarImage] = useState<string | null>(null);
  
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

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands');
        const brandList = response.data.brands.map((b: any) => b.name).sort();
        setBrands(brandList);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (!formData.brand) {
      setModels([]);
      setModelSpecs(null);
      return;
    }

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const response = await api.get(`/models/${formData.brand}`);
        const modelList = response.data.models.map((m: any) => m.name);
        setModels(modelList);
      } catch (err) {
        console.error('Error fetching models:', err);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, [formData.brand]);

  // Fetch model specs when model changes
  useEffect(() => {
    if (!formData.brand || !formData.model) {
      setModelSpecs(null);
      return;
    }

    const fetchSpecs = async () => {
      setLoadingSpecs(true);
      try {
        const response = await api.get(`/model-specs/${formData.brand}/${formData.model}`);
        const specs = response.data;
        setModelSpecs(specs);

        // Auto-populate fields if there's only one option
        const updates: any = {};
        
        if (specs.body_types?.length === 1) {
          updates.body_type = specs.body_types[0].value;
        }
        if (specs.fuel_types?.length === 1) {
          updates.fuel_type = specs.fuel_types[0].value;
        }
        if (specs.transmissions?.length === 1) {
          updates.transmission = specs.transmissions[0].value;
        }

        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error('Error fetching model specs:', err);
      } finally {
        setLoadingSpecs(false);
      }
    };
    fetchSpecs();
  }, [formData.brand, formData.model]);

  // Fetch car image when brand, model, and year are set
  useEffect(() => {
    if (!formData.brand || !formData.model || !formData.year) {
      setCarImage(null);
      return;
    }

    const loadImage = async () => {
      const image = await getCarImage({
        id: `${formData.brand}-${formData.model}-${formData.year}`,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
      });
      setCarImage(image);
    };
    loadImage();
  }, [formData.brand, formData.model, formData.year]);

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

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.brand,
      formData.model,
      formData.year,
      formData.mileage,
      formData.fuel_type,
      formData.transmission,
      formData.body_type,
      formData.horsepower,
    ];
    const filled = fields.filter(f => f && f.toString().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Prediction</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Predict Car Price</h1>
          <p className="text-lg text-gray-600">Get an instant AI-powered price estimate for the Danish market</p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Form Completion</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 space-y-6">
            {/* Car Image Preview */}
            <div className="relative h-56 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden border-2 border-blue-100">
              {carImage ? (
                <>
                  <img
                    src={carImage}
                    alt={`${formData.brand} ${formData.model} ${formData.year}`}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold text-lg">
                      {formData.brand} {formData.model} ({formData.year})
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Car className="w-20 h-20 mb-3 opacity-40" />
                  <p className="text-sm font-medium">
                    {!formData.brand 
                      ? 'Select a brand to preview' 
                      : !formData.model 
                      ? 'Select a model to preview' 
                      : 'Loading preview...'}
                  </p>
                </div>
              )}
            </div>

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
                    onChange={(e) => {
                      setFormData({ ...formData, brand: e.target.value, model: '', body_type: '', fuel_type: '', transmission: '' });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select brand</option>
                    {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <select
                    required
                    value={formData.model}
                    onChange={(e) => {
                      setFormData({ ...formData, model: e.target.value, body_type: '', fuel_type: '', transmission: '' });
                    }}
                    disabled={!formData.brand || loadingModels}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingModels ? 'Loading models...' : formData.brand ? 'Select model' : 'Select brand first'}
                    </option>
                    {models.map(model => <option key={model} value={model}>{model}</option>)}
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type *
                    {loadingSpecs && <span className="ml-2 text-xs text-blue-600">Loading...</span>}
                  </label>
                  <select
                    required
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                    disabled={!formData.model || loadingSpecs}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{!formData.model ? 'Select model first' : 'Select fuel type'}</option>
                    {modelSpecs?.fuel_types?.map(ft => (
                      <option key={ft.value} value={ft.value}>
                        {ft.value}
                      </option>
                    ))}
                    {!modelSpecs && formData.model && (
                      <>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Plugin-Hybrid">Plugin-Hybrid</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission *
                    {loadingSpecs && <span className="ml-2 text-xs text-blue-600">Loading...</span>}
                  </label>
                  <select
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    disabled={!formData.model || loadingSpecs}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{!formData.model ? 'Select model first' : 'Select transmission'}</option>
                    {modelSpecs?.transmissions?.map(tr => (
                      <option key={tr.value} value={tr.value}>
                        {tr.value}
                      </option>
                    ))}
                    {!modelSpecs && formData.model && (
                      <>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="Semi-Automatic">Semi-Automatic</option>
                      </>
                    )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body Type *
                    {loadingSpecs && <span className="ml-2 text-xs text-blue-600">Loading...</span>}
                  </label>
                  <select
                    required
                    value={formData.body_type}
                    onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                    disabled={!formData.model || loadingSpecs}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{!formData.model ? 'Select model first' : 'Select body type'}</option>
                    {modelSpecs?.body_types?.map(bt => (
                      <option key={bt.value} value={bt.value}>
                        {bt.value}
                      </option>
                    ))}
                    {!modelSpecs && formData.model && (
                      <>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="SUV">SUV</option>
                        <option value="Wagon">Wagon (Stationcar)</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Van">Van / MPV</option>
                        <option value="Pickup">Pickup</option>
                      </>
                    )}
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
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5 sticky top-8 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 text-green-600 animate-in fade-in duration-300">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Prediction Complete</span>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom duration-700">
                  <div className="text-sm text-gray-500 mb-1">Predicted Price</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatPrice(prediction.predicted_price)}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 animate-in fade-in duration-1000">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Price Range</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Min</div>
                      <span className="font-semibold text-gray-700 text-sm">{formatPrice(prediction.price_range.min)}</span>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-xs text-gray-500 mb-1">Predicted</div>
                      <span className="font-bold text-blue-600 text-sm">{formatPrice(prediction.predicted_price)}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Max</div>
                      <span className="font-semibold text-gray-700 text-sm">{formatPrice(prediction.price_range.max)}</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-blue-200 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-lg" />
                  </div>
                </div>

                {/* Confidence Gauge */}
                <div className="p-4 bg-gray-50 rounded-lg animate-in fade-in duration-1000">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Prediction Confidence</span>
                    <span className="text-2xl font-bold text-blue-600">{prediction.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="space-y-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100 animate-in fade-in duration-1000">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="font-semibold text-sm">Market Insights</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Similar Cars Analyzed</span>
                      <span className="font-semibold text-gray-900">{prediction.similar_cars_count || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Model Version</span>
                      <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-amber-200">{prediction.model_version}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-gray-500">
                  Based on Danish market data from bilbasen.dk
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300 sticky top-8">
                <div className="relative inline-block mb-4">
                  <Car className="w-16 h-16 mx-auto text-gray-400" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="font-semibold text-gray-700 mb-2">Ready to Predict?</p>
                <p className="text-sm text-gray-600 mb-4">Fill out the form to get your AI-powered price estimate</p>
                
                {/* Fun Stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-xs text-gray-600">Cars Analyzed</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}