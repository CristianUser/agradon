'use strict';

module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/coverage/'],
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!coverage/**',
    '!**/node_modules/**',
    '!*.config.js',
    '!index.js',
    '**/*.js'
  ],
  coverageDirectory: 'coverage'
};
