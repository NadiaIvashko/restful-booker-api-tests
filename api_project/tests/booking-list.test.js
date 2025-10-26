const ApiClient = require('../helpers/api-client');

describe('Get All Bookings', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

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
    const response = await apiClient.getBookingIds({ firstname: testData.firstname, lastname: testData.lastname });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter bookings by check-in date', async () => {
    const response = await apiClient.getBookingIds({ checkin: testData.checkin });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter bookings by check-out date', async () => {
    const response = await apiClient.getBookingIds({ checkout: testData.checkout });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

