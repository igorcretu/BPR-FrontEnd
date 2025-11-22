import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BackendHealth from '../BackendHealth';
import api from '../../api/client';

jest.mock('../../api/client');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock fetch globally
global.fetch = jest.fn();

describe('BackendHealth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the health check page', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'API is healthy' }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    expect(screen.getByText('Backend Health')).toBeInTheDocument();
    expect(screen.getByText('Real-time monitoring of backend services')).toBeInTheDocument();
  });

  it('displays healthy status when API responds successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'API is healthy' }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('API is healthy')).toBeInTheDocument();
    });
  });

  it('displays unhealthy status when API fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });
  });

  it('refreshes health status when refresh button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'API is healthy' }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('API is healthy')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh Now/i });
    await user.click(refreshButton);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('toggles auto-refresh', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'API is healthy' }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('displays database health when provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'API is healthy',
        database: {
          status: 'connected',
          message: 'Database is connected',
        },
      }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('Database is connected')).toBeInTheDocument();
    });
  });

  it('displays response time', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'API is healthy' }),
    });

    render(
      <BrowserRouter>
        <BackendHealth />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Response Time:/i)).toBeInTheDocument();
    });
  });
});
