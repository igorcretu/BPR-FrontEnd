import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for jsdom
// @ts-ignore - These are Node.js globals, ignore TS errors in test setup
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;

// Mock window.scrollTo
// @ts-ignore
global.scrollTo = jest.fn();

// Mock ResizeObserver for Recharts
// @ts-ignore
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock IntersectionObserver
// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock import.meta.env
// @ts-ignore
(global as any).importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:8000',
  },
};
