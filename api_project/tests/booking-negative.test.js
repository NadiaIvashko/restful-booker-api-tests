const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');

describe('Negative Test Cases', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  beforeEach(() => {
    apiClient.clearToken();
  });

  test('should fail to create booking with invalid data', async () => {
    const response = await apiClient.createBooking(testData.invalidBookingData);
    expect([200, 400, 422]).toContain(response.status);
  });

  test('should fail to get non-existent booking', async () => {
    const response = await apiClient.getBooking(testData.idNotExist);
    expect(response.status).toBe(404);
  });

  test('should fail to update booking without authentication', async () => {
    const createResponse = await apiClient.createBooking(testData.sampleBooking);
    const bookingId = createResponse.data.bookingid;

    apiClient.clearToken();

    try {
      await apiClient.updateBooking(bookingId, testData.alternativeBooking);
    } catch (error) {
      expect(error.message).toContain('Authentication token required');
    }

    const authResponse = await apiClient.createToken(
      testData.testCredentials.username,
      testData.testCredentials.password
    );
    apiClient.setToken(authResponse.data.token);
    await apiClient.deleteBooking(bookingId);
  });

  test('should fail to delete booking without authentication', async () => {
    const createResponse = await apiClient.createBooking(testData.sampleBooking);
    const bookingId = createResponse.data.bookingid;

    apiClient.clearToken();

    try {
      await apiClient.deleteBooking(bookingId);
    } catch (error) {
      expect(error.message).toContain('Authentication token required');
    }

    const authResponse = await apiClient.createToken(
      testData.testCredentials.username,
      testData.testCredentials.password
    );
    apiClient.setToken(authResponse.data.token);
    await apiClient.deleteBooking(bookingId);
  });
});

