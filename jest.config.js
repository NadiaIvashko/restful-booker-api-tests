module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/fixtures/**',
    '!tests/helpers/**',
    '!tests/data/**'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  testTimeout: 10000,
  
  verbose: true,
  
  clearMocks: true,
  
  restoreMocks: true,
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@helpers/(.*)$': '<rootDir>/tests/helpers/$1',
    '^@data/(.*)$': '<rootDir>/tests/data/$1'
  }
};
