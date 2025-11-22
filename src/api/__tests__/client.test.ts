import api from '../client';

describe('API Client', () => {
  test('is configured with correct baseURL', () => {
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.defaults.baseURL).toContain('/api');
  });

  test('has correct Content-Type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
