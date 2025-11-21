import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Predict from './pages/Predict';


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                <Car className="w-7 h-7" />
                CarPredict
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link to="/cars" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Browse Cars
                </Link>
                <Link to="/predict" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Predict Price
                </Link>
                <Link to="/cars" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Get Started
                </Link>
                
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/predict" element={<Predict />} />
          
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
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
                  <li><Link to="/cars" className="hover:text-white">Browse Cars</Link></li>
                  <li><Link to="/predict" className="hover:text-white">Price Prediction</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">About</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">How It Works</a></li>
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
