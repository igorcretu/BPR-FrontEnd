import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarketStatistics from '../MarketStatistics';
import api from '../../api/client';

jest.mock('../../api/client');
const mockedApi = api as jest.Mocked<typeof api>;

const mockStatistics = {
  overall: {
    total_cars: 27462,
    avg_price: 285000,
    min_price: 11000,
    max_price: 4999900,
    avg_mileage: 85000,
    avg_year: 2019.5
  },
  brands: [
    { brand: 'Toyota', total_cars: 3500, avg_price: 250000, min_price: 50000, max_price: 800000 },
    { brand: 'VW', total_cars: 3200, avg_price: 280000, min_price: 60000, max_price: 900000 }
  ],
  fuel_types: [
    { type: 'Electric', count: 11298, avg_price: 320000 },
    { type: 'Petrol', count: 10998, avg_price: 250000 }
  ],
  body_types: [
    { type: 'SUV', count: 8500, avg_price: 350000 },
    { type: 'Sedan', count: 7200, avg_price: 280000 }
  ],
  transmissions: [
    { type: 'Manual', count: 9324 },
    { type: 'Automatic', count: 7743 }
  ],
  years: [
    { year: 2020, count: 4500, avg_price: 320000, avg_mileage: 45000 },
    { year: 2021, count: 5200, avg_price: 380000, avg_mileage: 25000 }
  ],
  price_ranges: [
    { range: 'Under 100k', count: 2500 },
    { range: '100k-200k', count: 5800 }
  ],
  mileage_by_year: [
    { year: 2020, avg_mileage: 45000, min_mileage: 5000, max_mileage: 150000 },
    { year: 2021, avg_mileage: 25000, min_mileage: 2000, max_mileage: 80000 }
  ],
  models_by_brand: {
    'Toyota': [
      { model: 'Corolla', count: 850, avg_price: 240000 },
      { model: 'RAV4', count: 720, avg_price: 380000 }
    ]
  },
  price_trend: [
    { date: '2025-01-15', avg_price: 285000, listings: 450 },
    { date: '2025-01-16', avg_price: 287000, listings: 420 }
  ],
  horsepower_ranges: [
    { range: 'Under 100 HP', count: 3500 },
    { range: '100-150 HP', count: 8200 }
  ]
};

describe('MarketStatistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading market statistics/i)).toBeInTheDocument();
  });

  it('renders error state when API fails', async () => {
    mockedApi.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Unable to Load Statistics/i)).toBeInTheDocument();
      expect(screen.getByText(/Retry Loading/i)).toBeInTheDocument();
    });
  });

  it('renders statistics when API succeeds', async () => {
    mockedApi.get.mockResolvedValue({
      data: { statistics: mockStatistics }
    });

    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/danish car market statistics/i)).toBeInTheDocument();
    });

    // Check overall stats
    expect(screen.getByText('27.462')).toBeInTheDocument(); // Total cars formatted
    expect(screen.getByText(/85\.000 km/i)).toBeInTheDocument(); // Avg mileage

    // Check section titles
    expect(screen.getByText(/top brands by listings/i)).toBeInTheDocument();
    expect(screen.getByText(/fuel type distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/body type distribution/i)).toBeInTheDocument();
  });

  it('fetches statistics on mount', async () => {
    mockedApi.get.mockResolvedValue({
      data: { statistics: mockStatistics }
    });

    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/market/statistics');
    });
  });

  it('displays brand information correctly', async () => {
    mockedApi.get.mockResolvedValue({
      data: { statistics: mockStatistics }
    });

    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    // Check for section headers instead of chart content (charts render to SVG)
    await waitFor(() => {
      expect(screen.getByText(/Top Brands by Listings/i)).toBeInTheDocument();
      expect(screen.getByText(/Average Price by Brand/i)).toBeInTheDocument();
    });
  });

  it('displays top models by brand section', async () => {
    mockedApi.get.mockResolvedValue({
      data: { statistics: mockStatistics }
    });

    render(
      <BrowserRouter>
        <MarketStatistics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/top models by brand/i)).toBeInTheDocument();
      expect(screen.getByText('Corolla')).toBeInTheDocument();
      expect(screen.getByText('RAV4')).toBeInTheDocument();
    });
  });
});
