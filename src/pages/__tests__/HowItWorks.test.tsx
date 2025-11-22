import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  it('renders the how it works page', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText(/Discover how our AI-powered platform/i)).toBeInTheDocument();
  });

  it('displays the process section', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    expect(screen.getByText('The Process')).toBeInTheDocument();
    expect(screen.getByText(/Our platform combines cutting-edge technology/i)).toBeInTheDocument();
  });

  it('displays data collection step', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText(/We continuously scrape and collect data/i)).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders all lucide icons', () => {
    const { container } = render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('has navigation links', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays multiple headings', () => {
    render(
      <BrowserRouter>
        <HowItWorks />
      </BrowserRouter>
    );
    
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(3);
  });
});
