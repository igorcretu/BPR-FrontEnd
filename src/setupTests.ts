import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jsdom (Node.js built-in in v18+)
if (typeof global !== 'undefined') {
  // @ts-ignore - TextEncoder is available in Node.js
  global.TextEncoder = TextEncoder;
  // @ts-ignore - TextDecoder is available in Node.js
  global.TextDecoder = TextDecoder;

  // Mock window.scrollTo
  // @ts-ignore
  global.scrollTo = jest.fn();

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
}

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
if (typeof global !== 'undefined') {
  // @ts-ignore
  (global as any).importMeta = {
    env: {
      VITE_API_URL: 'http://localhost:8000',
    },
  };
}
