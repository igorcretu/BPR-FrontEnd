import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Car as CarIcon, Fuel, Calendar, MapPin, TrendingUp } from 'lucide-react';
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
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [carImages, setCarImages] = useState<Record<string, string | null>>({});
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
      const params: any = { per_page: 50, page: currentPage };
      
      // Add search query to API params
      if (searchQuery) {
        params.q = searchQuery;
      }
      
      // Add filter params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
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
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
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

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredCars.length}</span> cars
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => {
              const imageUrl = carImages[car.id] ?? null;
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
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
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
                  <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(car.price)}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year} • {car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel_type} • {car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                      {car.body_type}
                    </span>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      Get Price
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
          <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none font-semibold min-w-[140px] justify-center"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Indicators */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
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
                        className={`relative w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-110 ring-4 ring-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        {pageNumber}
                        {isActive && (
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Page Counter */}
                <div className="hidden sm:flex items-center gap-2 ml-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="text-lg font-bold text-blue-600">{currentPage}</span>
                  <span className="text-sm text-gray-400">of</span>
                  <span className="text-lg font-bold text-gray-700">{totalPages}</span>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none font-semibold min-w-[140px] justify-center"
              >
                Next
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Page Counter */}
            <div className="sm:hidden flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <span className="text-sm text-gray-600">Page</span>
              <span className="text-lg font-bold text-blue-600">{currentPage}</span>
              <span className="text-sm text-gray-400">of</span>
              <span className="text-lg font-bold text-gray-700">{totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
