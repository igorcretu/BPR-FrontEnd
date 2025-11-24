# CarPredict Frontend

[![CI/CD Pipeline](https://github.com/igorcretu/BPR-FrontEnd/actions/workflows/cd-cd.yml/badge.svg)](https://github.com/igorcretu/BPR-FrontEnd/actions/workflows/cd-cd.yml)

A modern, responsive web application for browsing cars and getting AI-powered price predictions for the Danish car market. Built with React, TypeScript, and Tailwind CSS.

![CarPredict](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## 🚀 Features

### Core Functionality
- **Car Browsing**: Browse through 28,000+ car listings from bilbasen.dk
- **Advanced Search**: Search by brand, model, or title with real-time results
- **Smart Filters**: Filter by brand, fuel type, transmission, body type, year range, and price range
- **AI Price Predictions**: Get instant XGBoost/CatBoost-powered price estimates with 85-90% accuracy
- **Market Statistics**: Interactive charts showing price distributions, brand popularity, and market trends
- **Detailed Car Views**: Comprehensive specifications including performance, electric specs, dimensions, safety features
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Real-time Data**: Database synchronized with latest market data from bilbasen.dk

### User Experience
- **Smooth Navigation**: Client-side routing with React Router
- **Auto Scroll**: Automatic scroll-to-top on page navigation
- **Image Loading**: Lazy loading with fallback for car images
- **Pagination**: Efficient pagination for browsing large datasets
- **Real-time Updates**: Data synchronized with backend API
- **Standardized Data**: Clean, English-labeled categories (7 fuel types, 9 body types)
- **Prediction Confidence**: ML predictions include confidence scores and price ranges

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3** - Modern UI library with hooks
- **TypeScript 5.6** - Type-safe development
- **Vite 6.0** - Lightning-fast build tool and dev server

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS preprocessing
- **Lucide React** - Beautiful icon library

### Routing & State
- **React Router v6** - Declarative routing
- **Axios** - HTTP client for API requests
- **React Hooks** - State management with useState, useEffect

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React SWC** - Fast refresh with SWC

## 📁 Project Structure

```
FrontEnd/
├── public/                 # Static assets
├── src/
│   ├── api/
│   │   └── client.ts      # Axios API client configuration
│   ├── assets/            # Images and static resources
│   ├── components/
│   │   └── ScrollToTop.tsx # Scroll management component
│   ├── pages/
│   │   ├── Home.tsx       # Landing page
│   │   ├── Cars.tsx       # Car listings with filters
│   │   ├── CarDetail.tsx  # Individual car details
│   │   ├── Predict.tsx    # Price prediction page
│   │   ├── HowItWorks.tsx # Platform explanation
│   │   └── AboutUs.tsx    # About and disclaimer
│   ├── utils/
│   │   └── carImages.ts   # Image loading utilities
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── netlify.toml           # Netlify deployment config
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- Backend API running (see API README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FrontEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔌 API Integration

The frontend communicates with the backend API for all data operations:

### API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cars` | GET | Fetch paginated car listings with filters |
| `/api/cars/:id` | GET | Get detailed car information |
| `/api/brands` | GET | Get list of available brands |
| `/api/filters` | GET | Get filter options (fuel types, transmissions, etc.) |
| `/api/predict` | POST | Get AI price prediction for a car |

### API Client Configuration

The API client is configured in `src/api/client.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## 🎨 Key Pages & Components

### Home Page (`Home.tsx`)
- Hero section with call-to-action
- Feature showcase (6 key features)
- Statistics display
- CTA section for browsing cars

### Cars Listing (`Cars.tsx`)
- Search functionality
- Advanced filters panel
- Grid layout with car cards
- Pagination controls
- Responsive design

### Car Detail (`CarDetail.tsx`)
- High-resolution car images
- Comprehensive specifications in 6 categories:
  - **Performance**: Horsepower, Torque, 0-100 km/h, Top Speed, Engine Size
  - **Electric**: Range, Battery, Consumption, AC/DC Charging, Charging Time
  - **Efficiency**: Fuel Consumption, CO₂ Emission, Euro Norm, Tank Capacity
  - **Body**: Body Type, Doors, Seats, Color, Drive Type, Gears, Cylinders
  - **Practical**: Weight, Trunk Size, Load Capacity, Towing Capacity, Tax
  - **Dimensions**: Length, Width, Height
  - **Safety**: ABS Brakes, ESP, Airbags
- Key details display: First Registration, Body Type, Tax, Category
- AI price prediction widget with confidence intervals
- Link to original bilbasen.dk listing

### Market Statistics (`MarketStatistics.tsx`)
- **Price Distribution**: Histogram showing market price ranges
- **Brand Popularity**: Top 15 brands by listing count
- **Fuel Type Distribution**: Pie chart of 7 standardized fuel types
- **Body Type Distribution**: Market share of 9 body types
- **Interactive Charts**: Built with Recharts library
- **Real-time Data**: Live statistics from PostgreSQL database

### How It Works (`HowItWorks.tsx`)
- 4-step process explanation
- Technical architecture overview
- Key features breakdown
- Technology stack display

### About Us (`AboutUs.tsx`)
- Mission statement
- Core values
- Team information
- Academic project disclaimer

## 🎭 Styling Guide

### Color Scheme
- **Primary Blue**: `#2563eb` (blue-600)
- **Dark Blue**: `#1e40af` (blue-700)
- **Light Blue**: `#dbeafe` (blue-100)
- **Success Green**: `#10b981` (green-500)
- **Warning Orange**: `#f59e0b` (orange-500)
- **Error Red**: `#ef4444` (red-500)

### Typography
- **Font Family**: System fonts (sans-serif)
- **Headings**: Bold, large sizes (text-4xl, text-3xl)
- **Body Text**: Regular weight, comfortable line-height

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📊 Performance Optimization

### Image Loading
- Lazy loading for car images
- Fallback icons for missing images
- Optimized image requests

### Code Splitting
- Route-based code splitting
- Dynamic imports for heavy components

### Caching
- API response caching
- Browser caching for static assets

### Build Optimization
- Minification with Vite
- Tree shaking for unused code
- CSS purging with Tailwind

## 🚀 Deployment

### Netlify Deployment

1. **Connect repository to Netlify**
2. **Build settings** (already configured in `netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
3. **Environment variables**:
   - Set `VITE_API_BASE_URL` to production API URL
4. **Deploy**: Push to main branch for automatic deployment

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload `dist/` folder to your hosting provider

3. Configure server for SPA routing (redirect all routes to `index.html`)

## 🧪 Development

### Code Quality
- **ESLint**: Enforces code standards
- **TypeScript**: Type checking at compile time
- **Prettier**: Code formatting (recommended)

### Git Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to remote: `git push origin feature/new-feature`
4. Create pull request

### Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🔧 Configuration Files

### `vite.config.ts`
Vite build configuration with React plugin and SWC

### `tsconfig.json`
TypeScript compiler options and paths

### `tailwind.config.js`
Tailwind CSS customization and theme

### `postcss.config.js`
PostCSS plugins including Tailwind and Autoprefixer

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

## 🐛 Common Issues & Solutions

### Issue: API connection failed
**Solution**: Check that backend is running and `VITE_API_BASE_URL` is correct

### Issue: Images not loading
**Solution**: Verify image URLs from backend or check fallback icon rendering

### Issue: Build fails
**Solution**: Delete `node_modules` and `dist`, run `npm install` again

### Issue: Slow performance
**Solution**: Check network tab for slow API calls, optimize images

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## 👥 Contributing

This is an academic project for VIA University College. External contributions are not accepted.

## 📄 License

This project is for educational purposes only. Not licensed for commercial use.

## 🎓 Academic Context

**Institution**: VIA University College, Denmark  
**Course**: Bachelor's Thesis Project  
**Team**: Group 26  
**Year**: 2024-2025  
**Purpose**: Educational demonstration of full-stack development and ML integration

## 🔗 Related Repositories

- **Backend API**: [BPR-BackEnd-API](https://github.com/igorcretu/BPR-BackEnd-API) - Flask REST API with ML predictions
- **ML Model**: [BPR-BackEnd-ML-Model](https://github.com/igorcretu/BPR-BackEnd-ML-Model) - Data pipeline and model training

## 📧 Contact

For academic inquiries, please contact VIA University College.

## 🌐 Live Demo

- **Frontend**: Deployed on Netlify
- **Backend API**: https://test.bachelorproject26.site
- **Database**: PostgreSQL on Raspberry Pi 5

---

**Note**: This platform is created solely for educational purposes and is not intended for commercial use. All car listings are scraped from bilbasen.dk for research purposes. Price predictions are educational estimates only.
