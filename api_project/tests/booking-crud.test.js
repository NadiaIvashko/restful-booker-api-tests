const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');

describe('Booking CRUD Operations', () => {
  let apiClient;
  let authToken;
  let createdBookingIds = [];

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  beforeEach(async () => {
    createdBookingIds = [];
    const authResponse = await apiClient.createToken(
      testData.testCredentials.username,
      testData.testCredentials.password
    );
    authToken = authResponse.data.token;
    apiClient.setToken(authToken);
  });

  afterEach(async () => {
    for (const bookingId of createdBookingIds) {
      try {
        await apiClient.deleteBooking(bookingId);
      } catch (error) {
        console.warn(`Failed to delete booking ${bookingId}:`, error.message);
      }
    }
  });

  async function createAndTrackBooking(bookingData, trackForCleanup = true) {
    const response = await apiClient.createBooking(bookingData);
    if (trackForCleanup && response.data?.bookingid) {
      createdBookingIds.push(response.data.bookingid);
    }
    return response;
  }

  test('should create a new booking', async () => {
    const response = await createAndTrackBooking(testData.sampleBooking);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('bookingid');
    expect(response.data).toHaveProperty('booking');
    expect(response.data.booking).toMatchObject(testData.sampleBooking);
  });

  test('should get booking by ID', async () => {
    const createResponse = await createAndTrackBooking(testData.sampleBooking);
    const bookingId = createResponse.data.bookingid;
    const response = await apiClient.getBooking(bookingId);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(testData.sampleBooking);
  });

  test('should update booking with PUT', async () => {
    const createResponse = await createAndTrackBooking(testData.sampleBooking);
    const bookingId = createResponse.data.bookingid;
    const response = await apiClient.updateBooking(bookingId, testData.alternativeBooking);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(testData.alternativeBooking);
  });

  test('should partially update booking with PATCH', async () => {
    const createResponse = await createAndTrackBooking(testData.sampleBooking);
    const bookingId = createResponse.data.bookingid;
    const response = await apiClient.partialUpdateBooking(bookingId, testData.partialBookingUpdate);

    expect(response.status).toBe(200);
    expect(response.data.firstname).toBe(testData.partialBookingUpdate.firstname);
    expect(response.data.additionalneeds).toBe(testData.partialBookingUpdate.additionalneeds);
  });

  test('should delete booking', async () => {
    const createResponse = await createAndTrackBooking(testData.sampleBooking, false);
    const bookingId = createResponse.data.bookingid;
    const response = await apiClient.deleteBooking(bookingId);

    expect(response.status).toBe(201);

    const deletedResponse = await apiClient.getBooking(bookingId);
    expect(deletedResponse.status).toBe(404);
  });
});