import { ArrowRight, Database, Brain, Search, TrendingUp, Zap, Shield, RefreshCw, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover how our AI-powered platform helps you make informed decisions in the Danish car market
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Process Overview */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with real market data to deliver accurate price predictions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Collection</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously scrape and collect data from major Danish car marketplaces like Bilbasen, gathering real-time pricing and specifications.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Training</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our machine learning models analyze patterns in the data, learning from thousands of car listings to understand pricing factors.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Input</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enter your car details or search our database of thousands of listings with advanced filtering options.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Price Prediction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant AI-powered price predictions with confidence scores and market insights to make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-8">Technical Architecture</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Backend Technology
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Flask API</strong> - RESTful endpoints for all operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">PostgreSQL 16</strong> - Robust database with 30,000+ car listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Machine Learning</strong> - TensorFlow-powered prediction models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Docker</strong> - Containerized deployment on Raspberry Pi 5</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Queue System</strong> - Asynchronous prediction processing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  Frontend Technology
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">React 18</strong> - Modern, responsive user interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">TypeScript</strong> - Type-safe development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Tailwind CSS</strong> - Beautiful, responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Vite</strong> - Lightning-fast build tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">CI/CD Pipeline</strong> - Automated deployment via GitHub Actions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Search & Filters</h3>
              <p className="text-gray-600">
                Filter by brand, model, fuel type, transmission, price range, year, and more. Find exactly what you're looking for.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Market Data</h3>
              <p className="text-gray-600">
                Access up-to-date listings from the Danish market with automatic daily updates and price trend analysis.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Price Predictions</h3>
              <p className="text-gray-600">
                Get instant price estimates with confidence scores, helping you identify good deals and overpriced listings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Updates</h3>
              <p className="text-gray-600">
                Our web scrapers run automatically to keep the database fresh with the latest car listings and market prices.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Car Info</h3>
              <p className="text-gray-600">
                View comprehensive specifications including performance, dimensions, safety features, and equipment lists.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Responsive</h3>
              <p className="text-gray-600">
                Optimized performance with pagination, caching, and efficient database queries for smooth browsing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse thousands of cars or get an instant AI-powered price prediction for your vehicle
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/cars"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Market Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/predict"
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors border-2 border-white/20"
            >
              Predict Price
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
