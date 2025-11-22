import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import CarDetail from '../CarDetail';
import api from '../../api/client';

jest.mock('../../api/client');
const mockApi = api as jest.Mocked<typeof api>;

const mockCarData = {
  id: '123',
  brand: 'Tesla',
  model: 'Model 3',
  variant: 'Long Range',
  title: 'Tesla Model 3 Long Range',
  description: 'Excellent electric vehicle',
  price: 350000,
  year: 2022,
  mileage: 25000,
  fuel_type: 'Electric',
  transmission: 'Automatic',
  horsepower: 350,
  engine_size: 0,
  body_type: 'Sedan',
  doors: 4,
  seats: 5,
  color: 'White',
  predicted_price: 340000,
  confidence: 0.92,
  price_min: 320000,
  price_max: 360000,
};

const renderWithRouter = (component: React.ReactElement, route = '/cars/123') => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

describe('CarDetail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockImplementation((url) => {
      const match = url.match(/\/cars\/(\d+)/);
      const id = match ? match[1] : '123';
      return Promise.resolve({ data: { car: { ...mockCarData, id } } });
    });
  });

  test('shows loading spinner initially', () => {
    renderWithRouter(<CarDetail />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('displays car information after loading', async () => {
    renderWithRouter(<CarDetail />);

    await waitFor(() => {
      expect(screen.getByAltText(/Tesla Model 3/i)).toBeInTheDocument();
    });
  });

  test('shows car not found message when API call fails', async () => {
    mockApi.get.mockRejectedValue(new Error('API Error'));
    renderWithRouter(<CarDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Car not found/i)).toBeInTheDocument();
    });
  });

  test('displays back to listings link', async () => {
    renderWithRouter(<CarDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Back to (L|l)istings/i)).toBeInTheDocument();
    });
  });

  test('calls API to fetch car data', () => {
    renderWithRouter(<CarDetail />);

    expect(mockApi.get).toHaveBeenCalled();
  });
});
