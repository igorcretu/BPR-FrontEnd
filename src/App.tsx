import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Predict from './pages/Predict';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import MarketStatistics from './pages/MarketStatistics';
import BackendHealth from './pages/BackendHealth';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const navLinkClass = (path: string) => 
    `transition-colors font-medium ${
      isActive(path) 
        ? 'text-blue-600 font-semibold' 
        : 'text-gray-700 hover:text-blue-600'
    }`;
  
  const mobileNavLinkClass = (path: string) =>
    `transition-colors font-medium py-2 transform hover:translate-x-2 transition-transform ${
      isActive(path)
        ? 'text-blue-600 font-semibold border-l-4 border-blue-600 pl-4'
        : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <>
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Car className="w-7 h-7" />
            CarPredict
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about-us" className={navLinkClass('/about-us')}>
              About Us
            </Link>
            <Link to="/health" className={navLinkClass('/health')}>
              Server Health
            </Link>
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
              How It Works
            </Link>
            <Link to="/market-statistics" className={navLinkClass('/market-statistics')}>
              Market Stats
            </Link>
            <Link to="/cars" className={navLinkClass('/cars')}>
              Market Analysis
            </Link>
            <Link to="/predict" className={navLinkClass('/predict')}>
              Predict Price
            </Link>
            
            <Link to="/predict" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                to="/about-us"
                className={mobileNavLinkClass('/about-us')}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/health"
                className={mobileNavLinkClass('/health')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Server Health
              </Link>
              <Link
                to="/how-it-works"
                className={mobileNavLinkClass('/how-it-works')}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/market-statistics"
                className={mobileNavLinkClass('/market-statistics')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Stats
              </Link>
              <Link
                to="/cars"
                className={mobileNavLinkClass('/cars')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Analysis
              </Link>
              <Link
                to="/predict"
                className={mobileNavLinkClass('/predict')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Predict Price
              </Link>

              <Link
                to="/predict"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
      </nav>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/market-statistics" element={<MarketStatistics />} />
          <Route path="/health" element={<BackendHealth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 font-bold text-xl mb-4">
                  <Car className="w-6 h-6" />
                  CarPredict
                </div>
                <p className="text-gray-400">AI-powered car price predictions for the Danish market.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/cars" className="hover:text-white">Market Analysis</Link></li>
                  <li><Link to="/predict" className="hover:text-white">Price Prediction</Link></li>
                  <li><Link to="/market-statistics" className="hover:text-white">Market Statistics</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">About</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
                  <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
                  <li><Link to="/health" className="hover:text-white">Backend Health</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Project</h4>
                <p className="text-gray-400 text-sm">
                  Bachelor Project - Group 26<br />
                  VIA University College<br />
                  2025
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              © 2025 CarPredict. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
