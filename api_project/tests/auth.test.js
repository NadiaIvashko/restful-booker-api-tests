const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');
const { isSuccessfulAuth, isFailedAuth } = require('../helpers/authCheck');

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

    expect(isSuccessfulAuth(response)).toBe(true);
    expect(response.data.token).toBeDefined();
  });

  test('should fail authentication with invalid credentials', async () => {
    const response = await apiClient.createToken('invalid', 'invalid');

    expect(isFailedAuth(response)).toBe(true);
    expect(response.data.reason).toBe('Bad credentials');
  });

  test('should fail authentication with empty credentials', async () => {
    const response = await apiClient.createToken('', '');

    expect(isFailedAuth(response)).toBe(true);
    expect(response.data.reason).toBe('Bad credentials');
  });
});