import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Page', () => {
  test('renders hero section with main heading', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Find Your Perfect Car/i)).toBeInTheDocument();
  });

  test('displays AI-Powered Price Predictions badge', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/AI-Powered Price Predictions/i)).toBeInTheDocument();
  });

  test('renders Market Analysis button', () => {
    renderWithRouter(<Home />);
    const marketAnalysisButtons = screen.getAllByText(/Market Analysis/i);
    expect(marketAnalysisButtons.length).toBeGreaterThan(0);
  });

  test('renders Predict Price button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Predict Price/i)).toBeInTheDocument();
  });

  test('displays statistics section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/20k\+/i)).toBeInTheDocument();
    expect(screen.getByText(/95%/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7/i)).toBeInTheDocument();
  });

  test('renders Why Choose Us section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Why Choose Us\?/i)).toBeInTheDocument();
  });

  test('displays AI Price Predictions feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getAllByText(/AI.*Price.*Predictions/i)[0]).toBeInTheDocument();
  });

  test('displays Smart Search feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Smart Search/i)).toBeInTheDocument();
  });

  test('displays Market Insights feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Market Insights/i)).toBeInTheDocument();
  });

  test('displays Verified Listings feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: /Verified Listings/i })).toBeInTheDocument();
  });

  test('displays Wide Selection feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Wide Selection/i)).toBeInTheDocument();
  });

  test('displays Real-Time Updates feature', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Real-Time Updates/i)).toBeInTheDocument();
  });

  test('renders CTA section with "Ready to Find Your Dream Car?"', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Ready to Find Your Dream Car\?/i)).toBeInTheDocument();
  });

  test('CTA section has Start Browsing Now button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Start Browsing Now/i)).toBeInTheDocument();
  });

  test('hero section has descriptive subtitle', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Browse thousands of verified listings/i)).toBeInTheDocument();
  });

  test('displays "At The Right Price" heading', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/At The Right Price/i)).toBeInTheDocument();
  });

  test('statistics section shows Active Listings', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Active Listings/i)).toBeInTheDocument();
  });

  test('statistics section shows Accuracy', () => {
    renderWithRouter(<Home />);
    const accuracyElements = screen.getAllByText(/Accuracy/i);
    expect(accuracyElements.length).toBeGreaterThan(0);
  });

  test('statistics section shows Updated', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Updated/i)).toBeInTheDocument();
  });

  test('AI Price Predictions feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Get instant, accurate price estimates/i)).toBeInTheDocument();
  });

  test('Smart Search feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Advanced filtering by brand/i)).toBeInTheDocument();
  });

  test('Market Insights feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Access detailed statistics, trends/i)).toBeInTheDocument();
  });

  test('Verified Listings feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/All listings are scraped from trusted/i)).toBeInTheDocument();
  });

  test('Wide Selection feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Browse cars from all major brands/i)).toBeInTheDocument();
  });

  test('Real-Time Updates feature has description', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Our platform continuously scrapes/i)).toBeInTheDocument();
  });

  test('CTA section has subtitle', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Join thousands of smart buyers/i)).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderWithRouter(<Home />);
    const marketAnalysisLinks = screen.getAllByRole('link', { name: /Market Analysis/i });
    expect(marketAnalysisLinks.length).toBeGreaterThan(0);
  });

  test('Why Choose Us section has subtitle', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Everything you need to make the right car purchase/i)).toBeInTheDocument();
  });

  test('hero section contains gradient background', () => {
    const { container } = renderWithRouter(<Home />);
    const heroSection = container.querySelector('.bg-gradient-to-br.from-blue-600');
    expect(heroSection).toBeInTheDocument();
  });

  test('feature cards have correct styling', () => {
    const { container } = renderWithRouter(<Home />);
    const featureCards = container.querySelectorAll('.bg-white.p-8.rounded-2xl');
    expect(featureCards.length).toBeGreaterThan(0);
  });

  test('CTA section has gradient background', () => {
    const { container } = renderWithRouter(<Home />);
    const ctaSection = container.querySelector('.bg-gradient-to-r.from-blue-600');
    expect(ctaSection).toBeInTheDocument();
  });
});
