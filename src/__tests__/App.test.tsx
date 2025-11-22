import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock all page components
jest.mock('../pages/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock('../pages/Cars', () => ({
  __esModule: true,
  default: () => <div data-testid="cars-page">Cars Page</div>,
}));

jest.mock('../pages/CarDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="car-detail-page">Car Detail Page</div>,
}));

jest.mock('../pages/Predict', () => ({
  __esModule: true,
  default: () => <div data-testid="predict-page">Predict Page</div>,
}));

jest.mock('../pages/HowItWorks', () => ({
  __esModule: true,
  default: () => <div data-testid="how-it-works-page">How It Works Page</div>,
}));

jest.mock('../pages/AboutUs', () => ({
  __esModule: true,
  default: () => <div data-testid="about-us-page">About Us Page</div>,
}));

jest.mock('../components/ScrollToTop', () => ({
  __esModule: true,
  default: () => null,
}));

describe('App', () => {
  it('renders navigation bar', () => {
    render(<App />);
    const carPredictElements = screen.getAllByText('CarPredict');
    expect(carPredictElements.length).toBe(2); // Nav + Footer
  });

  it('renders navigation links', () => {
    render(<App />);
    const aboutUsLinks = screen.getAllByText('About Us');
    expect(aboutUsLinks.length).toBeGreaterThan(0);
    const howItWorksLinks = screen.getAllByText('How It Works');
    expect(howItWorksLinks.length).toBeGreaterThan(0);
    const browseCarsLinks = screen.getAllByText('Browse Cars');
    expect(browseCarsLinks.length).toBeGreaterThan(0);
    expect(screen.getByText('Predict Price')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getAllByText('CarPredict')).toHaveLength(2); // Nav + Footer
    expect(screen.getByText('AI-powered car price predictions for the Danish market.')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<App />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price Prediction')).toBeInTheDocument();
    expect(screen.getByText(/Bachelor Project - Group 26/)).toBeInTheDocument();
    expect(screen.getByText(/VIA University College/)).toBeInTheDocument();
    const year2025 = screen.getAllByText(/2025/);
    expect(year2025.length).toBeGreaterThan(0);
  });

  it('renders copyright notice', () => {
    render(<App />);
    expect(screen.getByText(/© 2025 CarPredict/)).toBeInTheDocument();
  });

  it('has correct navigation structure', () => {
    render(<App />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'border-b', 'sticky', 'top-0', 'z-50', 'shadow-sm');
  });

  it('renders main container with correct classes', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('.min-h-screen.bg-gray-50');
    expect(mainDiv).toBeInTheDocument();
  });

  it('footer has correct background color', () => {
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-gray-900', 'text-white');
  });

  it('footer grid layout exists', () => {
    const { container } = render(<App />);
    const footerGrid = container.querySelector('.grid.md\\:grid-cols-4');
    expect(footerGrid).toBeInTheDocument();
  });
});
