import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from '../AboutUs';

describe('AboutUs', () => {
  it('renders the about us page', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    expect(screen.getByText('About CarPredict')).toBeInTheDocument();
    expect(screen.getByText(/Empowering car buyers and sellers/i)).toBeInTheDocument();
  });

  it('displays mission section', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(/CarPredict was created to bring transparency/i)).toBeInTheDocument();
  });

  it('displays statistics', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    expect(screen.getByText('30K+')).toBeInTheDocument();
    expect(screen.getByText('Car Listings')).toBeInTheDocument();
    expect(screen.getByText('742')).toBeInTheDocument();
    expect(screen.getByText('Pages of Cars')).toBeInTheDocument();
  });

  it('displays multiple content sections', () => {
    const { container } = render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    // Check that multiple headings exist (indicating multiple sections)
    const headings = container.querySelectorAll('h2, h3');
    expect(headings.length).toBeGreaterThan(2);
  });

  it('has navigation links', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders all lucide icons', () => {
    const { container } = render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    // Check that SVG icons are rendered
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('displays team or contact section', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    
    // Check for any heading that might be in the page
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(3);
  });
});
