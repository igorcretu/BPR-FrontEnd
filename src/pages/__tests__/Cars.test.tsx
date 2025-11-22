import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Cars from '../Cars';
import api from '../../api/client';

jest.mock('../../api/client');
jest.mock('../../utils/carImages', () => ({
  getCarImage: jest.fn(() => Promise.resolve('https://example.com/car.jpg')),
}));

const mockCarsResponse = {
  data: {
    cars: [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 50000,
        fuel_type: 'Benzin',
        transmission: 'Automatisk',
        body_type: 'Sedan',
        price: 250000,
        location: 'Copenhagen',
        color: 'Black',
        horsepower: 200,
      },
      {
        id: '2',
        brand: 'BMW',
        model: 'X5',
        year: 2021,
        mileage: 30000,
        fuel_type: 'Diesel',
        transmission: 'Automatisk',
        body_type: 'SUV',
        price: 450000,
        location: 'Aarhus',
        color: 'White',
        horsepower: 300,
      },
    ],
    pagination: {
      page: 1,
      per_page: 30,
      total: 2,
      pages: 1,
    },
  },
};

const mockFiltersResponse = {
  data: {
    filters: {
      fuel_types: [
        { value: 'Benzin', count: 15000 },
        { value: 'Diesel', count: 10000 },
      ],
      transmissions: [
        { value: 'Automatisk', count: 18000 },
        { value: 'Manuel', count: 12000 },
      ],
      body_types: [
        { value: 'Sedan', count: 6000 },
        { value: 'SUV', count: 8000 },
      ],
    },
  },
};

const mockBrandsResponse = {
  data: {
    brands: [
      { name: 'Toyota', count: 2500 },
      { name: 'BMW', count: 1800 },
    ],
  },
};

describe('Cars Page', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/cars') return Promise.resolve(mockCarsResponse);
      if (url === '/filters') return Promise.resolve(mockFiltersResponse);
      if (url === '/brands') return Promise.resolve(mockBrandsResponse);
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search by brand, model, or title/i)).toBeInTheDocument();
    });
  });

  test('renders filters button', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Filters/i)).toBeInTheDocument();
    });
  });

  test('displays car listings after loading', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/BMW X5/i)).toBeInTheDocument();
    });
  });

  test('displays car prices', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/250\.000 kr\./i)).toBeInTheDocument();
      expect(screen.getByText(/450\.000 kr\./i)).toBeInTheDocument();
    });
  });

  test('displays "Found X cars" message', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Found.*cars/i)).toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('can open filters panel', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    const filtersButton = await screen.findByText(/Filters/i);
    await user.click(filtersButton);

    await waitFor(() => {
      expect(screen.getByText(/All Brands/i)).toBeInTheDocument();
    });
  });

  test('displays filter options when opened', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    const filtersButton = await screen.findByText(/Filters/i);
    await user.click(filtersButton);

    await waitFor(() => {
      expect(screen.getByText(/All Fuel Types/i)).toBeInTheDocument();
      expect(screen.getByText(/All Body Types/i)).toBeInTheDocument();
      expect(screen.getByText(/All Transmissions/i)).toBeInTheDocument();
    });
  });

  test('displays car specifications', async () => {
    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sedan/i)).toBeInTheDocument();
      expect(screen.getByText(/SUV/i)).toBeInTheDocument();
      // Check for prediction loading state instead of horsepower
      const analyzingTexts = screen.getAllByText(/Analyzing price.../i);
      expect(analyzingTexts.length).toBeGreaterThan(0);
    });
  });

  test('shows no results message when no cars found', async () => {
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/cars') return Promise.resolve({ data: { cars: [], pagination: { page: 1, per_page: 30, total: 0, pages: 0 } } });
      if (url === '/filters') return Promise.resolve(mockFiltersResponse);
      if (url === '/brands') return Promise.resolve(mockBrandsResponse);
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <BrowserRouter>
        <Cars />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No cars found/i)).toBeInTheDocument();
    });
  });
});
