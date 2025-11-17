import { Link } from 'react-router-dom';
import { Car, TrendingUp, Search, BarChart3, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNGgyYzIuMjEgMCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Price Predictions</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect Car
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                At The Right Price
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Browse thousands of verified listings across Denmark. Get instant AI price predictions
              and make informed decisions with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cars"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-xl"
              >
                <Search className="w-5 h-5" />
                Browse Cars
              </Link>
              <Link
                to="/predict"
                className="inline-flex items-center justify-center gap-2 bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500/30 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Predict Price
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">30+</div>
                <div className="text-blue-200">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-200">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-200">Updated</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-xl text-gray-600">Everything you need to make the right car purchase</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Price Predictions</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant, accurate price estimates powered by machine learning trained on thousands of car listings.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Search</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced filtering by brand, model, year, price, fuel type, and more. Find exactly what you're looking for.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Market Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Access detailed statistics, trends, and analytics to understand the Danish car market better.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Verified Listings</h3>
            <p className="text-gray-600 leading-relaxed">
              All listings are scraped from trusted Danish car marketplaces and verified for accuracy.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Car className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Wide Selection</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse cars from all major brands including Toyota, VW, BMW, Mercedes, Tesla, and more.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-Time Updates</h3>
            <p className="text-gray-600 leading-relaxed">
              Our platform continuously scrapes and updates listings to ensure you get the latest deals.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of smart buyers making informed decisions with our AI-powered platform
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-10 py-5 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            <Search className="w-6 h-6" />
            Start Browsing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
