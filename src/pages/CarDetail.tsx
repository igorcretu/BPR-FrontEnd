import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Fuel, Gauge, Car as CarIcon, TrendingUp, Loader, Zap, Settings, MapPin, Calendar, Activity, Package, Ruler, Shield } from 'lucide-react';
import api from '../api/client';
import { getCarImage } from '../utils/carImages';

interface CarDetail {
  id: string;
  url?: string;
  brand: string;
  model: string;
  variant?: string;
  title?: string;
  description?: string;
  price: number;
  new_price?: number;
  model_year?: number;
  year: number;
  first_registration?: string;
  production_date?: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  gear_count?: number;
  cylinders?: number;
  horsepower?: number;
  engine_size?: number;
  torque_nm?: number;
  acceleration?: number;
  top_speed?: number;
  range_km?: number;
  battery_capacity?: number;
  energy_consumption?: number;
  home_charging_ac?: string;
  fast_charging_dc?: string;
  charging_time_dc?: string;
  fuel_consumption?: string;
  co2_emission?: string;
  euro_norm?: string;
  tank_capacity?: number;
  body_type: string;
  doors?: number;
  seats?: number;
  color?: string;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
  trunk_size?: number;
  load_capacity?: number;
  towing_capacity?: number;
  max_towing_weight?: number;
  drive_type?: string;
  abs_brakes?: boolean;
  esp?: boolean;
  airbags?: number;
  category?: string;
  equipment?: string;
  periodic_tax?: string;
  tax?: number;
  location?: string;
  dealer_name?: string;
  source_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface Prediction {
  predicted_price: number;
  confidence: number;
  price_range: { min: number; max: number };
  warning?: string;
}

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (!car) {
      setImageUrl(null);
      return;
    }
    let active = true;
    const loadImage = async () => {
      try {
        const url = await getCarImage({ id: car.id, brand: car.brand, model: car.model, year: car.year });
        if (active) setImageUrl(url);
      } catch (error) {
        console.error('Error fetching car image:', error);
      }
    };
    loadImage();
    return () => { active = false; };
  }, [car]);

  // Auto-fetch prediction when car is loaded
  useEffect(() => {
    if (car && !prediction) {
      getPrediction();
    }
  }, [car]);

  const fetchCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      setCar(response.data.car);
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrediction = async () => {
    if (!car) return;
    setPredicting(true);
    try {
      const response = await api.post('/predict', {
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileage: car.mileage,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        body_type: car.body_type,
        horsepower: car.horsepower,
        engine_size: car.engine_size,
        doors: car.doors,
        color: car.color,
        drive_type: car.drive_type,
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error getting prediction:', error);
    } finally {
      setPredicting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(price);

  const formatNumber = (n?: number) => n ? n.toLocaleString('da-DK') : 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Car not found</h2>
        <Link to="/cars" className="text-blue-600 hover:underline">Back to listings</Link>
      </div>
    );
  }

  const priceDiff = prediction ? ((car.price - prediction.predicted_price) / prediction.predicted_price * 100) : 0;
  const isElectric = car.fuel_type?.toLowerCase().includes('electric') || car.fuel_type === 'El';
  const depreciation = car.new_price ? ((car.new_price - car.price) / car.new_price * 100) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/cars" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-gray-200 rounded-2xl h-80 md:h-96 flex items-center justify-center overflow-hidden relative">
              <img
                src={imageUrl ?? 'data:image/svg+xml;utf8,'}
                alt={`${car.brand} ${car.model}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {car.brand} {car.model}
                  </h1>
                  {car.variant && <p className="text-lg text-gray-600 mt-2">{car.variant}</p>}
                  {car.title && car.title !== `${car.brand} ${car.model}` && (
                    <p className="text-base text-gray-500 mt-1">{car.title}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                    {car.dealer_name && (
                      <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <span className="font-medium">{car.dealer_name}</span>
                      </span>
                    )}
                    {car.location && (
                      <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4" /> {car.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{formatPrice(car.price)}</div>
                  {car.new_price && (
                    <div className="text-sm text-gray-500">
                      New: {formatPrice(car.new_price)} ({depreciation?.toFixed(0)}% off)
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="font-semibold">{car.year}</div>
                  <div className="text-xs text-gray-500">Year</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="font-semibold">{formatNumber(car.mileage)} km</div>
                  <div className="text-xs text-gray-500">Mileage</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  {isElectric ? <Zap className="w-5 h-5 mx-auto text-green-500 mb-1" /> : <Fuel className="w-5 h-5 mx-auto text-orange-500 mb-1" />}
                  <div className="font-semibold">{car.fuel_type}</div>
                  <div className="text-xs text-gray-500">Fuel</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="font-semibold">{car.transmission}</div>
                  <div className="text-xs text-gray-500">Transmission</div>
                </div>
              </div>
              {(car.first_registration || car.production_date || car.model_year || car.category || car.body_type || car.tax) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t">
                  {car.first_registration && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">First Registration</div>
                      <div className="font-semibold text-gray-900">{car.first_registration}</div>
                    </div>
                  )}
                  {car.model_year && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Model Year</div>
                      <div className="font-semibold text-gray-900">{car.model_year}</div>
                    </div>
                  )}
                  {car.production_date && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Production Date</div>
                      <div className="font-semibold text-gray-900">{car.production_date}</div>
                    </div>
                  )}
                  {car.body_type && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Body Type</div>
                      <div className="font-semibold text-gray-900">{car.body_type}</div>
                    </div>
                  )}
                  {car.tax && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Tax</div>
                      <div className="font-semibold text-gray-900">{car.tax.toLocaleString()} DKK/year</div>
                    </div>
                  )}
                  {car.category && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="font-semibold text-gray-900">{car.category}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Performance */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                    <Gauge className="w-5 h-5 text-blue-600" /> Performance
                  </h4>
                  <dl className="space-y-3 text-sm">
                    {car.horsepower && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Horsepower</dt>
                        <dd className="font-medium">{car.horsepower} HP</dd>
                      </div>
                    )}
                    {car.torque_nm && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Torque</dt>
                        <dd className="font-medium">{car.torque_nm} Nm</dd>
                      </div>
                    )}
                    {car.acceleration && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">0-100 km/h</dt>
                        <dd className="font-medium">{car.acceleration} sec</dd>
                      </div>
                    )}
                    {car.top_speed && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Top Speed</dt>
                        <dd className="font-medium">{car.top_speed} km/h</dd>
                      </div>
                    )}
                    {!isElectric && car.engine_size && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Engine Size</dt>
                        <dd className="font-medium">{car.engine_size} L</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Electric/Range */}
                {isElectric && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                      <Zap className="w-5 h-5 text-green-600" /> Electric
                    </h4>
                    <dl className="space-y-3 text-sm">
                      {car.range_km && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Range (WLTP)</dt>
                          <dd className="font-medium">{car.range_km} km</dd>
                        </div>
                      )}
                      {car.battery_capacity && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Battery</dt>
                          <dd className="font-medium">{car.battery_capacity} kWh</dd>
                        </div>
                      )}
                      {car.energy_consumption && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Consumption</dt>
                          <dd className="font-medium">{car.energy_consumption} Wh/km</dd>
                        </div>
                      )}
                      {car.home_charging_ac && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">AC Charging</dt>
                          <dd className="font-medium">{car.home_charging_ac}</dd>
                        </div>
                      )}
                      {car.fast_charging_dc && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">DC Charging</dt>
                          <dd className="font-medium">{car.fast_charging_dc}</dd>
                        </div>
                      )}
                      {car.charging_time_dc && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">DC Time (10-80%)</dt>
                          <dd className="font-medium">{car.charging_time_dc}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Fuel Efficiency & Emissions */}
                {!isElectric && (car.fuel_consumption || car.co2_emission || car.euro_norm) && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                      <Fuel className="w-5 h-5 text-orange-600" /> Efficiency
                    </h4>
                    <dl className="space-y-3 text-sm">
                      {car.fuel_consumption && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Consumption</dt>
                          <dd className="font-medium">{car.fuel_consumption}</dd>
                        </div>
                      )}
                      {car.co2_emission && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">CO₂ Emission</dt>
                          <dd className="font-medium">{car.co2_emission}</dd>
                        </div>
                      )}
                      {car.euro_norm && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Euro Norm</dt>
                          <dd className="font-medium">{car.euro_norm}</dd>
                        </div>
                      )}
                      {car.tank_capacity && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tank Capacity</dt>
                          <dd className="font-medium">{car.tank_capacity} L</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Body */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                    <CarIcon className="w-5 h-5 text-purple-600" /> Body
                  </h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Body Type</dt>
                      <dd className="font-medium">{car.body_type}</dd>
                    </div>
                    {car.doors && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Doors</dt>
                        <dd className="font-medium">{car.doors}</dd>
                      </div>
                    )}
                    {car.seats && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Seats</dt>
                        <dd className="font-medium">{car.seats}</dd>
                      </div>
                    )}
                    {car.color && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Color</dt>
                        <dd className="font-medium">{car.color}</dd>
                      </div>
                    )}
                    {car.drive_type && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Drive Type</dt>
                        <dd className="font-medium">{car.drive_type}</dd>
                      </div>
                    )}
                    {car.gear_count && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Gears</dt>
                        <dd className="font-medium">{car.gear_count}</dd>
                      </div>
                    )}
                    {car.cylinders && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Cylinders</dt>
                        <dd className="font-medium">{car.cylinders}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Practical */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                    <Package className="w-5 h-5 text-gray-600" /> Practical
                  </h4>
                  <dl className="space-y-3 text-sm">
                    {car.weight && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Weight</dt>
                        <dd className="font-medium">{formatNumber(car.weight)} kg</dd>
                      </div>
                    )}
                    {car.trunk_size && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Trunk Size</dt>
                        <dd className="font-medium">{car.trunk_size} L</dd>
                      </div>
                    )}
                    {car.load_capacity && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Load Capacity</dt>
                        <dd className="font-medium">{formatNumber(car.load_capacity)} kg</dd>
                      </div>
                    )}
                    {car.towing_capacity && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Towing Capacity</dt>
                        <dd className="font-medium">{formatNumber(car.towing_capacity)} kg</dd>
                      </div>
                    )}
                    {car.max_towing_weight && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Max Towing (Brakes)</dt>
                        <dd className="font-medium">{formatNumber(car.max_towing_weight)} kg</dd>
                      </div>
                    )}
                    {car.periodic_tax && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Tax</dt>
                        <dd className="font-medium">{car.periodic_tax}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Dimensions */}
                {(car.width || car.length || car.height) && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                      <Ruler className="w-5 h-5 text-blue-600" /> Dimensions
                    </h4>
                    <dl className="space-y-3 text-sm">
                      {car.length && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Length</dt>
                          <dd className="font-medium">{car.length} cm</dd>
                        </div>
                      )}
                      {car.width && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Width</dt>
                          <dd className="font-medium">{car.width} cm</dd>
                        </div>
                      )}
                      {car.height && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Height</dt>
                          <dd className="font-medium">{car.height} cm</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Safety */}
                {(car.abs_brakes !== undefined || car.esp !== undefined || car.airbags) && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                      <Shield className="w-5 h-5 text-red-600" /> Safety
                    </h4>
                    <dl className="space-y-3 text-sm">
                      {car.abs_brakes !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">ABS Brakes</dt>
                          <dd className="font-medium">{car.abs_brakes ? '✓ Yes' : '✗ No'}</dd>
                        </div>
                      )}
                      {car.esp !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">ESP</dt>
                          <dd className="font-medium">{car.esp ? '✓ Yes' : '✗ No'}</dd>
                        </div>
                      )}
                      {car.airbags && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Airbags</dt>
                          <dd className="font-medium">{car.airbags}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b">Description</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{car.description}</p>
              </div>
            )}

            {/* Equipment */}
            {car.equipment && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b">Equipment & Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.equipment
                    .split(';')
                    .filter(item => item.trim())
                    .map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-blue-200 transition-colors">
                        {item.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Listing Information */}
            {(car.url || car.created_at || car.updated_at) && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b">Listing Information</h3>
                <div className="space-y-4">
                  {car.url && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Original URL</div>
                      <a 
                        href={car.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm"
                      >
                        {car.url}
                      </a>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {car.created_at && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Added to Database</div>
                        <div className="font-medium text-gray-900">
                          {new Date(car.created_at).toLocaleString('da-DK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                    {car.updated_at && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                        <div className="font-medium text-gray-900">
                          {new Date(car.updated_at).toLocaleString('da-DK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Prediction */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                AI Price Analysis
              </h3>

              {!prediction ? (
                <button
                  onClick={getPrediction}
                  disabled={predicting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {predicting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Price Prediction'
                  )}
                </button>
              ) : (
                <div className="space-y-5">
                  <div className="animate-in fade-in duration-300">
                    <div className="text-sm text-gray-500 mb-1">Predicted Price</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(prediction.predicted_price)}
                    </div>
                  </div>

                  {(prediction?.warning || (car && car.year && car.year < 2000)) && (
                    <div className="p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md animate-in fade-in duration-500">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                          <div className="font-semibold text-yellow-900 mb-1">Classic Car Warning</div>
                          <div className="text-sm text-yellow-800">{prediction?.warning ?? 'Classic/vintage car: Prediction may not reflect collector value'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`p-4 rounded-lg ${priceDiff > 5 ? 'bg-red-50' : priceDiff < -5 ? 'bg-green-50' : 'bg-blue-50'}`}>
                    <div className="text-sm font-medium mb-1">
                      {priceDiff > 5 ? '⚠️ Overpriced' : priceDiff < -5 ? '✅ Good Deal' : '👍 Fair Price'}
                    </div>
                    <div className={`text-lg font-bold ${priceDiff > 5 ? 'text-red-600' : priceDiff < -5 ? 'text-green-600' : 'text-blue-600'}`}>
                      {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(1)}% vs market
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
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

                  <div className="p-4 bg-gray-50 rounded-lg">
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
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Interested in this car?</h3>
              <p className="text-blue-100 text-sm mb-4">
                View the complete listing with all details and contact information
              </p>
              {car.source_url ? (
                <a
                  href={car.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-blue-600 py-3 rounded-lg font-semibold text-center hover:bg-blue-50 transition-all hover:shadow-md"
                >
                  🔗 View Original Listing
                </a>
              ) : (
                <div className="bg-blue-500 bg-opacity-30 rounded-lg p-3 text-center text-sm">
                  Original listing link not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}