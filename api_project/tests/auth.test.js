const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');

describe('Authentication Tests', () => {
  let apiClient;

  beforeAll(async () => {
    apiClient = new ApiClient();
  });

  beforeEach(() => {
    apiClient.clearToken();
  });

  test('should authenticate with valid credentials', async () => {
    const response = await apiClient.createToken(
      testData.testCredentials.username,
      testData.testCredentials.password
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(typeof response.data.token).toBe('string');
    expect(response.data.token.length).toBeGreaterThan(0);
  });

  test('should fail authentication with invalid credentials', async () => {
    const response = await apiClient.createToken('invalid', 'invalid');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('reason');
    expect(response.data.reason).toBe('Bad credentials');
  });

  test('should fail authentication with empty credentials', async () => {
    const response = await apiClient.createToken('', '');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('reason');
    expect(response.data.reason).toBe('Bad credentials');
  });
});

