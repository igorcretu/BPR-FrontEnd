import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-50 rounded-full"></div>
            <svg
              className="w-64 h-64 mx-auto relative"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Car illustration */}
              <circle cx="100" cy="100" r="90" fill="#E0F2FE" opacity="0.5" />
              <path
                d="M60 110 L70 90 L130 90 L140 110 L140 130 L60 130 Z"
                fill="#3B82F6"
                opacity="0.8"
              />
              <circle cx="75" cy="130" r="8" fill="#1E40AF" />
              <circle cx="125" cy="130" r="8" fill="#1E40AF" />
              <rect x="75" y="95" width="15" height="12" fill="#60A5FA" />
              <rect x="95" y="95" width="15" height="12" fill="#60A5FA" />
              <rect x="115" y="95" width="15" height="12" fill="#60A5FA" />
            </svg>
          </div>
          <div className="text-9xl font-bold text-blue-600 -mt-16 animate-pulse">
            404
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Looks like this page took a wrong turn. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          
          <Link
            to="/cars"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Car className="w-5 h-5" />
            Market Analysis
          </Link>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 mb-8">
          <p className="text-sm text-gray-500 mb-6">
            Here are some helpful links instead:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              to="/" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/cars"
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              Market Analysis
            </Link>
            <Link 
              to="/predict" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              Price Prediction
            </Link>
            <Link 
              to="/market-statistics" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              Market Statistics
            </Link>
            <Link 
              to="/how-it-works" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              How It Works
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
