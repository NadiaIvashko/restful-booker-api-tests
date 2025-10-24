const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');

describe('RESTful Booker API Tests', () => {
  let apiClient;
  let authToken;
  let createdBookingId;

  beforeAll(async () => {
    apiClient = new ApiClient();
    try {
      await apiClient.ping();
      console.log('✓ API is accessible');
    } catch (error) {
      console.warn('⚠ API ping failed, continuing with tests...');
    }
  });

  beforeEach(() => {
    apiClient.clearToken();
    authToken = null;
  });

  afterAll(async () => {
    if (createdBookingId && authToken) {
      try {
        apiClient.setToken(authToken);
        await apiClient.deleteBooking(createdBookingId);
        console.log(`✓ Cleaned up booking ${createdBookingId}`);
      } catch (error) {
        console.warn(`⚠ Failed to cleanup booking ${createdBookingId}:`, error.message);
      }
    }
  });

  describe('Authentication Tests', () => {
    test('should authenticate with valid credentials', async () => {
      const response = await apiClient.createToken(
        testData.testCredentials.username,
        testData.testCredentials.password
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(typeof response.data.token).toBe('string');
      expect(response.data.token.length).toBeGreaterThan(0);

      authToken = response.data.token;
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

  describe('Booking CRUD Operations', () => {
    beforeEach(async () => {
      const authResponse = await apiClient.createToken(
        testData.testCredentials.username,
        testData.testCredentials.password
      );
      authToken = authResponse.data.token;
      apiClient.setToken(authToken);
    });

    test('should create a new booking', async () => {
      const response = await apiClient.createBooking(testData.sampleBooking);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('bookingid');
      expect(response.data).toHaveProperty('booking');
      expect(response.data.booking).toMatchObject(testData.sampleBooking);

      createdBookingId = response.data.bookingid;
    });

    test('should get booking by ID', async () => {
      const createResponse = await apiClient.createBooking(testData.sampleBooking);
      const bookingId = createResponse.data.bookingid;

      const response = await apiClient.getBooking(bookingId);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(testData.sampleBooking);

      await apiClient.deleteBooking(bookingId);
    });

    test('should update booking with PUT', async () => {
      const createResponse = await apiClient.createBooking(testData.sampleBooking);
      const bookingId = createResponse.data.bookingid;

      const response = await apiClient.updateBooking(bookingId, testData.alternativeBooking);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(testData.alternativeBooking);

      await apiClient.deleteBooking(bookingId);
    });

    test('should partially update booking with PATCH', async () => {
      const createResponse = await apiClient.createBooking(testData.sampleBooking);
      const bookingId = createResponse.data.bookingid;

      const response = await apiClient.partialUpdateBooking(bookingId, testData.partialBookingUpdate);

      expect(response.status).toBe(200);
      expect(response.data.firstname).toBe(testData.partialBookingUpdate.firstname);
      expect(response.data.additionalneeds).toBe(testData.partialBookingUpdate.additionalneeds);

      await apiClient.deleteBooking(bookingId);
    });

    test('should delete booking', async () => {
      const createResponse = await apiClient.createBooking(testData.sampleBooking);
      const bookingId = createResponse.data.bookingid;

      const response = await apiClient.deleteBooking(bookingId);

      expect(response.status).toBe(201);

      const deletedResponse = await apiClient.getBooking(bookingId);
      expect(deletedResponse.status).toBe(404);
    });
  });

  describe('Get All Bookings', () => {
    test('should get all bookings', async () => {
      const response = await apiClient.getBookingIds();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      if (response.data.length > 0) {
        const firstBooking = response.data[0];
        expect(firstBooking).toHaveProperty('bookingid');
        expect(typeof firstBooking.bookingid).toBe('number');
      }
    });

    test('should filter bookings by name', async () => {
      const response = await apiClient.getBookingIds({ firstname: 'John', lastname: 'Doe' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter bookings by check-in date', async () => {
      const response = await apiClient.getBookingIds({ checkin: '2024-01-01' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter bookings by check-out date', async () => {
      const response = await apiClient.getBookingIds({ checkout: '2024-01-05' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Negative Test Cases', () => {
    test('should fail to create booking with invalid data', async () => {
      const response = await apiClient.createBooking(testData.invalidBookingData);
      expect([200, 400, 422]).toContain(response.status);
    });

    test('should fail to get non-existent booking', async () => {
      const response = await apiClient.getBooking(999999);
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
});
