# Car Price Prediction Platform for the Danish Market

[![CI/CD Pipeline](https://github.com/igorcretu/BPR-FrontEnd/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/igorcretu/BPR-FrontEnd/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/28a2d6de-2a4c-4463-9e99-4d85707d6c48/deploy-status)](https://app.netlify.com/projects/bpr-g26/deploys)



> Bachelor Thesis Project - Group 26 | VIA University College

A comprehensive web platform for predicting car prices in the Danish automotive market using machine learning and real-time data scraping.

## 🎯 Project Overview

This project aims to provide accurate car price predictions for the Danish market by leveraging machine learning models trained on real-time scraped data from Danish automotive websites. The platform helps both buyers and sellers make informed decisions based on market trends and vehicle characteristics.

### Key Features

- 🚗 **Car Price Prediction** - ML-powered price estimation based on vehicle specifications
- 🔍 **Advanced Search & Filtering** - Browse and filter cars by make, model, year, mileage, and more
- 📊 **Market Analysis** - Visualize pricing trends and market insights
- 🔄 **Real-time Data** - Continuously updated database through automated web scraping
- 📱 **Responsive Design** - Seamless experience across desktop and mobile devices

## 🏗️ Architecture

### Frontend (This Repository)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** [TBD - Material-UI/Tailwind CSS/etc.]
- **State Management:** React Query + Context API
- **API Client:** Axios
- **Routing:** React Router v6
- **Deployment:** Netlify with CI/CD via GitHub Actions

### Backend ([BPR-Backend](https://github.com/BPR-Group26/BPR-Backend))
- **Framework:** Flask (Python)
- **ML Framework:** TensorFlow/Keras
- **Database:** PostgreSQL (Docker container)
- **Web Scraping:** Python (BeautifulSoup/Scrapy)
- **Hosting:** Raspberry Pi 5
- **API Documentation:** Swagger/OpenAPI

### Infrastructure
- **Reverse Proxy:** Cloudflare Tunnel (secure remote access)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Version Control:** Git & GitHub

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/igorcretu/BPR-FrontEnd.git
   cd BPR-FrontEnd
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env
```
   
   Edit `.env` and configure:
```env
   VITE_API_URL=http://your-raspberry-pi-ip:5000/api
```

4. **Start development server**
```bash
   npm run dev
```
   
   The app will be available at `http://localhost:5173`

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure
```
BPR-FrontEnd/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Reusable React components
│   │   ├── common/          # Shared components (Button, Input, etc.)
│   │   ├── car/             # Car-related components
│   │   └── prediction/      # Prediction form components
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── CarDetailsPage.tsx
│   │   └── PredictionPage.tsx
│   ├── services/            # API services
│   │   └── api.ts          # Axios configuration & API calls
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── .env.example            # Environment variables template
├── netlify.toml           # Netlify configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 🔗 API Integration

The frontend communicates with the Flask backend API running on Raspberry Pi:

### Endpoints
```typescript
GET    /api/cars              # Get all cars with pagination
GET    /api/cars/:id          # Get specific car details
POST   /api/predict           # Predict car price
GET    /api/stats             # Get market statistics
GET    /api/brands            # Get available car brands
GET    /api/models/:brand     # Get models for a brand
```

### Example API Call
```typescript
import { carApi } from './services/api';

// Predict car price
const prediction = await carApi.predictPrice({
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  mileage: 45000,
  fuel_type: 'Petrol',
  // ... other features
});

console.log(`Predicted price: ${prediction.price} DKK`);
```

## 🧪 Testing
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Automatic Deployment (CI/CD)

1. **Create a feature branch**
```bash
   git checkout -b feature/your-feature
```

2. **Make changes and commit**
```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature
```

3. **Create Pull Request on GitHub**
   - CI automatically runs tests and builds
   - Request review from team members
   - Merge when approved

4. **Automatic deployment to Netlify**
   - Deployment triggers automatically on merge to `main`
   - Live URL: `https://your-site.netlify.app`

### Manual Deployment
```bash
npm run build
# Build output in ./dist folder
# Deploy ./dist to your hosting service
```

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | CSS Modules / [TBD] |
| **HTTP Client** | Axios |
| **State Management** | React Query + Context |
| **Routing** | React Router v6 |
| **Charts/Visualization** | [TBD - Recharts/Chart.js] |
| **Form Handling** | React Hook Form |
| **Validation** | Zod / Yup |
| **Testing** | Vitest + React Testing Library |
| **CI/CD** | GitHub Actions |
| **Hosting** | Netlify |

## 👥 Team - Group 26

- **Igor Crețu** - Full-stack Development & ML Integration
- [Team Member 2] - [Role]
- [Team Member 3] - [Role]

**Supervisor:** [Supervisor Name]  
**Institution:** VIA University College - Software Technology Engineering  
**Academic Year:** 2024/2025

## 📚 Related Repositories

- [Backend API & ML Models](https://github.com/BPR-Group26/BPR-Backend)
- [Documentation](https://github.com/BPR-Group26/BPR-Documentation)
