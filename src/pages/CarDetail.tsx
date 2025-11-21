import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Fuel, Gauge, Car as CarIcon, TrendingUp, Loader } from 'lucide-react';
import api from '../api/client';
import { getCarImage } from '../utils/carImages';

interface CarDetail {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  engine_size: number;
  horsepower: number;
  doors: number;
  seats: number;
  color: string;
  price: number;
  location: string;
  dealer_name: string;
  source_url: string;
}

interface Prediction {
  predicted_price: number;
  confidence: number;
  price_range: { min: number; max: number };
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
        const url = await getCarImage({
          id: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
        });
        if (active) setImageUrl(url);
      } catch (error) {
        console.error('Error fetching car image:', error);
      }
    };

    loadImage();
    return () => {
      active = false;
    };
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
        seats: car.seats,
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
            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <CarIcon className="w-32 h-32 text-gray-400" />
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-gray-600">{car.dealer_name} • {car.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">{formatPrice(car.price)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Year</div>
                  <div className="font-semibold text-lg">{car.year}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Mileage</div>
                  <div className="font-semibold text-lg">{car.mileage.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Fuel</div>
                  <div className="font-semibold text-lg">{car.fuel_type}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Transmission</div>
                  <div className="font-semibold text-lg">{car.transmission}</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Gauge className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Horsepower</div>
                      <div className="font-semibold">{car.horsepower} HP</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Fuel className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Engine Size</div>
                      <div className="font-semibold">{car.engine_size}L</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Body Type</div>
                    <div className="font-semibold">{car.body_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="font-semibold">{car.color}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Doors</div>
                    <div className="font-semibold">{car.doors}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Seats</div>
                    <div className="font-semibold">{car.seats}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Prediction */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                AI Price Analysis
              </h3>

              {!prediction ? (
                <button
                  onClick={getPrediction}
                  disabled={predicting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Predicted Price</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatPrice(prediction.predicted_price)}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${priceDiff > 5 ? 'bg-red-50' : priceDiff < -5 ? 'bg-green-50' : 'bg-blue-50'}`}>
                    <div className="text-sm font-medium mb-1">
                      {priceDiff > 5 ? 'Overpriced' : priceDiff < -5 ? 'Good Deal' : 'Fair Price'}
                    </div>
                    <div className={`text-lg font-bold ${priceDiff > 5 ? 'text-red-600' : priceDiff < -5 ? 'text-green-600' : 'text-blue-600'}`}>
                      {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(1)}% vs market
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Expected Price Range</div>
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(prediction.price_range.min)}</span>
                      <span>{formatPrice(prediction.price_range.max)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 relative">
                      <div className="absolute h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500">Confidence</div>
                    <div className="text-xl font-bold text-gray-900">{prediction.confidence.toFixed(1)}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-blue-600 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Interested?</h3>
              <a
                href={car.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-blue-600 py-3 rounded-lg font-semibold text-center hover:bg-blue-50 transition-colors"
              >
                View Original Listing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
