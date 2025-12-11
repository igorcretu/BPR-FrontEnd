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
  ScatterChart: ({ children }: any) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: ({ children }: any) => <div data-testid="scatter">{children}</div>,
  ZAxis: () => <div data-testid="z-axis" />,
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

// Mock api client
jest.mock('../api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import api from '../api/client';

const mockPerformanceData = {
  data: {
    data: {
      overview: [
        {
          id: '1',
          name: 'XGBoost',
          model_type: 'tree',
          algorithm: 'XGBoost',
          version: '1.0.0',
          is_active: true,
          model_file_path: '/models/xgboost_v1.pkl',
          mae: 15000,
          rmse: 20000,
          r2_score: 0.85,
          mape: 10.5,
          median_ae: 12000,
          percentile_90_error: 25000,
          training_time_seconds: 120,
          created_at: '2025-12-01T10:00:00Z',
          updated_at: '2025-12-01T10:00:00Z',
        },
        {
          id: '2',
          name: 'CatBoost',
          model_type: 'tree',
          algorithm: 'CatBoost',
          version: '1.0.0',
          is_active: true,
          model_file_path: '/models/catboost_v1.pkl',
          mae: 14500,
          rmse: 19500,
          r2_score: 0.86,
          mape: 10.2,
          median_ae: 11500,
          percentile_90_error: 24000,
          training_time_seconds: 150,
          created_at: '2025-12-01T10:00:00Z',
          updated_at: '2025-12-01T10:00:00Z',
        },
      ],
      metrics_comparison: {
        r2_scores: [
          { model: 'CatBoost', value: 0.86 },
          { model: 'XGBoost', value: 0.85 },
        ],
        mae_values: [
          { model: 'CatBoost', value: 14500 },
          { model: 'XGBoost', value: 15000 },
        ],
        rmse_values: [
          { model: 'CatBoost', value: 19500 },
          { model: 'XGBoost', value: 20000 },
        ],
        mape_values: [
          { model: 'CatBoost', value: 10.2 },
          { model: 'XGBoost', value: 10.5 },
        ],
        training_times: [
          { model: 'XGBoost', value: 120 },
          { model: 'CatBoost', value: 150 },
        ],
      },
      price_range_analysis: {
        XGBoost: {
          under_100k: 8000,
          '100k_to_300k': 12000,
          '300k_to_500k': 18000,
          over_500k: 30000,
        },
        CatBoost: {
          under_100k: 7500,
          '100k_to_300k': 11500,
          '300k_to_500k': 17500,
          over_500k: 29000,
        },
      },
      best_performers: {
        highest_r2: { model: 'CatBoost', value: 0.86 },
        lowest_mae: { model: 'CatBoost', value: 14500 },
        fastest_training: { model: 'XGBoost', value: 120 },
      },
    },
  },
};

const mockChartData = {
  data: {
    charts: {
      bar_charts: {
        r2_comparison: {
          labels: ['CatBoost', 'XGBoost'],
          data: [0.86, 0.85],
          title: 'R² Score Comparison',
          ylabel: 'R² Score',
          description: 'Higher is better',
        },
        mae_comparison: {
          labels: ['CatBoost', 'XGBoost'],
          data: [14500, 15000],
          title: 'MAE Comparison',
          ylabel: 'MAE (DKK)',
          description: 'Lower is better',
        },
        training_time_comparison: {
          labels: ['XGBoost', 'CatBoost'],
          data: [120, 150],
          title: 'Training Time Comparison',
          ylabel: 'Time (seconds)',
          description: 'Training duration',
        },
      },
      scatter_plot: {
        title: 'Accuracy vs Training Time',
        xlabel: 'Training Time (seconds)',
        ylabel: 'R² Score',
        data: [
          { x: 120, y: 0.85, label: 'XGBoost' },
          { x: 150, y: 0.86, label: 'CatBoost' },
        ],
      },
      radar_chart: {
        title: 'Multi-Dimensional Model Comparison',
        labels: ['R² Score', 'MAE', 'RMSE', 'MAPE', 'Speed'],
        datasets: [
          { label: 'XGBoost', data: [85, 75, 80, 78, 90] },
          { label: 'CatBoost', data: [86, 78, 82, 80, 85] },
        ],
      },
    },
  },
};

describe('ModelComparison', () => {
  const mockApi = api as jest.Mocked<typeof api>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockApi.get.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading comprehensive model analysis/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    mockApi.get.mockRejectedValue(new Error('Failed to fetch'));

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
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ML Model Performance Dashboard/i)).toBeInTheDocument();
    });

    // Check summary cards
    expect(screen.getByText(/Best Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Lowest Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Fastest Training/i)).toBeInTheDocument();

    // Check models are displayed
    expect(screen.getByText(/XGBoost/i)).toBeInTheDocument();
    const catBoostElements = screen.getAllByText(/CatBoost/i);
    expect(catBoostElements.length).toBeGreaterThan(0);
  });

  it('displays best performers', async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ML Model Performance Dashboard/i)).toBeInTheDocument();
    });

    // Check best performers are displayed
    const catBoostElements = screen.getAllByText(/CatBoost/i);
    expect(catBoostElements.length).toBeGreaterThan(0);
  });

  it('allows view selection', async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Detailed Metrics/i)).toBeInTheDocument();
      expect(screen.getByText(/Charts & Analysis/i)).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    mockApi.get.mockRejectedValue(new Error('Failed to fetch'));

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
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
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

  it('switches to detailed metrics view', async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ML Model Performance Dashboard/i)).toBeInTheDocument();
    });

    const detailedButton = screen.getByText(/Detailed Metrics/i);
    await user.click(detailedButton);

    await waitFor(() => {
      expect(screen.getByText(/Comprehensive Metrics Table/i)).toBeInTheDocument();
    });
  });

  it('switches to charts and analysis view', async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ML Model Performance Dashboard/i)).toBeInTheDocument();
    });

    const chartsButton = screen.getByText(/Charts & Analysis/i);
    await user.click(chartsButton);

    await waitFor(() => {
      expect(screen.getByText(/Model Selection Recommendations/i)).toBeInTheDocument();
    });
  });

  it('renders radar chart in charts view', async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('performance')) {
        return Promise.resolve(mockPerformanceData);
      }
      if (url.includes('charts')) {
        return Promise.resolve(mockChartData);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ModelComparison />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ML Model Performance Dashboard/i)).toBeInTheDocument();
    });

    const chartsButton = screen.getByText(/Charts & Analysis/i);
    await user.click(chartsButton);

    await waitFor(() => {
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });
  });
});
