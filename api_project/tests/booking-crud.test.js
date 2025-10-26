const ApiClient = require('../helpers/api-client');
const testData = require('../data/test-data');

describe('Booking CRUD Operations', () => {
  let apiClient;
  let authToken;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

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

    await apiClient.deleteBooking(response.data.bookingid);
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

