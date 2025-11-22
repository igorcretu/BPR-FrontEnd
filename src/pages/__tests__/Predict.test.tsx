import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Predict from '../Predict';
import api from '../../api/client';

jest.mock('../../api/client');
const mockApi = api as jest.Mocked<typeof api>;

const mockBrandsData = {
  brands: [
    { name: 'Tesla' },
    { name: 'BMW' },
    { name: 'Audi' },
  ],
};

const mockModelsData = {
  models: [
    { model: 'Model 3' },
    { model: 'Model S' },
    { model: 'Model X' },
  ],
};

const mockModelSpecsData = {
  body_types: [
    { value: 'Sedan', count: 100 },
    { value: 'SUV', count: 50 },
  ],
  fuel_types: [
    { value: 'Electric', count: 150 },
    { value: 'Hybrid', count: 20 },
  ],
  transmissions: [
    { value: 'Automatic', count: 170 },
  ],
};

const mockPredictionData = {
  predicted_price: 450000,
  confidence: 0.88,
  price_min: 420000,
  price_max: 480000,
  features_used: ['brand', 'model', 'year', 'mileage'],
  similar_cars_count: 25,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Predict Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockImplementation((url) => {
      if (url === '/brands') {
        return Promise.resolve({ data: mockBrandsData });
      }
      if (url.includes('/models')) {
        return Promise.resolve({ data: mockModelsData });
      }
      if (url.includes('/model-specs')) {
        return Promise.resolve({ data: mockModelSpecsData });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
    mockApi.post.mockResolvedValue({ data: mockPredictionData });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders prediction form', async () => {
    renderWithRouter(<Predict />);

    await waitFor(() => {
      expect(screen.getByText(/AI Price Prediction/i)).toBeInTheDocument();
    });
  });

  test('displays hero section with description', () => {
    renderWithRouter(<Predict />);

    expect(screen.getByText(/Get an instant AI-powered price estimate/i)).toBeInTheDocument();
  });

  test('loads brands on mount', async () => {
    renderWithRouter(<Predict />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/brands');
    });
  });

  test('displays form sections', async () => {
    renderWithRouter(<Predict />);

    await waitFor(() => {
      expect(screen.getByText(/Brand \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Model \*/i)).toBeInTheDocument();
    });
  });

  test('displays predict button', () => {
    renderWithRouter(<Predict />);
    expect(screen.getByRole('button', { name: /Get Price Prediction/i })).toBeInTheDocument();
  });

  test('loads brands on mount', async () => {
    renderWithRouter(<Predict />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/brands');
    });
  });
});
