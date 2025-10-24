const axios = require('axios');
require('dotenv').config();

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
      validateStatus: () => true
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`➡️  ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
          console.log("   Body:", JSON.stringify(config.data, null, 2));
        }
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error.message);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ Response error ${error.response?.status}: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Additional axios configuration
   * @returns {Promise} Axios response
   */
  async get(endpoint, config = {}) {
    return await this.client.get(endpoint, config);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios configuration
   * @returns {Promise} Axios response
   */
  async post(endpoint, data = {}, config = {}) {
    return await this.client.post(endpoint, data, config);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios configuration
   * @returns {Promise} Axios response
   */
  async put(endpoint, data = {}, config = {}) {
    return await this.client.put(endpoint, data, config);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios configuration
   * @returns {Promise} Axios response
   */
  async patch(endpoint, data = {}, config = {}) {
    return await this.client.patch(endpoint, data, config);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Additional axios configuration
   * @returns {Promise} Axios response
   */
  async delete(endpoint, config = {}) {
    return await this.client.delete(endpoint, config);
  }

  // ============================================
  // AUTH METHODS
  // ============================================

  /**
   * Create authentication token
   * POST /auth
   * @param {string} username - Username (default: admin)
   * @param {string} password - Password (default: password123)
   * @returns {Promise} Response with token
   */
  async createToken(username = 'admin', password = 'password123') {
    const response = await this.post('/auth', {
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
  // BOOKING METHODS
  // ============================================

  /**
   * Get all booking IDs
   * GET /booking
   * @param {object} params - Query parameters (firstname, lastname, checkin, checkout)
   * @returns {Promise} List of booking IDs
   */
  async getBookingIds(params = {}) {
    return await this.get('/booking', { params });
  }

  /**
   * Get booking by ID
   * GET /booking/:id
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Booking details
   */
  async getBooking(bookingId) {
    return await this.get(`/booking/${bookingId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Create new booking
   * POST /booking
   * @param {object} bookingData - Booking data
   * @returns {Promise} Created booking with ID
   */
  async createBooking(bookingData) {
    return await this.post('/booking', bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Update booking (full update - PUT)
   * PUT /booking/:id
   * @param {number} bookingId - Booking ID
   * @param {object} bookingData - Updated booking data
   * @returns {Promise} Updated booking
   */
  async updateBooking(bookingId, bookingData) {
    if (!this.token) {
      throw new Error('Authentication token required. Call createToken() first.');
    }

    return await this.put(`/booking/${bookingId}`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${this.token}`
      }
    });
  }

  /**
   * Partial update booking (PATCH)
   * PATCH /booking/:id
   * @param {number} bookingId - Booking ID
   * @param {object} partialData - Partial booking data to update
   * @returns {Promise} Updated booking
   */
  async partialUpdateBooking(bookingId, partialData) {
    if (!this.token) {
      throw new Error('Authentication token required. Call createToken() first.');
    }

    return await this.patch(`/booking/${bookingId}`, partialData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${this.token}`
      }
    });
  }

  /**
   * Delete booking
   * DELETE /booking/:id
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Delete confirmation
   */
  async deleteBooking(bookingId) {
    if (!this.token) {
      throw new Error('Authentication token required. Call createToken() first.');
    }

    return await this.delete(`/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${this.token}`
      }
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Health check - ping the API
   * GET /ping
   * @returns {Promise} Ping response (should return 201)
   */
  async ping() {
    return await this.get('/ping');
  }

  /**
   * Get current token
   * @returns {string|null} Current token
   */
  getToken() {
    return this.token;
  }

  /**
   * Set token manually
   * @param {string} token - Token to set
   */
  setToken(token) {
    this.token = token;
    console.log('🔑 Token set manually:', token);
  }

  /**
   * Clear token
   */
  clearToken() {
    this.token = null;
    console.log('🔓 Token cleared');
  }

}

module.exports = ApiClient;