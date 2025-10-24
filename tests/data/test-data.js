
const sampleBooking = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 100,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-01-01',
    checkout: '2024-01-05'
  },
  additionalneeds: 'Breakfast'
};

const alternativeBooking = {
  firstname: 'Jane',
  lastname: 'Smith',
  totalprice: 200,
  depositpaid: false,
  bookingdates: {
    checkin: '2024-02-01',
    checkout: '2024-02-10'
  },
  additionalneeds: 'WiFi'
};

const testCredentials = {
  username: 'admin',
  password: 'password123'
};

const invalidBookingData = {
  firstname: '',
  lastname: '',
  totalprice: -100,
  depositpaid: 'invalid',
  bookingdates: {
    checkin: 'invalid-date',
    checkout: '2024-01-01'
  }
};

const partialBookingUpdate = {
  firstname: 'UpdatedName',
  additionalneeds: 'Updated needs'
};

const dataGenerators = {
  generateRandomBooking: () => ({
    firstname: `TestUser${Math.floor(Math.random() * 1000)}`,
    lastname: `LastName${Math.floor(Math.random() * 1000)}`,
    totalprice: Math.floor(Math.random() * 1000) + 50,
    depositpaid: Math.random() > 0.5,
    bookingdates: {
      checkin: '2024-06-01',
      checkout: '2024-06-05'
    },
    additionalneeds: 'Random needs'
  })
};

module.exports = {
  sampleBooking,
  alternativeBooking,
  testCredentials,
  invalidBookingData,
  partialBookingUpdate,
  dataGenerators
};
