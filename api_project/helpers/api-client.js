const axios = require('axios');
require('dotenv').config();
const errors = require('../data/errors');
const urls = require('../data/urls');
class ApiClient {
  constructor(baseURL = 'https://restful-booker.herokuapp.com') {
    this.baseURL = baseURL;
    this.timeout = 15000;
    this.token = null;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Accept any HTTP status without throwing errors
      validateStatus: () => true
    });
  }

  async get(endpoint, config = {}) {
    return await this.client.get(endpoint, config);
  }

  async post(endpoint, data = {}, config = {}) {
    return await this.client.post(endpoint, data, config);
  }

  async put(endpoint, data = {}, config = {}) {
    return await this.client.put(endpoint, data, config);
  }
  async patch(endpoint, data = {}, config = {}) {
    return await this.client.patch(endpoint, data, config);
  }

  async delete(endpoint, config = {}) {
    return await this.client.delete(endpoint, config);
  }

  // ============================================
  // AUTH METHODS
  // ============================================

  async createToken(username = 'admin', password = 'password123') {
    const response = await this.post(urls.auth, {
      username,
      password
    });
    
    if (response.status === 200 && response.data.token) {
      this.token = response.data.token;
      console.log('🔑 Token saved:', this.token);
    }
    
    return response;
  }

// ============================================
// PRIVATE HELPER METHODS
// ============================================

_getJsonHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

_getAuthHeaders() {
  return {
    ...this._getJsonHeaders(),
    'Cookie': `token=${this.token}`
  };
}

async _authenticatedRequest(method, endpoint, data = null) {
  this.checkToken();
  
  const config = { headers: this._getAuthHeaders() };
  
  if (data) {
    return await this[method](endpoint, data, config);
  }
  return await this[method](endpoint, config);
}

// ============================================
// BOOKING METHODS
// ============================================

async getBookingIds(params = {}) {
  return await this.get(urls.booking, { params });
}

async getBooking(bookingId) {
  return await this.get(urls.getBookingById(bookingId));
}

async createBooking(bookingData) {
  return await this.post( urls.booking, bookingData, {
    headers: this._getJsonHeaders()
  });
}

async updateBooking(bookingId, bookingData) {
  return await this._authenticatedRequest('put', urls.getBookingById(bookingId), bookingData);
}

async partialUpdateBooking(bookingId, partialData) {
  return await this._authenticatedRequest('patch', urls.getBookingById(bookingId), partialData);
}

async deleteBooking(bookingId) {
  return await this._authenticatedRequest('delete', urls.getBookingById(bookingId));
}

// ============================================
// UTILITY METHODS
// ============================================

async ping() {
  return await this.get(urls.ping);
}

checkToken() {
  if (!this.token) {
    throw new Error(errors.tokenNotFound);
  }
}

getToken() {
  return this.token;
}

setToken(token) {
  this.token = token;
  console.log('🔑 Token set manually:', token);
}

clearToken() {
  this.token = null;
  console.log('🔓 Token cleared');
}

}

module.exports = ApiClient;
