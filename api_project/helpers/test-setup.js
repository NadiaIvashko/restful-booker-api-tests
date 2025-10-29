const ApiClient = require('./api-client');

let apiClient;
let authToken;
let createdBookingId;

async function setupTests() {
  apiClient = new ApiClient();
  try {
    await apiClient.ping();
    console.log('✓ API is accessible');
  } catch (error) {
    console.warn('⚠ API ping failed, continuing with tests...');
  }
}

function beforeEachHook() {
  apiClient.clearToken();
  authToken = null;
}

async function afterAllHook() {
  if (createdBookingId && authToken) {
    try {
      apiClient.setToken(authToken);
      await apiClient.deleteBooking(createdBookingId);
      console.log(`✓ Cleaned up booking ${createdBookingId}`);
    } catch (error) {
      console.warn(`⚠ Failed to cleanup booking ${createdBookingId}:`, error.message);
    }
  }
}

function getApiClient() {
  return apiClient;
}

function getAuthToken() {
  return authToken;
}

function setAuthToken(token) {
  authToken = token;
}

function getCreatedBookingId() {
  return createdBookingId;
}

function setCreatedBookingId(id) {
  createdBookingId = id;
}

module.exports = {
  setupTests,
  beforeEachHook,
  afterAllHook,
  getApiClient,
  getAuthToken,
  setAuthToken,
  getCreatedBookingId,
  setCreatedBookingId
};

