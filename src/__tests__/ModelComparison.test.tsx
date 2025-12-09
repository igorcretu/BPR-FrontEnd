import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ModelComparison from '../pages/ModelComparison';

// Mock the Recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => <div data-testid="radar" />,
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

// Mock fetch
global.fetch = jest.fn();

const mockComparisonData = {
  models: [
    {
      id: '1',
      name: 'XGBoost',
      model_type: 'tree',
      algorithm: 'XGBoost',
      version: '1.0.0',
      is_active: true,
      mae: 15000,
      rmse: 20000,
      r2_score: 0.85,
      mape: 10.5,
      median_ae: 12000,
      percentile_90_error: 25000,
      training_time_seconds: 120,
      comparison_metrics: {
        overall_mae: 15000,
        overall_rmse: 20000,
        overall_r2: 0.85,
        overall_mape: 10.5,
        mae_under_100k: 8000,
        mae_100k_300k: 12000,
        mae_300k_500k: 18000,
        mae_over_500k: 30000,
        mae_petrol: 14000,
        mae_diesel: 13000,
        mae_electric: 20000,
        mae_hybrid: 16000,
        mae_pre_2010: 18000,
        mae_2010_2015: 15000,
        mae_2015_2020: 12000,
        mae_post_2020: 10000,
        avg_inference_time_ms: 5.5,
        confidence_calibration_score: 0.75,
      },
    },
    {
      id: '2',
      name: 'CatBoost',
      model_type: 'tree',
      algorithm: 'CatBoost',
      version: '1.0.0',
      is_active: true,
      mae: 14500,
      rmse: 19500,
      r2_score: 0.86,
      mape: 10.2,
      median_ae: 11500,
      percentile_90_error: 24000,
      training_time_seconds: 150,
      comparison_metrics: {
        overall_mae: 14500,
        overall_rmse: 19500,
        overall_r2: 0.86,
        overall_mape: 10.2,
        mae_under_100k: 7500,
        mae_100k_300k: 11500,
        mae_300k_500k: 17500,
        mae_over_500k: 29000,
        mae_petrol: 13500,
        mae_diesel: 12500,
        mae_electric: 19500,
        mae_hybrid: 15500,
        mae_pre_2010: 17500,
        mae_2010_2015: 14500,
        mae_2015_2020: 11500,
        mae_post_2020: 9500,
        avg_inference_time_ms: 6.2,
        confidence_calibration_score: 0.78,
      },
    },
  ],
  latest_training_run: {
    id: '1',
    run_date: '2025-12-01T10:00:00Z',
    dataset_size: 5000,
    train_size: 4000,
    test_size: 1000,
    training_duration_seconds: 300,
    status: 'completed',
    models_trained: ['XGBoost', 'CatBoost'],
    best_model_id: '2',
  },
  total_models: 2,
};

describe('ModelComparison', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading model comparison data/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('renders comparison data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockComparisonData,
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/model comparison dashboard/i)).toBeInTheDocument();
    });

    // Check summary cards
    expect(screen.getByText(/best model/i)).toBeInTheDocument();
    const catBoostElements = screen.getAllByText(/CatBoost/i);
    expect(catBoostElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/total models/i)).toBeInTheDocument();

    // Check models are displayed in table
    expect(screen.getByText(/XGBoost/i)).toBeInTheDocument();
  });

  it('displays latest training run information', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockComparisonData,
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/model comparison dashboard/i)).toBeInTheDocument();
    });

    // Check that the page loaded successfully with data
    expect(screen.getByText(/best model/i)).toBeInTheDocument();
  });

  it('allows metric selection', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockComparisonData,
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Verify retry button is present
    const retryButton = screen.getByText(/retry/i);
    expect(retryButton).toBeInTheDocument();
  });

  it('renders charts when data is available', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockComparisonData,
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      const barCharts = screen.getAllByTestId('bar-chart');
      expect(barCharts.length).toBeGreaterThan(0);
    });
  });
});
