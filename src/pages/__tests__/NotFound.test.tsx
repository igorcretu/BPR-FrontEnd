import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound', () => {
  it('renders 404 page with correct heading', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    expect(screen.getAllByText('Market Analysis').length).toBeGreaterThan(0);
  });

  it('renders helpful links section', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Here are some helpful links/i)).toBeInTheDocument();
    expect(screen.getByText('Price Prediction')).toBeInTheDocument();
    expect(screen.getByText('Market Statistics')).toBeInTheDocument();
  });

  it('has a back button', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Go back to previous page/i)).toBeInTheDocument();
  });
});
