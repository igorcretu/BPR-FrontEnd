import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Car as CarIcon, Fuel, Calendar } from 'lucide-react';
import api from '../api/client';
import { getCarImage } from '../utils/carImages';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  price: number;
  location: string;
  color: string;
  horsepower: number;
  engine_size?: number;
  doors?: number;
  drive_type?: string;
}

interface Prediction {
  predicted_price: number;
  confidence: number;
  price_range: { min: number; max: number };
  warning?: string;
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [carImages, setCarImages] = useState<Record<string, string | null>>({});
  const [carPredictions, setCarPredictions] = useState<Record<string, Prediction>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    brand: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    year_min: '',
    year_max: '',
    price_min: '',
    price_max: '',
    sort_by: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    brands: [] as string[],
    fuelTypes: [] as string[],
    transmissions: [] as string[],
    bodyTypes: [] as string[],
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchCars();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, filters, searchQuery]);

  useEffect(() => {
    if (!cars.length) return;

    const carsWithoutImages = cars.filter((car) => carImages[car.id] === undefined);
    if (!carsWithoutImages.length) return;

    let active = true;

    const loadImages = async () => {
      const results = await Promise.all(
        carsWithoutImages.map(async (car) => {
          const image = await getCarImage({
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
          });
          return { id: car.id, image };
        })
      );

      if (!active) return;

      setCarImages((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const { id, image } of results) {
          if (next[id] === undefined) {
            next[id] = image;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    loadImages();
    return () => {
      active = false;
    };
  }, [cars, carImages]);

  // Fetch predictions for cars
  useEffect(() => {
    if (!cars.length) return;

    const carsWithoutPredictions = cars.filter((car) => !carPredictions[car.id]);
    if (!carsWithoutPredictions.length) return;

    let active = true;

    const loadPredictions = async () => {
      const results = await Promise.all(
        carsWithoutPredictions.map(async (car) => {
          try {
            const response = await api.post('/predict', {
              brand: car.brand,
              model: car.model,
              year: car.year,
              mileage: car.mileage,
              fuel_type: car.fuel_type,
              transmission: car.transmission,
              body_type: car.body_type,
              horsepower: car.horsepower || 150,
              engine_size: car.engine_size,
              doors: car.doors,
            });
            return { id: car.id, prediction: response.data };
          } catch (error) {
            console.error(`Error predicting price for car ${car.id}:`, error);
            return { id: car.id, prediction: null };
          }
        })
      );

      if (!active) return;

      setCarPredictions((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const { id, prediction } of results) {
          if (prediction && !next[id]) {
            next[id] = prediction;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    loadPredictions();
    return () => {
      active = false;
    };
  }, [cars, carPredictions]);

  const fetchFilterOptions = async () => {
    try {
      // Fetch filters and brands from backend endpoints
      const [filtersRes, brandsRes] = await Promise.all([
        api.get('/filters'),
        api.get('/brands'),
      ]);
      const filtersData = filtersRes.data.filters || {};
      const brandsData = brandsRes.data.brands || [];
      setFilterOptions({
        brands: brandsData.map((b: any) => b.name).filter(Boolean),
        fuelTypes: (filtersData.fuel_types || []).map((f: any) => f.value).filter(Boolean),
        transmissions: (filtersData.transmissions || []).map((t: any) => t.value).filter(Boolean),
        bodyTypes: (filtersData.body_types || []).map((bt: any) => bt.value).filter(Boolean),
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params: any = { per_page: 30, page: currentPage };
      
      // Add search query to API params
      if (searchQuery) {
        params.q = searchQuery;
      }
      
      // Map frontend sort values to backend values
      const sortMapping: Record<string, { sort_by: string; sort_order: string }> = {
        'newest': { sort_by: 'year', sort_order: 'desc' },
        'oldest': { sort_by: 'year', sort_order: 'asc' },
        'price_low': { sort_by: 'price', sort_order: 'asc' },
        'price_high': { sort_by: 'price', sort_order: 'desc' },
        'mileage_low': { sort_by: 'mileage', sort_order: 'asc' },
        'mileage_high': { sort_by: 'mileage', sort_order: 'desc' },
      };
      
      // Apply sorting
      const sortConfig = sortMapping[filters.sort_by] || sortMapping['newest'];
      params.sort_by = sortConfig.sort_by;
      params.sort_order = sortConfig.sort_order;
      
      // Add filter params (excluding sort_by since we handled it above)
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'sort_by') params[key] = value;
      });
      
      const response = await api.get('/cars', { params });
      setCars(response.data.cars || []);
      const pages = response.data.pagination?.pages || 1;
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  // No client-side filtering needed - backend handles it
  const filteredCars = cars;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search and Controls Container */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by brand, model, or title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex gap-2 items-center">
              <select
                value={filters.sort_by}
                onChange={(e) => {
                  setFilters({ ...filters, sort_by: e.target.value });
                  setCurrentPage(1);
                }}
                className="flex-1 md:flex-none md:w-44 px-3 md:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-gray-700 text-sm md:text-base"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_low">Price: Low</option>
                <option value="price_high">Price: High</option>
                <option value="mileage_low">Mileage: Low</option>
                <option value="mileage_high">Mileage: High</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Brands</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                value={filters.fuel_type}
                onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Fuel Types</option>
                {filterOptions.fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>

              <select
                value={filters.body_type}
                onChange={(e) => setFilters({ ...filters, body_type: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Body Types</option>
                {filterOptions.bodyTypes.map((bodyType) => (
                  <option key={bodyType} value={bodyType}>
                    {bodyType}
                  </option>
                ))}
              </select>

              <select
                value={filters.transmission}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Transmissions</option>
                {filterOptions.transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Year"
                value={filters.year_min}
                onChange={(e) => setFilters({ ...filters, year_min: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Max Year"
                value={filters.year_max}
                onChange={(e) => setFilters({ ...filters, year_max: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Min Price (DKK)"
                value={filters.price_min}
                onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Max Price (DKK)"
                value={filters.price_max}
                onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="inline-flex items-center gap-1 md:gap-1.5">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <span>All listings are sourced from <span className="font-medium text-gray-700">Bilbasen</span> and used exclusively for market analysis and price prediction purposes.</span>
              </span>
            </p>
            <Link
              to="/about-us#disclaimer"
              className="text-xs px-2 md:px-3 py-1 md:py-1.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-full border border-blue-200 hover:border-blue-300 transition-all font-medium whitespace-nowrap shadow-sm hover:shadow"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredCars.length}</span> cars
          </p>
          
          {/* Page Counter at Top */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <span className="text-sm text-gray-600">Page</span>
              <span className="text-lg font-bold text-blue-600">{currentPage}</span>
              <span className="text-sm text-gray-400">of</span>
              <span className="text-lg font-bold text-gray-700">{totalPages}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => {
              const imageUrl = carImages[car.id] ?? null;
              const prediction = carPredictions[car.id];
              const priceDiff = prediction ? ((car.price - prediction.predicted_price) / prediction.predicted_price * 100) : null;
              
              return (
              <Link
                key={car.id}
                to={`/cars/${car.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="bg-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <CarIcon className="w-20 h-20 text-gray-400" />
                  )}
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {car.year}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(car.price)}</p>

                  {/* Predicted Price Section */}
                  {prediction ? (
                    <div className="mb-4">
                      {prediction.warning && (
                        <div className="mb-3 px-3 py-2 bg-yellow-100 border-l-4 border-yellow-500 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <span className="font-semibold text-yellow-900">{prediction.warning}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">AI Predicted Price</span>
                        <span className="font-semibold text-gray-700">{formatPrice(prediction.predicted_price)}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-lg ${priceDiff! > 5 ? 'bg-red-50' : priceDiff! < -5 ? 'bg-green-50' : 'bg-blue-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${priceDiff! > 5 ? 'text-red-700' : priceDiff! < -5 ? 'text-green-700' : 'text-blue-700'}`}>
                            {priceDiff! > 5 ? '⚠️ Overpriced' : priceDiff! < -5 ? '✅ Good Deal' : '👍 Fair Price'}
                          </span>
                          <span className={`text-sm font-bold ${priceDiff! > 5 ? 'text-red-600' : priceDiff! < -5 ? 'text-green-600' : 'text-blue-600'}`}>
                            {priceDiff! > 0 ? '+' : ''}{priceDiff!.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 h-[72px] flex items-center justify-center">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        <span>Analyzing price...</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year} • {car.mileage?.toLocaleString() || 'N/A'} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel_type || 'N/A'} • {car.transmission || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CarIcon className="w-4 h-4" />
                      <span>{car.body_type || 'N/A'}{car.color ? ` • ${car.color}` : ''}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-20">
            <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredCars.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="group w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                const isActive = currentPage === pageNumber;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="group w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Page Counter */}
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-blue-600">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
